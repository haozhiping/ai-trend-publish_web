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
  message,
  Input
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
  DownOutlined,
  EditOutlined,
  KeyOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ReloadOutlined,
  NotificationOutlined,
  FileProtectOutlined
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import WorkflowManagement from './pages/WorkflowManagement'
import ContentManagement from './pages/ContentManagement'
import TemplateManagement from './pages/TemplateManagement'
import DataSources from './pages/DataSources'
import PublishHistory from './pages/PublishHistory'
import ConfigManagement from './pages/ConfigManagement'
import SystemLogs from './pages/SystemLogs'
import AnnouncementManagement from './pages/AnnouncementManagement'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import GlobalSearch from './components/GlobalSearch'
import ThemeSelector from './components/ThemeSelector'
import { getCurrentTheme, saveTheme, getThemeConfig, themePresets } from './utils/theme'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const menuItems = [
  { 
    key: '/', 
    icon: <DashboardOutlined />, 
    label: '工作台',
    breadcrumb: '工作台'
  },
  { 
    key: '/workflows', 
    icon: <AppstoreOutlined />, 
    label: '工作流',
    breadcrumb: '工作流管理'
  },
  { 
    key: '/content', 
    icon: <FileTextOutlined />, 
    label: '内容库',
    breadcrumb: '内容管理'
  },
  { 
    key: '/templates', 
    icon: <FileDoneOutlined />, 
    label: '模板',
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
    label: '发布记录',
    breadcrumb: '发布历史'
  },
  { 
    key: '/config', 
    icon: <SettingOutlined />, 
    label: '系统设置',
    breadcrumb: '系统配置'
  },
  { 
    key: '/logs', 
    icon: <FileProtectOutlined />, 
    label: '系统日志',
    breadcrumb: '系统日志'
  },
  { 
    key: '/announcements', 
    icon: <NotificationOutlined />, 
    label: '通知公告',
    breadcrumb: '通知公告管理'
  }
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // 主题相关状态
  const [currentTheme, setCurrentTheme] = useState(() => getCurrentTheme())
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dark-mode') === 'true')
  
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
  const [themeVisible, setThemeVisible] = useState(false)

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

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('dark-mode', newDarkMode.toString())
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light')
  }

  const handleThemeChange = (themeKey: string) => {
    setCurrentTheme(themeKey)
    saveTheme(themeKey)
    message.success('主题已切换')
  }

  const handleDarkModeChange = (isDark: boolean) => {
    setDarkMode(isDark)
    localStorage.setItem('dark-mode', isDark.toString())
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
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

  const handleRefresh = () => {
    window.location.reload()
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchVisible(true)
      }
      // F11 全屏切换
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
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
      key: 'theme',
      icon: <BgColorsOutlined />,
      label: '主题设置',
      onClick: () => setThemeVisible(true)
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

  const themeConfig = useMemo(() => getThemeConfig(currentTheme, darkMode), [currentTheme, darkMode])

  // 动态更新CSS变量
  useEffect(() => {
    const preset = themePresets[currentTheme as keyof typeof themePresets] || themePresets.default
    document.documentElement.style.setProperty('--ant-primary-color', preset.token.colorPrimary)
  }, [currentTheme])

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
      <Layout className="pro-layout" style={{ minHeight: '100vh' }}>
        {/* 侧边栏 */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={256}
          collapsedWidth={64}
          className="pro-sider"
          style={{
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            height: '100vh',
            zIndex: 200,
            overflow: 'hidden'
          }}
        >
          {/* Logo区域 */}
          <div className="pro-sider-logo">
            <Flex align="center" gap={12} justify={collapsed ? 'center' : 'flex-start'}>
              <div className="logo-icon">
                <span>AI</span>
              </div>
              {!collapsed && (
                <div className="logo-text">
                  <Text className="logo-title">TrendPublish</Text>
                  <Text className="logo-subtitle">AI趋势发布系统</Text>
                </div>
              )}
            </Flex>
          </div>

          {/* 菜单 */}
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="pro-menu"
          />
        </Sider>

        <Layout className="pro-main-layout" style={{ 
          marginInlineStart: collapsed ? 64 : 256, 
          transition: 'margin-inline-start 0.2s cubic-bezier(0.2, 0, 0, 1) 0s'
        }}>
          {/* 顶部导航 */}
          <Header className="pro-header">
            <Flex justify="space-between" align="center" style={{ height: '100%' }}>
              {/* 左侧 */}
              <Flex align="center" gap={16}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="trigger-btn"
                />
                <Divider type="vertical" className="header-divider" />
                <Breadcrumb 
                  items={breadcrumbItems}
                  className="pro-breadcrumb"
                />
              </Flex>

              {/* 右侧 */}
              <Flex align="center" gap={4}>
                {/* 功能按钮 */}
                <Tooltip title="刷新页面">
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    className="header-action-btn"
                  />
                </Tooltip>

                <Tooltip title={isFullscreen ? '退出全屏 (F11)' : '全屏显示 (F11)'}>
                  <Button
                    type="text"
                    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                    onClick={toggleFullscreen}
                    className="header-action-btn"
                  />
                </Tooltip>

                <Tooltip title="通知中心">
                  <Badge count={notificationCount} size="small" offset={[0, 2]}>
                    <Button
                      type="text"
                      icon={<BellOutlined />}
                      className="header-action-btn"
                    />
                  </Badge>
                </Tooltip>

                <Tooltip title="主题设置">
                  <Button
                    type="text"
                    icon={<BgColorsOutlined />}
                    onClick={() => setThemeVisible(true)}
                    className="header-action-btn"
                  />
                </Tooltip>

                <Tooltip title={darkMode ? '切换到亮色模式' : '切换到暗色模式'}>
                  <Button
                    type="text"
                    icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggleTheme}
                    className="header-action-btn"
                  />
                </Tooltip>

                <Divider type="vertical" className="header-divider" />

                {/* 用户信息 */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                  trigger={['click']}
                >
                  <Button type="text" className="user-info-btn">
                    <Flex align="center" gap={8}>
                      <Avatar 
                        size={32}
                        className="user-avatar"
                        icon={<UserOutlined />}
                        src={userInfo?.avatar}
                      />
                      <Flex vertical style={{ alignItems: 'flex-start' }}>
                        <Text className="user-name">
                          {userInfo?.name || '管理员'}
                        </Text>
                        <Text className="user-role">
                          {userInfo?.role === 'admin' ? '系统管理员' : '普通用户'}
                        </Text>
                      </Flex>
                      <DownOutlined className="user-dropdown-icon" />
                    </Flex>
                  </Button>
                </Dropdown>
              </Flex>
            </Flex>
          </Header>

          {/* 主内容区域 */}
          <Content className="pro-content">
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workflows" element={<WorkflowManagement />} />
                <Route path="/content" element={<ContentManagement />} />
                <Route path="/templates" element={<TemplateManagement />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/publish-history" element={<PublishHistory />} />
                <Route path="/config" element={<ConfigManagement />} />
                <Route path="/logs" element={<SystemLogs />} />
                <Route path="/announcements" element={<AnnouncementManagement />} />
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

      {/* 主题设置抽屉 */}
      <ThemeSelector
        visible={themeVisible}
        onClose={() => setThemeVisible(false)}
        currentTheme={currentTheme}
        isDark={darkMode}
        onThemeChange={handleThemeChange}
        onDarkModeChange={handleDarkModeChange}
      />
    </ConfigProvider>
  )
}

export default App