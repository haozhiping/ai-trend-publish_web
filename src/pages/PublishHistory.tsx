import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  DatePicker,
  Select,
  Input,
  Tooltip,
  Progress,
  message,
  Tabs
} from 'antd'
import { 
  EyeOutlined, 
  LinkOutlined, 
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { RangePicker } = DatePicker
const { Option } = Select
const { Search } = Input

interface PublishRecord {
  id: number
  title: string
  platform: string
  status: 'published' | 'failed' | 'pending' | string
  publishTime: string
  url?: string
  articleCount: number
  successCount: number
  failCount?: number
  workflowType?: string
  errorMessage?: string
  metadata?: any
}

const PublishHistory: React.FC = () => {
  const [records, setRecords] = useState<PublishRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewRecord, setPreviewRecord] = useState<PublishRecord | null>(null)
  const [filters, setFilters] = useState({
    keyword: '',
    platform: '',
    status: '',
    workflowType: '',
    dateRange: null as any
  })
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 })

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.keyword) params.append('keyword', filters.keyword)
      if (filters.platform) params.append('platform', filters.platform)
      if (filters.status) params.append('status', filters.status)
      if (filters.workflowType) params.append('workflowType', filters.workflowType)
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.append('startTime', filters.dateRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'))
        params.append('endTime', filters.dateRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'))
      }
      params.append('page', String(pagination.page))
      params.append('pageSize', String(pagination.pageSize))

      const resp = await fetch(`${getApiBaseUrl()}/publish-history?${params.toString()}`, {
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '获取发布记录失败')
        return
      }
      setRecords(data.data.items || [])
      setPagination(prev => ({ ...prev, total: data.data.total || 0 }))
    } catch (error) {
      console.error(error)
      message.error('获取发布记录失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [filters, pagination.page, pagination.pageSize])

  const handlePreview = (record: PublishRecord) => {
    setPreviewRecord(record)
    setPreviewVisible(true)
  }

  const handleRetry = () => {
    message.info('已触发重试请求（即将支持）')
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      published: { color: 'success', text: '已发布' },
      failed: { color: 'error', text: '失败' },
      pending: { color: 'processing', text: '处理中' },
      draft: { color: 'default', text: '草稿' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
      || { color: 'default', text: status }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getPlatformTag = (platform: string) => {
    const platformConfig = {
      weixin: { color: 'green', text: '微信公众号' }
    }
    const config = platformConfig[platform as keyof typeof platformConfig] || { color: 'default', text: platform }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getWorkflowTag = (workflow?: string) => {
    const workflowConfig = {
      'weixin-article-workflow': { color: 'blue', text: '微信文章工作流' },
      'weixin-aibench-workflow': { color: 'purple', text: 'AI排行榜' },
      'weixin-hellogithub-workflow': { color: 'orange', text: 'GitHub项目' }
    }
    const config = workflow
      ? workflowConfig[workflow as keyof typeof workflowConfig] || { color: 'default', text: workflow }
      : { color: 'default', text: '未分类' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: PublishRecord) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {getWorkflowTag(record.workflowType)}
          </div>
        </div>
      )
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (platform: string) => getPlatformTag(platform)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '成功率',
      key: 'successRate',
      width: 150,
      render: (_, record: PublishRecord) => {
        if (record.status === 'draft') {
          return (
            <div style={{ color: '#faad14' }}>
              草稿待发布（{record.articleCount} 篇）
            </div>
          )
        }

        const rate = record.articleCount > 0 ? (record.successCount / record.articleCount) * 100 : 0
        const progressStatus = record.status === 'failed'
          ? 'exception'
          : rate === 100
            ? 'success'
            : 'active'
        return (
          <div>
            <Progress 
              percent={rate} 
              size="small" 
              status={progressStatus as any}
            />
            <div style={{ fontSize: 12, color: '#666' }}>
              {record.successCount}/{record.articleCount}
            </div>
          </div>
        )
      }
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 170,
      sorter: (a: PublishRecord, b: PublishRecord) => 
        dayjs(a.publishTime).unix() - dayjs(b.publishTime).unix()
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: PublishRecord) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          {record.url && record.status === 'published' && (
            <Tooltip title="查看文章">
              <Button
                size="small"
                icon={<LinkOutlined />}
                onClick={() => window.open(record.url, '_blank')}
              />
            </Tooltip>
          )}
          {record.status === 'failed' && (
            <Tooltip title="重试发布">
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleRetry}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title="发布历史"
        extra={
          <Button 
            icon={<DownloadOutlined />}
            type="default"
            onClick={() => message.info('请使用系统日志导出功能（待实现）')}
          >
            导出记录
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="搜索标题"
              style={{ width: 200 }}
              onSearch={(value) => {
                setFilters(prev => ({ ...prev, keyword: value }))
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            />
            <Select
              placeholder="选择平台"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => {
                setFilters(prev => ({ ...prev, platform: value || '' }))
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            >
              <Option value="weixin">微信公众号</Option>
            </Select>
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => {
                setFilters(prev => ({ ...prev, status: value || '' }))
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            >
              <Option value="published">已发布</Option>
              <Option value="failed">失败</Option>
              <Option value="pending">处理中</Option>
              <Option value="draft">草稿</Option>
            </Select>
            <Select
              placeholder="选择工作流"
              style={{ width: 180 }}
              allowClear
              onChange={(value) => {
                setFilters(prev => ({ ...prev, workflowType: value || '' }))
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            >
              <Option value="weixin-article-workflow">微信文章工作流</Option>
              <Option value="weixin-aibench-workflow">AI排行榜</Option>
              <Option value="weixin-hellogithub-workflow">GitHub项目</Option>
            </Select>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => {
                setFilters(prev => ({ ...prev, dateRange: dates }))
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{
            total: pagination.total,
            current: pagination.page,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => setPagination({ ...pagination, page, pageSize })
          }}
        />
      </Card>

      <Modal
        title="发布详情"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>{previewRecord.title}</h3>
              <Space>
                {getPlatformTag(previewRecord.platform)}
                {getStatusTag(previewRecord.status)}
                {getWorkflowTag(previewRecord.workflowType)}
              </Space>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>发布时间：</strong>
              {previewRecord.publishTime}
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong>文章统计：</strong>
              <div style={{ marginTop: 8 }}>
                <Progress 
                  percent={previewRecord.articleCount > 0
                    ? (previewRecord.successCount / previewRecord.articleCount) * 100
                    : 0}
                  format={() => `${previewRecord.successCount}/${previewRecord.articleCount}`}
                />
              </div>
            </div>

            {previewRecord.status === 'published' && previewRecord.url && (
              <div style={{ marginBottom: 16 }}>
                <strong>文章链接：</strong>
                <div style={{ marginTop: 8 }}>
                  <a href={previewRecord.url} target="_blank" rel="noopener noreferrer">
                    {previewRecord.url}
                  </a>
                </div>
              </div>
            )}

            {previewRecord.metadata?.publishId && (
              <div style={{ marginBottom: 16 }}>
                <strong>草稿 ID：</strong>
                <div style={{ marginTop: 8 }}>
                  <Tag color="purple">{previewRecord.metadata.publishId}</Tag>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    在「公众号后台 → 内容制作 → 草稿箱」搜索该 ID 即可找到对应草稿。
                  </div>
                </div>
              </div>
            )}

            {previewRecord.errorMessage && (
              <div style={{ marginBottom: 16 }}>
                <strong>错误信息：</strong>
                <div style={{ 
                  marginTop: 8, 
                  padding: 12, 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7',
                  borderRadius: 4,
                  color: '#ff4d4f'
                }}>
                  {previewRecord.errorMessage}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <strong>执行日志：</strong>
              <Tabs
                defaultActiveKey="summary"
                style={{ marginTop: 12 }}
                items={[
                  {
                    key: 'summary',
                    label: '概览',
                    children: (
                      <div
                        style={{
                          padding: 12,
                          background: '#f5f5f5',
                          borderRadius: 4,
                          fontFamily: 'monospace',
                          fontSize: 12,
                          maxHeight: 220,
                          overflow: 'auto'
                        }}
                      >
                        {previewRecord.metadata?.logs?.length
                          ? previewRecord.metadata.logs.map((log: string, idx: number) => (
                              <div key={idx}>{log}</div>
                            ))
                          : <div>暂无日志</div>}
                      </div>
                    )
                  },
                  {
                    key: 'details',
                    label: '管理员视图',
                    children: (
                      <div
                        style={{
                          padding: 12,
                          background: '#1e1e1e',
                          color: '#e8e8e8',
                          borderRadius: 4,
                          maxHeight: 320,
                          overflow: 'auto',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12
                        }}
                      >
                        {previewRecord.metadata?.rawLogs?.length
                          ? previewRecord.metadata.rawLogs.map((log: any, idx: number) => (
                              <div
                                key={`${log.timestamp}-${idx}`}
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '8px 0' }}
                              >
                                <div style={{ marginBottom: 4, color: '#bfbfbf' }}>
                                  [{log.timestamp}] [{log.level?.toUpperCase()}] [{log.module}]
                                </div>
                                <div>{log.message}</div>
                                {log.details && (
                                  <pre style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                )}
                              </div>
                            ))
                          : <div>暂无完整日志</div>}
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PublishHistory