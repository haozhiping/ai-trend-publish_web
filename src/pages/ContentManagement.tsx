import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Input, 
  Select,
  DatePicker,
  Rate,
  Tooltip,
  message,
  Form,
  InputNumber
} from 'antd'
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

interface ContentItem {
  id: number
  title: string
  content: string
  url: string
  source: string
  platform: string
  publishDate: string | null
  score: number | null
  status: 'published' | 'draft' | 'failed'
  keywords: string[]
  summary?: string | null
  tags?: string[]
  media?: string[]
}

const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null)
  const [filters, setFilters] = useState({
    keyword: '',
    source: '',
    status: '',
    dateRange: null as any
  })
  const [editVisible, setEditVisible] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [editForm] = Form.useForm()

  // 加载内容列表
  const loadContents = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.keyword) params.append('keyword', filters.keyword)
      if (filters.source) params.append('source', filters.source)
      if (filters.status) params.append('status', filters.status)
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.append('startDate', filters.dateRange[0].startOf('day').toISOString())
        params.append('endDate', filters.dateRange[1].endOf('day').toISOString())
      }
      
      const resp = await fetch(`${getApiBaseUrl()}/content?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '加载内容失败')
        return
      }
      setContents(data.data || [])
    } catch (e) {
      console.error(e)
      message.error('加载内容失败，请检查后端服务')
    }
  }

  useEffect(() => {
    loadContents()
  }, [])

  const handleSearch = () => {
    loadContents()
  }

  const parseScoreValue = (value: number | null | undefined) => {
    const parsed = Number(value ?? 0)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  const openEditModal = (item: ContentItem) => {
    setEditingContent(item)
    editForm.setFieldsValue({
      title: item.title,
      summary: item.summary ?? '',
      source: item.source,
      platform: item.platform ?? '',
      url: item.url ?? '',
      status: item.status,
      score: item.score ?? undefined,
      publishDate: item.publishDate ? dayjs(item.publishDate) : null,
    })
    setEditVisible(true)
  }

  const handleEditSubmit = async () => {
    if (!editingContent) {
      return
    }

    try {
      const values = await editForm.validateFields()
      const payload = {
        title: values.title,
        summary: values.summary || null,
        source: values.source || null,
        platform: values.platform || null,
        url: values.url || null,
        status: values.status,
        score: values.score !== undefined && values.score !== null
          ? Number(values.score)
          : null,
        publishDate: values.publishDate
          ? values.publishDate.toISOString()
          : null,
      }

      const resp = await fetch(`${getApiBaseUrl()}/content/${editingContent.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '保存内容失败')
        return
      }

      message.success('内容已更新')
      setEditVisible(false)
      setEditingContent(null)
      editForm.resetFields()
      loadContents()
    } catch (error) {
      console.error('更新内容失败:', error)
      message.error('更新内容失败')
    }
  }

  const handleEditCancel = () => {
    setEditVisible(false)
    setEditingContent(null)
    editForm.resetFields()
  }

  const handlePreview = (content: ContentItem) => {
    setPreviewContent(content)
    setPreviewVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/content/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '删除内容失败')
        return
      }
      message.success('内容已删除')
      loadContents()
    } catch (e) {
      console.error(e)
      message.error('删除内容失败')
    }
  }

  const handleBatchDelete = async () => {
    const ids = selectedRowKeys as unknown as number[]
    for (const id of ids) {
      await handleDelete(id)
    }
    setSelectedRowKeys([])
  }

  const getSourceTag = (source: string) => {
    const sourceConfig = {
      twitter: { color: 'blue', text: 'Twitter' },
      firecrawl: { color: 'green', text: 'FireCrawl' },
      hellogithub: { color: 'orange', text: 'HelloGitHub' }
    }
    const config = sourceConfig[source as keyof typeof sourceConfig] || { color: 'default', text: source }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      published: { color: 'success', text: '已发布' },
      draft: { color: 'processing', text: '草稿' },
      generated: { color: 'blue', text: '已生成' },
      processed: { color: 'blue', text: '处理中' },
      failed: { color: 'error', text: '失败' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status || '未知' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: ContentItem) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.keywords?.map(keyword => (
              <Tag key={keyword}>{keyword}</Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => getSourceTag(source)
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      render: (score: number | null) => {
        const value = parseScoreValue(score)
        return (
          <div>
            <Rate disabled value={value / 20} style={{ fontSize: 12 }} />
            <div style={{ fontSize: 12, color: '#666' }}>{value.toFixed(1)}</div>
          </div>
        )
      },
      sorter: (a: ContentItem, b: ContentItem) => parseScoreValue(a.score) - parseScoreValue(b.score)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 150,
      sorter: (a: ContentItem, b: ContentItem) => {
        const timeA = dayjs(a.publishDate || undefined).unix()
        const timeB = dayjs(b.publishDate || undefined).unix()
        return timeA - timeB
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record: ContentItem) => (
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
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  return (
    <div>
      <Card
        title="内容管理"
        extra={
          <Space>
            <Button 
              icon={<DownloadOutlined />}
              type="default"
            >
              导出
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button 
                danger 
                onClick={handleBatchDelete}
                icon={<DeleteOutlined />}
              >
                批量删除 ({selectedRowKeys.length})
              </Button>
            )}
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="搜索标题或关键词"
              style={{ width: 300 }}
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onSearch={handleSearch}
              allowClear
            />
            <Select
              placeholder="选择来源"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, source: value || '' }))}
            >
              <Option value="twitter">Twitter</Option>
              <Option value="firecrawl">FireCrawl</Option>
              <Option value="hellogithub">HelloGitHub</Option>
            </Select>
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
            >
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="failed">失败</Option>
            </Select>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              value={filters.dateRange}
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              检索
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={contents}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            total: contents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      <Modal
        title="内容预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewContent && (
          <div>
            <h3>{previewContent.title}</h3>
            <div style={{ marginBottom: 16 }}>
              <Space>
                {getSourceTag(previewContent.source)}
                {getStatusTag(previewContent.status)}
                <Tag>评分: {parseScoreValue(previewContent.score).toFixed(1)}</Tag>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>关键词：</strong>
              {previewContent.keywords.map(keyword => (
                <Tag key={keyword}>{keyword}</Tag>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>原文链接：</strong>
              <a href={previewContent.url} target="_blank" rel="noopener noreferrer">
                {previewContent.url}
              </a>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>发布时间：</strong>
              {previewContent.publishDate}
            </div>
            <div>
              <strong>内容：</strong>
              <div style={{ 
                marginTop: 8, 
                padding: 16, 
                background: '#f5f5f5', 
                borderRadius: 4,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {previewContent.content}
              </div>
            </div>
            {previewContent.media && previewContent.media.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <strong>媒体文件：</strong>
                <div style={{ marginTop: 8 }}>
                  {previewContent.media.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`媒体 ${index + 1}`}
                      style={{ 
                        width: 100, 
                        height: 100, 
                        objectFit: 'cover', 
                        marginRight: 8,
                        borderRadius: 4
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="编辑内容"
        open={editVisible}
        width={720}
        onOk={handleEditSubmit}
        onCancel={handleEditCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="摘要" name="summary">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="来源" name="source">
            <Input />
          </Form.Item>
          <Form.Item label="平台" name="platform">
            <Input />
          </Form.Item>
          <Form.Item label="原文链接" name="url">
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select>
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
              <Option value="failed">失败</Option>
            </Select>
          </Form.Item>
          <Form.Item label="评分" name="score">
            <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="发布时间" name="publishDate">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContentManagement