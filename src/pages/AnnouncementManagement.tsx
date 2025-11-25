import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select,
  Tag,
  message,
  Popconfirm,
  Tooltip,
  DatePicker,
  Radio,
  Typography,
  Divider,
  Alert
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  NotificationOutlined,
  UserOutlined,
  CalendarOutlined,
  SearchOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography

interface Announcement {
  id: number
  title: string
  content: string
  level: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'published'
  target: 'all' | 'admin' | 'user'
  publishTime: string
  creatorName?: string
  readCount: number
}

const AnnouncementManagement: React.FC = () => {
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchStatus, setSearchStatus] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewAnnouncement, setPreviewAnnouncement] = useState<Announcement | null>(null)
  const [form] = Form.useForm()

  const announcementTypes = [
    { value: 'info', label: '信息', icon: <InfoCircleOutlined />, color: 'blue' },
    { value: 'success', label: '成功', icon: <CheckCircleOutlined />, color: 'green' },
    { value: 'warning', label: '警告', icon: <ExclamationCircleOutlined />, color: 'orange' },
    { value: 'error', label: '错误', icon: <CloseCircleOutlined />, color: 'red' }
  ]

  const priorityOptions = [
    { value: 'low', label: '低', color: 'default' },
    { value: 'medium', label: '中', color: 'blue' },
    { value: 'high', label: '高', color: 'orange' },
    { value: 'urgent', label: '紧急', color: 'red' }
  ]

  const targetUserOptions = [
    { value: 'all', label: '所有用户' },
    { value: 'admin', label: '管理员' },
    { value: 'user', label: '普通用户' }
  ]

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const resp = await fetch(`${getApiBaseUrl()}/announcements`, {
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '获取公告失败')
        return
      }
      const announcementList = (data.data || []).map((item: any) => ({
        ...item,
        readCount: item.readCount ?? 0,
      }))
      setAllAnnouncements(announcementList)
      setAnnouncements(announcementList)
    } catch (error) {
      console.error(error)
      message.error('获取公告失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    form.setFieldsValue({
      ...announcement,
      publishTime: dayjs(announcement.publishTime),
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/announcements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '删除公告失败')
        return
      }
      message.success('公告已删除')
      fetchAnnouncements()
    } catch (error) {
      console.error(error)
      message.error('删除公告失败')
    }
  }

  const handlePreview = (announcement: Announcement) => {
    setPreviewAnnouncement(announcement)
    setPreviewVisible(true)
  }

  const handlePublish = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/announcements/${id}/publish`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '发布失败')
        return
      }
      message.success('公告已发布')
      fetchAnnouncements()
    } catch (error) {
      console.error(error)
      message.error('发布失败')
    }
  }

  const handleUnpublish = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/announcements/${id}/unpublish`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '撤回失败')
        return
      }
      message.success('公告已撤回')
      fetchAnnouncements()
    } catch (error) {
      console.error(error)
      message.error('撤回失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        publishTime: values.publishTime
          ? values.publishTime.format('YYYY-MM-DD HH:mm:ss')
          : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        level: values.level || 'info',
        target: values.target || 'all',
      }

      const method = editingAnnouncement ? 'PUT' : 'POST'
      const url = editingAnnouncement
        ? `${getApiBaseUrl()}/announcements/${editingAnnouncement.id}`
        : `${getApiBaseUrl()}/announcements`

      const resp = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '保存公告失败')
        return
      }

      message.success(editingAnnouncement ? '公告已更新' : '公告已创建')
      setIsModalVisible(false)
      setEditingAnnouncement(null)
      form.resetFields()
      fetchAnnouncements()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const getTypeTag = (type: string) => {
    const typeInfo = announcementTypes.find(t => t.value === type)
    return (
      <Tag color={typeInfo?.color} icon={typeInfo?.icon}>
        {typeInfo?.label}
      </Tag>
    )
  }

  const getPriorityTag = (priority: string) => {
    const priorityInfo = priorityOptions.find(p => p.value === priority)
    return <Tag color={priorityInfo?.color}>{priorityInfo?.label}</Tag>
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      draft: { color: 'default', text: '草稿' },
      published: { color: 'success', text: '已发布' },
      expired: { color: 'error', text: '已过期' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns = [
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text: string, record: Announcement) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>{text}</Text>
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {getTypeTag(record.level)}
            {getPriorityTag(record.priority)}
          </div>
        </div>
      )
    },
    {
      title: '目标用户',
      dataIndex: 'target',
      key: 'target',
      width: 100,
      render: (target: string) => {
        const option = targetUserOptions.find(o => o.value === target)
        return <Tag color="blue">{option?.label}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      key: 'readCount',
      width: 80,
      render: (count: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <UserOutlined style={{ fontSize: 12, color: '#666' }} />
          <Text>{count}</Text>
        </div>
      )
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 150,
      render: (time: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CalendarOutlined style={{ fontSize: 12, color: '#666' }} />
          <Text style={{ fontSize: 12 }}>{time}</Text>
        </div>
      )
    },
    {
      title: '创建者',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: 100
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record: Announcement) => (
        <Space>
          <Tooltip title="预览">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <Tooltip title="发布">
              <Button
                size="small"
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handlePublish(record.id)}
              />
            </Tooltip>
          )}
          {record.status === 'published' && (
            <Tooltip title="撤回">
              <Button
                size="small"
                icon={<SendOutlined style={{ transform: 'rotate(180deg)' }} />}
                onClick={() => handleUnpublish(record.id)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="确定要删除这个公告吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <NotificationOutlined />
            <span>通知公告管理</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingAnnouncement(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            新建公告
          </Button>
        }
      >
        <Alert
          message="公告管理说明"
          description="通过公告功能可以向用户发布重要通知、系统更新、维护信息等。支持设置优先级、目标用户群体和有效期。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Table
          columns={columns}
          dataSource={announcements}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      {/* 编辑/新建公告模态框 */}
      <Modal
        title={editingAnnouncement ? '编辑公告' : '新建公告'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingAnnouncement(null)
          form.resetFields()
        }}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            level: 'info',
            priority: 'medium',
            target: 'all',
            publishTime: dayjs()
          }}
        >
          <Form.Item
            name="title"
            label="公告标题"
            rules={[{ required: true, message: '请输入公告标题' }]}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="公告内容"
            rules={[{ required: true, message: '请输入公告内容' }]}
          >
            <TextArea rows={6} placeholder="请输入公告内容" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="level"
              label="公告类型"
              rules={[{ required: true, message: '请选择公告类型' }]}
            >
              <Select placeholder="请选择公告类型">
                {announcementTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    <Space>
                      {type.icon}
                      {type.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请选择优先级' }]}
            >
              <Select placeholder="请选择优先级">
                {priorityOptions.map(priority => (
                  <Option key={priority.value} value={priority.value}>
                    {priority.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="target"
            label="目标用户"
            rules={[{ required: true, message: '请选择目标用户' }]}
          >
            <Radio.Group>
              {targetUserOptions.map(option => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="publishTime"
            label="发布时间"
            rules={[{ required: true, message: '请选择发布时间' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              placeholder="选择发布时间"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 预览公告模态框 */}
      <Modal
        title="公告预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={600}
      >
        {previewAnnouncement && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>{previewAnnouncement.title}</Title>
              <Space>
                {getTypeTag(previewAnnouncement.level)}
                {getPriorityTag(previewAnnouncement.priority)}
                {getStatusTag(previewAnnouncement.status)}
              </Space>
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
                {previewAnnouncement.content}
              </Text>
            </div>

            <Divider />

            <div style={{ fontSize: 12, color: '#666' }}>
              <div style={{ marginBottom: 4 }}>
                <strong>目标用户：</strong>
                {targetUserOptions.find(o => o.value === previewAnnouncement.target)?.label}
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong>发布时间：</strong>{previewAnnouncement.publishTime}
              </div>
              <div style={{ marginBottom: 4 }}>
                <strong>创建者：</strong>{previewAnnouncement.creatorName || '系统'}
              </div>
              <div>
                <strong>阅读量：</strong>{previewAnnouncement.readCount}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AnnouncementManagement