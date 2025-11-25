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
  Switch,
  Tag,
  message,
  Popconfirm,
  Tooltip
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SyncOutlined,
  LinkOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { Option } = Select

interface DataSource {
  id: number
  name: string
  type: 'firecrawl' | 'twitter' | 'custom'
  url: string
  enabled: boolean
  lastSyncAt?: string | null
  status: 'active' | 'error' | 'inactive'
  description?: string
}

const DataSources: React.FC = () => {
  const [allDataSources, setAllDataSources] = useState<DataSource[]>([])
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSource, setEditingSource] = useState<DataSource | null>(null)
  const [form] = Form.useForm()

  const sourceTypes = [
    { value: 'firecrawl', label: 'FireCrawl网页抓取', icon: '🌐' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'custom', label: '自定义API', icon: '⚙️' }
  ]

  const fetchDataSources = async () => {
    try {
      setLoading(true)
      const resp = await fetch(`${getApiBaseUrl()}/datasources`, {
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '获取数据源失败')
        return
      }
      const sources = data.data || []
      setAllDataSources(sources)
      setDataSources(sources)
    } catch (error) {
      console.error(error)
      message.error('获取数据源失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataSources()
  }, [])

  const handleEdit = (source: DataSource) => {
    setEditingSource(source)
    form.setFieldsValue(source)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/datasources/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '删除数据源失败')
        return
      }
      message.success('数据源已删除')
      fetchDataSources()
    } catch (error) {
      console.error(error)
      message.error('删除数据源失败')
    }
  }

  const handleToggleEnabled = async (id: number, enabled: boolean) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/datasources/${id}/toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled })
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '更新状态失败')
        return
      }
      message.success(`数据源已${enabled ? '启用' : '禁用'}`)
      fetchDataSources()
    } catch (error) {
      console.error(error)
      message.error('更新状态失败')
    }
  }

  const handleTest = async (source: DataSource) => {
    message.loading({ content: '正在测试连接...', key: 'test' })
    try {
      const resp = await fetch(`${getApiBaseUrl()}/datasources/${source.id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({})
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error({ content: data?.message || '连接测试失败', key: 'test' })
        return
      }
      message.success({ content: '连接测试成功', key: 'test' })
      fetchDataSources()
    } catch (error) {
      console.error(error)
      message.error({ content: '连接测试失败', key: 'test' })
    }
  }

  const handleSearch = (keyword?: string, type?: string) => {
    let filtered = allDataSources
    if (keyword) {
      filtered = filtered.filter(ds => 
        ds.name.toLowerCase().includes(keyword.toLowerCase()) ||
        (ds.url && ds.url.toLowerCase().includes(keyword.toLowerCase()))
      )
    }
    if (type) {
      filtered = filtered.filter(ds => ds.type === type)
    }
    setDataSources(filtered)
  }

  const handleSync = async (source: DataSource) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/datasources/${source.id}/sync`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '同步失败')
        return
      }
      message.success(`已同步数据源: ${source.name}`)
      fetchDataSources()
    } catch (error) {
      console.error(error)
      message.error('同步失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      const method = editingSource ? 'PUT' : 'POST'
      const url = editingSource
        ? `${getApiBaseUrl()}/datasources/${editingSource.id}`
        : `${getApiBaseUrl()}/datasources`

      const resp = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(values)
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '保存数据源失败')
        return
      }
      message.success(editingSource ? '数据源已更新' : '数据源已创建')
      fetchDataSources()
      
      setIsModalVisible(false)
      setEditingSource(null)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'success', text: '正常' },
      error: { color: 'error', text: '错误' },
      inactive: { color: 'default', text: '未激活' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getTypeTag = (type: string) => {
    const typeInfo = sourceTypes.find(t => t.value === type)
    return (
      <Tag>
        {typeInfo?.icon} {typeInfo?.label}
      </Tag>
    )
  }

  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DataSource) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type)
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url?: string | null) => {
        if (!url) return '-'
        const short = url.length > 40 ? `${url.substring(0, 40)}...` : url
        return (
          <Tooltip title={url}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <LinkOutlined /> {short}
            </a>
          </Tooltip>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: DataSource) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id, checked)}
        />
      )
    },
    {
      title: '最后同步',
      dataIndex: 'lastSyncAt',
      key: 'lastSyncAt',
      render: (value: string | null) => value || '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: DataSource) => (
        <Space>
          <Tooltip title="测试连接">
            <Button
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleTest(record)}
            />
          </Tooltip>
          <Tooltip title="立即同步">
            <Button
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleSync(record)}
              disabled={!record.enabled}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个数据源吗？"
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
        title="数据源管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingSource(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            添加数据源
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input.Search
              placeholder="搜索数据源名称或URL"
              style={{ width: 300 }}
              allowClear
              onSearch={(value) => {
                handleSearch(value, undefined)
              }}
            />
            <Select
              placeholder="选择类型"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => {
                handleSearch(undefined, value)
              }}
            >
              {sourceTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => {
              fetchDataSources()
              setDataSources(allDataSources)
            }}>
              检索
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={dataSources}
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

      <Modal
        title={editingSource ? '编辑数据源' : '添加数据源'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingSource(null)
          form.resetFields()
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            enabled: true
          }}
        >
          <Form.Item
            name="name"
            label="数据源名称"
            rules={[{ required: true, message: '请输入数据源名称' }]}
          >
            <Input placeholder="请输入数据源名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="数据源类型"
            rules={[{ required: true, message: '请选择数据源类型' }]}
          >
            <Select placeholder="请选择数据源类型">
              {sourceTypes.map(type => (
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
            name="url"
            label="URL地址"
            rules={[
              { required: true, message: '请输入URL地址' },
              { type: 'url', message: '请输入有效的URL地址' }
            ]}
          >
            <Input placeholder="请输入URL地址" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入数据源描述" />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DataSources