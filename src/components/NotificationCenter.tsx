import React, { useState, useEffect } from 'react'
import {
  Dropdown,
  Badge,
  Button,
  List,
  Typography,
  Space,
  Tag,
  Empty,
  Divider,
  Tabs,
  Avatar,
  Tooltip,
  Flex,
  theme,
  Spin
} from 'antd'
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  UserOutlined,
  ApiOutlined,
  FileTextOutlined,
  TrophyOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ClearOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const { Text, Title } = Typography

interface Notification {
  id: string
  title: string
  content: string
  type: 'system' | 'workflow' | 'api' | 'announcement' | 'warning' | 'error'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  time: string
  source: string
  actionUrl?: string
  avatar?: React.ReactNode
}

interface NotificationCenterProps {
  count?: number
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ count = 0 }) => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '微信工作流执行完成',
      content: '成功发布 8 篇文章到微信公众号',
      type: 'workflow',
      priority: 'medium',
      isRead: false,
      time: '2024-01-15 14:30:25',
      source: 'WeixinWorkflow',
      actionUrl: '/publish-history',
      avatar: <CheckCircleOutlined style={{ color: token.colorSuccess }} />
    },
    {
      id: '2',
      title: 'FireCrawl API额度警告',
      content: '当前额度剩余不足20%，建议及时充值',
      type: 'warning',
      priority: 'high',
      isRead: false,
      time: '2024-01-15 12:15:30',
      source: 'APIMonitor',
      actionUrl: '/config',
      avatar: <ExclamationCircleOutlined style={{ color: token.colorWarning }} />
    },
    {
      id: '3',
      title: '系统维护通知',
      content: '系统将于今晚23:00-01:00进行维护升级',
      type: 'announcement',
      priority: 'high',
      isRead: false,
      time: '2024-01-15 10:00:00',
      source: '系统管理员',
      actionUrl: '/announcements',
      avatar: <InfoCircleOutlined style={{ color: token.colorPrimary }} />
    },
    {
      id: '4',
      title: 'AI内容排序完成',
      content: '使用DeepSeek模型对内容进行智能排序',
      type: 'system',
      priority: 'low',
      isRead: true,
      time: '2024-01-15 09:25:10',
      source: 'ContentRanker',
      actionUrl: '/content',
      avatar: <TrophyOutlined style={{ color: token.colorPrimary }} />
    },
    {
      id: '5',
      title: 'Twitter API调用失败',
      content: 'API速率限制，将在15分钟后重试',
      type: 'error',
      priority: 'medium',
      isRead: true,
      time: '2024-01-15 08:30:15',
      source: 'TwitterScraper',
      actionUrl: '/data-sources',
      avatar: <CloseCircleOutlined style={{ color: token.colorError }} />
    },
    {
      id: '6',
      title: 'GitHub热门项目抓取',
      content: '发现 15 个新的AI相关热门项目',
      type: 'system',
      priority: 'low',
      isRead: true,
      time: '2024-01-14 18:45:33',
      source: 'GitHubScraper',
      actionUrl: '/content',
      avatar: <RocketOutlined style={{ color: token.colorSuccess }} />
    }
  ])

  // 计算未读数量
  const unreadCount = notifications.filter(n => !n.isRead).length

  // 按类型分组通知
  const groupedNotifications = {
    all: notifications,
    unread: notifications.filter(n => !n.isRead),
    system: notifications.filter(n => n.type === 'system'),
    workflow: notifications.filter(n => n.type === 'workflow'),
    warning: notifications.filter(n => ['warning', 'error'].includes(n.type)),
    announcement: notifications.filter(n => n.type === 'announcement')
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
      setOpen(false)
    }
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      system: <SettingOutlined />,
      workflow: <ApiOutlined />,
      api: <ApiOutlined />,
      announcement: <BellOutlined />,
      warning: <ExclamationCircleOutlined />,
      error: <CloseCircleOutlined />
    }
    return icons[type as keyof typeof icons] || <InfoCircleOutlined />
  }

  const getTypeColor = (type: string) => {
    const colors = {
      system: token.colorPrimary,
      workflow: token.colorSuccess,
      api: token.colorInfo,
      announcement: token.colorPrimary,
      warning: token.colorWarning,
      error: token.colorError
    }
    return colors[type as keyof typeof colors] || token.colorTextTertiary
  }

  const getPriorityTag = (priority: string) => {
    const configs = {
      low: { color: 'default', text: '低' },
      medium: { color: 'blue', text: '中' },
      high: { color: 'orange', text: '高' },
      urgent: { color: 'red', text: '紧急' }
    }
    const config = configs[priority as keyof typeof configs]
    return <Tag color={config.color} size="small">{config.text}</Tag>
  }

  const renderNotificationItem = (notification: Notification) => (
    <List.Item
      key={notification.id}
      style={{
        padding: '12px 16px',
        cursor: 'pointer',
        background: notification.isRead ? 'transparent' : token.colorFillAlter,
        borderRadius: 6,
        margin: '4px 0',
        transition: 'all 0.2s ease',
        border: `1px solid ${notification.isRead ? 'transparent' : token.colorBorderSecondary}`
      }}
      onClick={() => handleNotificationClick(notification)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = token.colorFillTertiary
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = notification.isRead ? 'transparent' : token.colorFillAlter
      }}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            size={32}
            icon={notification.avatar || getTypeIcon(notification.type)}
            style={{ 
              background: 'transparent',
              color: getTypeColor(notification.type),
              border: `1px solid ${getTypeColor(notification.type)}20`
            }}
          />
        }
        title={
          <Flex justify="space-between" align="center">
            <Text 
              strong={!notification.isRead}
              style={{ 
                fontSize: 14,
                color: notification.isRead ? token.colorTextTertiary : token.colorText
              }}
            >
              {notification.title}
            </Text>
            <Space size={4}>
              {getPriorityTag(notification.priority)}
              {!notification.isRead && (
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: token.colorPrimary
                }} />
              )}
            </Space>
          </Flex>
        }
        description={
          <div>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 12, 
                display: 'block', 
                marginBottom: 4,
                lineHeight: 1.4
              }}
            >
              {notification.content}
            </Text>
            <Flex justify="space-between" align="center">
              <Text type="secondary" style={{ fontSize: 11 }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {dayjs(notification.time).fromNow()} · {notification.source}
              </Text>
              <Space size={4}>
                {!notification.isRead && (
                  <Tooltip title="标记为已读">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification.id)
                      }}
                      style={{ fontSize: 12, padding: '0 4px' }}
                    />
                  </Tooltip>
                )}
                <Tooltip title="删除">
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notification.id)
                    }}
                    style={{ fontSize: 12, padding: '0 4px' }}
                  />
                </Tooltip>
              </Space>
            </Flex>
          </div>
        }
      />
    </List.Item>
  )

  const dropdownContent = (
    <div style={{ 
      width: 400, 
      maxHeight: 600, 
      background: token.colorBgElevated,
      borderRadius: 8,
      boxShadow: token.boxShadowSecondary,
      border: `1px solid ${token.colorBorderSecondary}`
    }}>
      {/* 头部 */}
      <div style={{ 
        padding: '16px 16px 12px 16px', 
        borderBottom: `1px solid ${token.colorBorderSecondary}`
      }}>
        <Flex justify="space-between" align="center">
          <Title level={5} style={{ margin: 0 }}>
            通知中心
          </Title>
          <Space>
            {unreadCount > 0 && (
              <Button 
                type="text" 
                size="small"
                onClick={handleMarkAllAsRead}
                icon={<CheckOutlined />}
              >
                全部已读
              </Button>
            )}
            <Button 
              type="text" 
              size="small"
              onClick={handleClearAll}
              icon={<ClearOutlined />}
            >
              清空
            </Button>
          </Space>
        </Flex>
      </div>

      {/* 标签页 */}
      <div style={{ padding: '0 16px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          items={[
            {
              key: 'all',
              label: `全部 (${groupedNotifications.all.length})`
            },
            {
              key: 'unread',
              label: `未读 (${groupedNotifications.unread.length})`
            },
            {
              key: 'system',
              label: `系统 (${groupedNotifications.system.length})`
            },
            {
              key: 'workflow',
              label: `工作流 (${groupedNotifications.workflow.length})`
            }
          ]}
        />
      </div>

      {/* 通知列表 */}
      <div style={{ 
        maxHeight: 400, 
        overflowY: 'auto',
        padding: '0 12px 12px 12px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : groupedNotifications[activeTab as keyof typeof groupedNotifications].length > 0 ? (
          <List
            dataSource={groupedNotifications[activeTab as keyof typeof groupedNotifications]}
            renderItem={renderNotificationItem}
            split={false}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无通知"
            style={{ padding: 40 }}
          />
        )}
      </div>

      {/* 底部 */}
      <div style={{ 
        padding: '12px 16px', 
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        textAlign: 'center'
      }}>
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            navigate('/announcements')
            setOpen(false)
          }}
        >
          查看全部通知
        </Button>
      </div>
    </div>
  )

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow
    >
      <Badge count={unreadCount} size="small" offset={[0, 2]}>
        <Button
          type="text"
          icon={<BellOutlined />}
          className="header-action-btn"
          style={{
            position: 'relative',
            transition: 'all 0.3s ease'
          }}
        />
      </Badge>
    </Dropdown>
  )
}

export default NotificationCenter