import React, { useState, useMemo, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { 
  Layout, 
  Menu, 
  Avatar, 
  Dropdown, 
  Space, 
  Typography, 
  Badge, 
  Button, 
  Tooltip, 
  theme as antdTheme, 
  ConfigProvider,
  Breadcrumb,
  Divider,
  Flex,
  message
} from 'antd'
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  DatabaseOutlined,
  HistoryOutlined,
  FileDoneOutlined,
  UserOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  GithubOutlined,
  HomeOutlined,
  SearchOutlined,
  DownOutlined,
  EditOutlined,
  KeyOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import WorkflowManagement from './pages/WorkflowManagement'
import ContentManagement from './pages/ContentManagement'
import TemplateManagement from './pages/TemplateManagement'
import DataSources from './pages/DataSources'
import PublishHistory from './pages/PublishHistory'
import ConfigManagement from './pages/ConfigManagement'
import SystemLogs from './pages/SystemLogs'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import GlobalSearch from './components/GlobalSearch'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const menuItems = [
  { 
    key: '/', 
    icon: <DashboardOutlined />, 
    label: '仪表盘',
    breadcrumb: '仪表盘'
  },
  { 
    key: '/workflows', 
    icon: <AppstoreOutlined />, 
    label: '流程管理',
    breadcrumb: '流程管理'
  },
  { 
    key: '/content', 
    icon: <FileTextOutlined />, 
    label: '内容管理',
    breadcrumb: '内容管理'
  },
  { 
    key: '/templates', 
    icon: <FileDoneOutlined />, 
    label: '模板管理',
    breadcrumb: '模板管理'
  },
  { 
    key: '/data-sources', 
    icon: <DatabaseOutlined />, 
    label: '数据源',
    breadcrumb: '数据源管理'
  },
  { 
    key: '/publish-history', 
    icon: <HistoryOutlined />, 
    label: '发布历史',
    breadcrumb: '发布历史'
  },
  { 
    key: '/config', 
    icon: <SettingOutlined />, 
    label: '系统配置',
    breadcrumb: '系统配置'
  },
  { 
    key: '/logs', 
    icon: <BellOutlined />, 
    label: '系统日志',
    breadcrumb: '系统日志'
  }
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  
  // 用户认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token')
  })
  
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo')
    return saved ? JSON.parse(saved) : null
  })

  // 模态框状态
  const [profileVisible, setProfileVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)

  // 通知数量
  const [notificationCount, setNotificationCount] = useState(3)

  // 设置 HTML 根元素的 data-theme 属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // 检查认证状态
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUserInfo = localStorage.getItem('userInfo')
    
    if (token && savedUserInfo) {
      setIsAuthenticated(true)
      setUserInfo(JSON.parse(savedUserInfo))
    } else {
      setIsAuthenticated(false)
      setUserInfo(null)
    }
  }, [])

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }

  const handleLogin = (user: any) => {
    setIsAuthenticated(true)
    setUserInfo(user)
    message.success(`欢迎回来，${user.name}！`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    setIsAuthenticated(false)
    setUserInfo(null)
    navigate('/')
    message.success('已安全退出')
  }

  const handleUpdateUser = (updatedUser: any) => {
    setUserInfo(updatedUser)
    localStorage.setItem('userInfo', JSON.stringify(updatedUser))
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchVisible(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentMenuItem = menuItems.find(item => item.key === location.pathname)

  const breadcrumbItems = [
    {
      title: (
        <Flex align="center" gap={4}>
          <HomeOutlined />
          <span>首页</span>
        </Flex>
      ),
      onClick: () => navigate('/')
    }
  ]

  if (currentMenuItem && location.pathname !== '/') {
    breadcrumbItems.push({
      title: currentMenuItem.breadcrumb
    })
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <EditOutlined />,
      label: '个人设置',
      onClick: () => setProfileVisible(true)
    },
    {
      key: 'security',
      icon: <KeyOutlined />,
      label: '安全中心'
    },
    {
      type: 'divider'
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: '帮助文档'
    },
    {
      key: 'github',
      icon: <GithubOutlined />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com', '_blank')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout
    }
  ]

  const themeConfig = useMemo(() => ({
    token: {
      colorPrimary: '#1677ff',
      colorInfo: '#1677ff',
      colorSuccess: '#00b96b',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
      wireframe: false,
      fontSize: 14,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
    },
    algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    components: {
      Layout: {
        siderBg: darkMode ? '#001529' : '#ffffff',
        headerBg: darkMode ? '#141414' : '#ffffff',
        bodyBg: darkMode ? '#000000' : '#f5f5f5',
        triggerBg: darkMode ? '#002140' : '#ffffff',
        triggerColor: darkMode ? '#ffffff' : '#000000'
      },
      Menu: {
        itemBg: 'transparent',
        itemSelectedBg: darkMode ? '#1677ff' : '#e6f4ff',
        itemSelectedColor: darkMode ? '#ffffff' : '#1677ff',
        itemHoverBg: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        itemActiveBg: darkMode ? '#1677ff' : '#e6f4ff',
        itemColor: darkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
        iconSize: 16,
        fontSize: 14,
        itemHeight: 40,
        collapsedIconSize: 16,
        itemBorderRadius: 6,
        itemMarginInline: 4
      },
      Card: {
        headerBg: darkMode ? '#141414' : '#fafafa',
        colorBgContainer: darkMode ? '#141414' : '#ffffff'
      },
      Button: {
        borderRadius: 6,
        controlHeight: 32,
        fontSize: 14
      },
      Input: {
        borderRadius: 6,
        controlHeight: 32
      },
      Select: {
        borderRadius: 6,
        controlHeight: 32
      },
      Table: {
        headerBg: darkMode ? '#1f1f1f' : '#fafafa',
        rowHoverBg: darkMode ? '#262626' : '#f5f5f5'
      },
      Modal: {
        borderRadiusLG: 12
      },
      Dropdown: {
        borderRadiusOuter: 8
      }
    }
  }), [darkMode])

  // 如果未认证，显示登录页面
  if (!isAuthenticated) {
    return (
      <ConfigProvider theme={themeConfig}>
        <Login onLogin={handleLogin} />
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={256}
          collapsedWidth={64}
          style={{
            background: darkMode ? '#001529' : '#ffffff',
            borderInlineEnd: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            height: '100vh',
            zIndex: 200,
            boxShadow: darkMode 
              ? '6px 0 16px 0 rgba(0, 0, 0, 0.3), 3px 0 6px -4px rgba(0, 0, 0, 0.5), 9px 0 28px 8px rgba(0, 0, 0, 0.2)'
              : '6px 0 16px 0 rgba(0, 0, 0, 0.08), 3px 0 6px -4px rgba(0, 0, 0, 0.12), 9px 0 28px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Logo区域 */}
          <div style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            borderBlockEnd: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
            background: darkMode ? '#001529' : '#ffffff'
          }}>
            <Flex align="center" gap={12}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #1677ff, #69c0ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(22, 119, 255, 0.2)'
              }}>
                AI
              </div>
              {!collapsed && (
                <Text style={{ 
                  color: darkMode ? '#ffffff' : '#000000',
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  趋势发布系统
                </Text>
              )}
            </Flex>
          </div>

          {/* 菜单 */}
          <Menu
            theme={darkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              borderInlineEnd: 0,
              background: 'transparent',
              marginTop: 8,
              paddingInline: 8
            }}
          />
        </Sider>

        <Layout style={{ 
          marginInlineStart: collapsed ? 64 : 256, 
          transition: 'margin-inline-start 0.2s cubic-bezier(0.2, 0, 0, 1) 0s'
        }}>
          {/* 顶部导航 */}
          <Header style={{
            background: darkMode ? '#141414' : '#ffffff',
            borderBlockEnd: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: darkMode 
              ? '0 1px 4px rgba(0,0,0,.3)' 
              : '0 1px 4px rgba(0,21,41,.08)'
          }}>
            <Flex align="center" gap={16}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                  fontSize: 16,
                  width: 32,
                  height: 32,
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Divider type="vertical" style={{ 
                height: 24, 
                margin: 0,
                borderColor: darkMode ? '#303030' : '#f0f0f0'
              }} />
              <Breadcrumb 
                items={breadcrumbItems}
                style={{ 
                  fontSize: 14,
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
            </Flex>

            <Flex align="center" gap={8}>
              <Tooltip title="全局搜索 (Ctrl+K)">
                <Button
                  type="text"
                  icon={<SearchOutlined />}
                  onClick={() => setSearchVisible(true)}
                  style={{ 
                    fontSize: 16,
                    width: 32,
                    height: 32,
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
              </Tooltip>

              <Tooltip title="通知中心">
                <Badge count={notificationCount} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{ 
                      fontSize: 16,
                      width: 32,
                      height: 32,
                      color: darkMode ? '#ffffff' : '#000000'
                    }}
                  />
                </Badge>
              </Tooltip>

              <Tooltip title={darkMode ? '切换到亮色模式' : '切换到暗色模式'}>
                <Button
                  type="text"
                  icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                  style={{ 
                    fontSize: 16,
                    width: 32,
                    height: 32,
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
              </Tooltip>

              <Divider type="vertical" style={{ 
                height: 24, 
                margin: '0 8px',
                borderColor: darkMode ? '#303030' : '#f0f0f0'
              }} />

              <Dropdown
                menu={{ 
                  items: userMenuItems
                }}
                placement="bottomRight"
                arrow
                trigger={['click']}
              >
                <Button type="text" style={{ 
                  cursor: 'pointer', 
                  height: 'auto',
                  padding: '4px 8px'
                }}>
                  <Flex align="center" gap={8}>
                    <Avatar 
                      size={32}
                      style={{ 
                        background: 'linear-gradient(135deg, #1677ff, #69c0ff)'
                      }}
                      icon={<UserOutlined />}
                      src={userInfo?.avatar}
                    />
                    <Flex vertical style={{ alignItems: 'flex-start' }}>
                      <Text style={{ 
                        fontSize: 14, 
                        fontWeight: 500, 
                        lineHeight: 1.2,
                        color: darkMode ? '#ffffff' : '#000000'
                      }}>
                        {userInfo?.name || '管理员'}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.2 }}>
                        {userInfo?.email || 'admin@example.com'}
                      </Text>
                    </Flex>
                    <DownOutlined style={{ 
                      fontSize: 12, 
                      color: darkMode ? '#ffffff' : '#000000' 
                    }} />
                  </Flex>
                </Button>
              </Dropdown>
            </Flex>
          </Header>

          {/* 主内容区域 */}
          <Content style={{
            margin: 0,
            minHeight: 'calc(100vh - 64px)',
            background: darkMode ? '#000000' : '#f5f5f5',
            padding: 24,
            overflow: 'auto'
          }}>
            <div style={{ 
              maxWidth: '100%',
              margin: '0 auto'
            }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workflows" element={<WorkflowManagement />} />
                <Route path="/content" element={<ContentManagement />} />
                <Route path="/templates" element={<TemplateManagement />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/publish-history" element={<PublishHistory />} />
                <Route path="/config" element={<ConfigManagement />} />
                <Route path="/logs" element={<SystemLogs />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* 用户设置模态框 */}
      <UserProfile
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        userInfo={userInfo}
        onUpdateUser={handleUpdateUser}
      />

      {/* 全局搜索模态框 */}
      <GlobalSearch
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />
    </ConfigProvider>
  )
}

export default App