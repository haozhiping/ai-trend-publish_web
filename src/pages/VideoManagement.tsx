import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  message,
  Popconfirm,
  Tooltip,
  Input,
  Select,
  Modal,
  Descriptions,
  Progress
} from 'antd'
import { 
  DownloadOutlined, 
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select

interface VideoItem {
  id: number
  title: string
  filePath: string
  fileSize: number
  duration?: number
  status: 'generating' | 'completed' | 'failed'
  createdAt: string
  workflowId?: number
  workflowName?: string
  metadata?: {
    voiceModel?: string
    script?: string
    sourceUrls?: string[]
  }
}

const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchStatus, setSearchStatus] = useState<string>('')

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const resp = await fetch(`${getApiBaseUrl()}/videos`, {
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '获取视频列表失败')
        return
      }
      setVideos(data.data || [])
    } catch (error) {
      console.error(error)
      message.error('获取视频列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
    // 每30秒刷新一次
    const interval = setInterval(fetchVideos, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleDownload = async (video: VideoItem) => {
    try {
      // 创建下载链接
      const link = document.createElement('a')
      link.href = `${getApiBaseUrl()}/videos/${video.id}/download`
      link.download = `${video.title}.mp4`
      link.click()
      message.success('开始下载视频')
    } catch (error) {
      console.error(error)
      message.error('下载失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/videos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '删除视频失败')
        return
      }
      message.success('视频已删除')
      fetchVideos()
    } catch (error) {
      console.error(error)
      message.error('删除视频失败')
    }
  }

  const handlePreview = (video: VideoItem) => {
    setPreviewVideo(video)
    setPreviewVisible(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }

  const getStatusTag = (status: string) => {
    const statusConfig = {
      generating: { color: 'processing', text: '生成中' },
      completed: { color: 'success', text: '已完成' },
      failed: { color: 'error', text: '失败' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const filteredVideos = videos.filter(video => {
    if (searchKeyword && !video.title.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false
    }
    if (searchStatus && video.status !== searchStatus) {
      return false
    }
    return true
  })

  const columns = [
    {
      title: '视频标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: VideoItem) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          {record.workflowName && (
            <Tag color="blue" size="small">{record.workflowName}</Tag>
          )}
        </div>
      )
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
      render: (size: number) => formatFileSize(size)
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration?: number) => duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '生成时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: VideoItem) => (
        <Space>
          {record.status === 'completed' && (
            <>
              <Tooltip title="预览">
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview(record)}
                />
              </Tooltip>
              <Tooltip title="下载">
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'generating' && (
            <Tooltip title="生成中">
              <Progress percent={50} size="small" />
            </Tooltip>
          )}
          <Popconfirm
            title="确定要删除这个视频吗？"
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
        title="短视频管理"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchVideos}
          >
            刷新
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="搜索视频标题"
              style={{ width: 300 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
            />
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              value={searchStatus}
              onChange={setSearchStatus}
              allowClear
            >
              <Option value="generating">生成中</Option>
              <Option value="completed">已完成</Option>
              <Option value="failed">失败</Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={fetchVideos}>
              检索
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredVideos}
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
        title="视频预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {previewVideo && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="视频标题">{previewVideo.title}</Descriptions.Item>
              <Descriptions.Item label="文件大小">{formatFileSize(previewVideo.fileSize)}</Descriptions.Item>
              <Descriptions.Item label="时长">{previewVideo.duration ? `${Math.floor(previewVideo.duration / 60)}:${(previewVideo.duration % 60).toString().padStart(2, '0')}` : '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(previewVideo.status)}</Descriptions.Item>
              <Descriptions.Item label="生成时间">{dayjs(previewVideo.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
              {previewVideo.metadata?.voiceModel && (
                <Descriptions.Item label="音色模型">{previewVideo.metadata.voiceModel}</Descriptions.Item>
              )}
              {previewVideo.metadata?.sourceUrls && previewVideo.metadata.sourceUrls.length > 0 && (
                <Descriptions.Item label="素材来源">
                  {previewVideo.metadata.sourceUrls.map((url, index) => (
                    <div key={index} style={{ marginBottom: 4 }}>
                      <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                    </div>
                  ))}
                </Descriptions.Item>
              )}
            </Descriptions>
            {previewVideo.status === 'completed' && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <video
                  controls
                  style={{ width: '100%', maxHeight: 400 }}
                  src={`${getApiBaseUrl()}/videos/${previewVideo.id}/stream`}
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default VideoManagement

