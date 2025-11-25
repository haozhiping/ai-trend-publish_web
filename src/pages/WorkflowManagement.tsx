import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Select, 
  TimePicker, 
  Switch,
  message,
  Popconfirm,
  Tooltip,
  Input,
  Checkbox
} from 'antd'
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { Option } = Select

interface Workflow {
  id: number
  name: string
  type: string
  status: 'running' | 'stopped' | 'error'
  schedule?: string | null
  lastRun?: string | null
  nextRun?: string | null
  description?: string | null
}

const WorkflowManagement: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [form] = Form.useForm()

  // 后端工作流类型（与后端 WorkflowType 枚举保持一致）
  const workflowTypes = [
    { value: 'weixin-article-workflow', label: '微信文章工作流' },
    { value: 'weixin-aibench-workflow', label: 'AI模型排行榜' },
    { value: 'weixin-hellogithub-workflow', label: 'GitHub热门项目' },
    { value: 'video-generate-workflow', label: '短视频生成' }
  ]

  const loadWorkflows = async () => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/workflows`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '加载工作流失败')
        return
      }
      setWorkflows(data.data || [])
    } catch (e) {
      console.error(e)
      message.error('加载工作流失败，请检查后端服务')
    }
  }

  useEffect(() => {
    loadWorkflows()
  }, [])

  const handleStatusChange = async (id: number, action: 'start' | 'stop') => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/workflows/${id}/${action}`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || `工作流${action === 'start' ? '启动' : '停止'}失败`)
        return
      }
      message.success(`工作流已${action === 'start' ? '启动' : '停止'}`)
      loadWorkflows()
    } catch (e) {
      console.error(e)
      message.error(`工作流${action === 'start' ? '启动' : '停止'}失败`)
    }
  }

  const handleEdit = (workflow: Workflow) => {
    setEditingWorkflow(workflow)

    // 解析 Cron 表达式回填表单
    // 标准 5 位格式: 分 时 日 月 周
    let scheduleTime = null
    let frequency: 'daily' | 'weekly' | 'monthly' = 'daily'
    let weekDays: number[] | undefined
    let monthDay: number | undefined

    if (workflow.schedule) {
      const parts = workflow.schedule.trim().split(/\s+/)
      if (parts.length === 5) {
        const [minuteStr, hourStr, dayStr, , weekStr] = parts
        const minute = parseInt(minuteStr, 10)
        const hour = parseInt(hourStr, 10)
        if (!Number.isNaN(minute) && !Number.isNaN(hour)) {
          scheduleTime = dayjs().hour(hour).minute(minute)
        }

        // 推断频率
        if (dayStr !== '*' && weekStr === '*') {
          // 每月固定某一天: 分 时 日 * *
          frequency = 'monthly'
          const d = parseInt(dayStr, 10)
          if (!Number.isNaN(d)) {
            monthDay = d
          }
        } else if (dayStr === '*' && weekStr !== '*') {
          // 每周的某几天: 分 时 * * 周
          frequency = 'weekly'
          weekDays = weekStr.split(',').map((v) => parseInt(v, 10)).filter((v) => !Number.isNaN(v))
        } else {
          // 其他情况默认按每天处理: 分 时 * * *
          frequency = 'daily'
        }
      }
    }

    form.setFieldsValue({
      ...workflow,
      scheduleTime,
      frequency,
      weekDays,
      monthDay,
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/workflows/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '删除工作流失败')
        return
      }
      message.success('工作流已删除')
      loadWorkflows()
    } catch (e) {
      console.error(e)
      message.error('删除工作流失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      // 生成 Cron 表达式（5 位标准格式：分 时 日 月 周）
      // node-cron 只支持 5 位，不支持秒字段
      const minute = values.scheduleTime.minute()
      const hour = values.scheduleTime.hour()
      const frequency = values.frequency || 'daily'

      let schedule = ''
      if (frequency === 'weekly') {
        const weekDays: number[] = values.weekDays || []
        const weekField = weekDays.length > 0 ? weekDays.join(',') : '*'
        schedule = `${minute} ${hour} * * ${weekField}`
      } else if (frequency === 'monthly') {
        const day: number = values.monthDay
        const dayField = day || 1
        schedule = `${minute} ${hour} ${dayField} * *`
      } else {
        // 每天执行
        schedule = `${minute} ${hour} * * *`
      }

      const payload = {
        name: values.name,
        type: values.type,
        description: values.description,
        schedule,
        config: values.config || {} // 包含工作流配置（如钉钉关键词等）
      }

      let url = `${getApiBaseUrl()}/workflows`
      let method: 'POST' | 'PUT' = 'POST'

      if (editingWorkflow) {
        url = `${getApiBaseUrl()}/workflows/${editingWorkflow.id}`
        method = 'PUT'
      }

      const resp = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })

      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || (editingWorkflow ? '工作流已更新失败' : '工作流创建失败'))
        return
      }

      message.success(editingWorkflow ? '工作流已更新' : '工作流已创建')
      loadWorkflows()
      
      setIsModalVisible(false)
      setEditingWorkflow(null)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleRunNow = async (workflow: Workflow) => {
    try {
      message.loading({ content: `正在执行工作流: ${workflow.name}`, key: 'run' })
      const resp = await fetch(`${getApiBaseUrl()}/workflows/${workflow.id}/execute`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error({ content: data?.message || '执行工作流失败', key: 'run' })
        return
      }
      message.success({ content: '工作流已开始执行', key: 'run' })
      loadWorkflows()
    } catch (e) {
      console.error(e)
      message.error({ content: '执行工作流失败', key: 'run' })
    }
  }

  const columns = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Workflow) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeInfo = workflowTypes.find(t => t.value === type)
        return <Tag color="blue">{typeInfo?.label || type}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          running: { color: 'success', text: '运行中' },
          stopped: { color: 'default', text: '已停止' },
          error: { color: 'error', text: '错误' }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '调度时间',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (schedule: string) => {
        if (!schedule) return <Tag>未配置</Tag>
        const parts = schedule.split(' ')
        if (parts.length !== 5) {
          return (
            <Tooltip title={`Cron表达式: ${schedule}`}>
              <Tag icon={<ClockCircleOutlined />}>{schedule}</Tag>
            </Tooltip>
          )
        }

        const [minute, hour, day, , week] = parts
        const timeText = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`

        let prefix = '每天'
        if (day !== '*' && week === '*') {
          prefix = `每月${day}日`
        } else if (day === '*' && week !== '*') {
          prefix = `每周(${week})`
        }

        return (
          <Tooltip title={`Cron表达式: ${schedule}`}>
            <Tag icon={<ClockCircleOutlined />}>{`${prefix} ${timeText}`}</Tag>
          </Tooltip>
        )
      }
    },
    {
      title: '上次运行',
      dataIndex: 'lastRun',
      key: 'lastRun'
    },
    {
      title: '下次运行',
      dataIndex: 'nextRun',
      key: 'nextRun'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Workflow) => (
        <Space>
          {record.status === 'running' ? (
            <Button
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'stop')}
            >
              停止
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'start')}
            >
              启动
            </Button>
          )}
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleRunNow(record)}
          >
            立即执行
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个工作流吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title="工作流管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingWorkflow(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            新建工作流
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={workflows}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={editingWorkflow ? '编辑工作流' : '新建工作流'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingWorkflow(null)
          form.resetFields()
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'stopped',
            frequency: 'daily'
          }}
        >
          <Form.Item
            name="name"
            label="工作流名称"
            rules={[{ required: true, message: '请输入工作流名称' }]}
          >
            <Input placeholder="请输入工作流名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="工作流类型"
            rules={[{ required: true, message: '请选择工作流类型' }]}
          >
            <Select placeholder="请选择工作流类型">
              {workflowTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="frequency"
            label="执行频率"
            rules={[{ required: true, message: '请选择执行频率' }]}
          >
            <Select>
              <Option value="daily">每天</Option>
              <Option value="weekly">每周</Option>
              <Option value="monthly">每月</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduleTime"
            label="执行时间"
            rules={[{ required: true, message: '请选择执行时间' }]}
          >
            <TimePicker format="HH:mm" placeholder="选择执行时间" />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.frequency !== cur.frequency}>
            {({ getFieldValue }) => {
              const freq = getFieldValue('frequency')
              if (freq === 'weekly') {
                return (
                  <Form.Item
                    name="weekDays"
                    label="执行星期"
                    rules={[{ required: true, message: '请选择执行星期' }]}
                  >
                    <Checkbox.Group
                      options={[
                        { label: '周一', value: 1 },
                        { label: '周二', value: 2 },
                        { label: '周三', value: 3 },
                        { label: '周四', value: 4 },
                        { label: '周五', value: 5 },
                        { label: '周六', value: 6 },
                        { label: '周日', value: 0 }
                      ]}
                    />
                  </Form.Item>
                )
              }

              if (freq === 'monthly') {
                return (
                  <Form.Item
                    name="monthDay"
                    label="执行日期"
                    rules={[{ required: true, message: '请选择执行日期' }]}
                  >
                    <Select placeholder="请选择日期（1-31）">
                      {Array.from({ length: 31 }).map((_, idx) => (
                        <Option key={idx + 1} value={idx + 1}>
                          每月 {idx + 1} 日
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )
              }

              return null
            }}
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入工作流描述" />
          </Form.Item>

          {workflowType === 'video-generate-workflow' && (
            <>
              <Form.Item
                name={['config', 'dingtalkKeyword']}
                label="钉钉通知关键词"
                tooltip="钉钉机器人需要消息中包含此关键词才能发送。留空则使用系统默认关键词"
              >
                <Input placeholder="工作流" />
              </Form.Item>
              <Form.Item
                name={['config', 'videoUrls']}
                label="视频链接（可选，多个用逗号分隔）"
              >
                <Input.TextArea rows={2} placeholder="https://example.com/video1.mp4,https://example.com/video2.mp4" />
              </Form.Item>
              <Form.Item
                name={['config', 'videoFiles']}
                label="本地视频文件路径（可选，多个用逗号分隔）"
              >
                <Input.TextArea rows={2} placeholder="D:\videos\source1.mp4,D:\videos\source2.mp4" />
              </Form.Item>
              <Form.Item
                name={['config', 'voiceModel']}
                label="音色模型"
              >
                <Select placeholder="选择音色模型" defaultValue="zh-CN-XiaoxiaoNeural">
                  <Option value="zh-CN-XiaoxiaoNeural">晓晓（女声，推荐）</Option>
                  <Option value="zh-CN-YunxiNeural">云希（男声）</Option>
                  <Option value="zh-CN-YunyangNeural">云扬（男声）</Option>
                  <Option value="zh-CN-XiaoyiNeural">晓伊（女声）</Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default WorkflowManagement