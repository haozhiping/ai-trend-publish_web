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
  Input
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
    { value: 'weixin-hellogithub-workflow', label: 'GitHub热门项目' }
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
    form.setFieldsValue({
      ...workflow,
      scheduleTime: dayjs(workflow.schedule, 'H m * * *')
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
      const scheduleTime = values.scheduleTime.format('H m')
      const schedule = `0 ${scheduleTime} * * *`

      const payload = {
        name: values.name,
        type: values.type,
        description: values.description,
        schedule
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
      render: (schedule: string) => (
        <Tooltip title={`Cron表达式: ${schedule}`}>
          <Tag icon={<ClockCircleOutlined />}>
            {schedule.split(' ').slice(1, 3).join(':')}
          </Tag>
        </Tooltip>
      )
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
            status: 'stopped'
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
            name="scheduleTime"
            label="执行时间"
            rules={[{ required: true, message: '请选择执行时间' }]}
          >
            <TimePicker format="HH:mm" placeholder="选择执行时间" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入工作流描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default WorkflowManagement