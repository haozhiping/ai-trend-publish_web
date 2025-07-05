import React, { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  List,
  Typography,
  Space,
  Tag,
  Empty,
  Spin,
  Divider,
  theme,
  Flex
} from 'antd'
import {
  SearchOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  SettingOutlined,
  HistoryOutlined,
  FileDoneOutlined,
  BellOutlined,
  RightOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'content' | 'workflow' | 'template' | 'config' | 'history' | 'datasource' | 'log'
  path: string
  icon: React.ReactNode
}

interface GlobalSearchProps {
  visible: boolean
  onClose: () => void
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ visible, onClose }) => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // 模拟搜索数据
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'DeepSeek-R1 登顶AI模型排行榜',
      description: '内容管理 - 已发布的文章',
      type: 'content',
      path: '/content',
      icon: <FileTextOutlined />
    },
    {
      id: '2',
      title: '微信文章工作流',
      description: '流程管理 - 每日自动发布工作流',
      type: 'workflow',
      path: '/workflows',
      icon: <AppstoreOutlined />
    },
    {
      id: '3',
      title: '默认文章模板',
      description: '模板管理 - 简洁大方的文章模板',
      type: 'template',
      path: '/templates',
      icon: <FileDoneOutlined />
    },
    {
      id: '4',
      title: 'OpenAI API配置',
      description: '系统配置 - LLM提供者配置',
      type: 'config',
      path: '/config',
      icon: <SettingOutlined />
    },
    {
      id: '5',
      title: 'Twitter数据源',
      description: '数据源管理 - 社交媒体数据抓取',
      type: 'datasource',
      path: '/data-sources',
      icon: <DatabaseOutlined />
    },
    {
      id: '6',
      title: '2024-01-15 发布记录',
      description: '发布历史 - 成功发布8篇文章',
      type: 'history',
      path: '/publish-history',
      icon: <HistoryOutlined />
    },
    {
      id: '7',
      title: '系统启动日志',
      description: '系统日志 - 应用程序启动记录',
      type: 'log',
      path: '/logs',
      icon: <BellOutlined />
    }
  ]

  useEffect(() => {
    if (searchValue.trim()) {
      setLoading(true)
      // 模拟搜索延迟
      const timer = setTimeout(() => {
        const filtered = mockData.filter(item =>
          item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.description.toLowerCase().includes(searchValue.toLowerCase())
        )
        setResults(filtered)
        setLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [searchValue])

  const handleItemClick = (item: SearchResult) => {
    navigate(item.path)
    onClose()
    setSearchValue('')
  }

  const getTypeColor = (type: string) => {
    const colors = {
      content: token.colorPrimary,
      workflow: token.colorSuccess,
      template: token.colorWarning,
      config: '#722ed1',
      datasource: token.colorInfo,
      history: '#fa8c16',
      log: '#f5222d'
    }
    return colors[type as keyof typeof colors] || token.colorTextTertiary
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      content: '内容',
      workflow: '工作流',
      template: '模板',
      config: '配置',
      datasource: '数据源',
      history: '历史',
      log: '日志'
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={{ top: 100 }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '20px 20px 0 20px' }}>
        <Input
          size="large"
          placeholder="搜索内容、工作流、模板、配置..."
          prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            borderRadius: 8,
            fontSize: 16
          }}
          autoFocus
        />
      </div>

      <div style={{ 
        maxHeight: 400, 
        overflowY: 'auto',
        marginTop: 16
      }}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: 40 
          }}>
            <Spin size="large" />
          </div>
        ) : results.length > 0 ? (
          <List
            dataSource={results}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = token.colorFillAlter
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={() => handleItemClick(item)}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: `${getTypeColor(item.type)}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: getTypeColor(item.type),
                      fontSize: 16
                    }}>
                      {item.icon}
                    </div>
                  }
                  title={
                    <Flex justify="space-between" align="center">
                      <Text strong style={{ fontSize: 14 }}>
                        {item.title}
                      </Text>
                      <RightOutlined style={{ 
                        color: token.colorTextTertiary, 
                        fontSize: 12 
                      }} />
                    </Flex>
                  }
                  description={
                    <Flex align="center" gap={8} style={{ marginTop: 4 }}>
                      <Tag 
                        color={getTypeColor(item.type)}
                        style={{ 
                          fontSize: 11, 
                          padding: '0 6px',
                          lineHeight: '18px',
                          border: 'none'
                        }}
                      >
                        {getTypeLabel(item.type)}
                      </Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.description}
                      </Text>
                    </Flex>
                  }
                />
              </List.Item>
            )}
          />
        ) : searchValue.trim() ? (
          <div style={{ padding: 40 }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="未找到相关结果"
            />
          </div>
        ) : (
          <div style={{ padding: '20px 20px 40px 20px' }}>
            <Text type="secondary" style={{ fontSize: 14 }}>
              输入关键词开始搜索...
            </Text>
            <Divider style={{ margin: '16px 0' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              支持搜索：内容、工作流、模板、配置、数据源、发布历史、系统日志
            </Text>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div style={{
          padding: '12px 20px',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorFillAlter
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            找到 {results.length} 个结果 · 按 Enter 选择第一个结果
          </Text>
        </div>
      )}
    </Modal>
  )
}

export default GlobalSearch