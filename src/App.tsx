import React, { useState, useMemo, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
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
  FileProtectOutlined,
  PlayCircleOutlined
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
import VideoManagement from './pages/VideoManagement'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import GlobalSearch from './components/GlobalSearch'
import ThemeSelector from './components/ThemeSelector'
import NotificationCenter from './components/NotificationCenter'
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
  },
  { 
    key: '/videos', 
    icon: <PlayCircleOutlined />, 
    label: '短视频',
    breadcrumb: '短视频管理'
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
  
  // 主题切换动画状态
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationOrigin, setAnimationOrigin] = useState({ x: 0, y: 0 })

  // 设置 HTML 根元素的 data-theme 属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // 检查是否使用主系统登录（从后端获取配置，默认true）
  const [useMainSystemAuth, setUseMainSystemAuth] = useState(true)
  const [mainFrontendUrl, setMainFrontendUrl] = useState('')
  const [authConfigLoaded, setAuthConfigLoaded] = useState(false)

  // 获取登录配置
  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL
      if (!apiBaseUrl) {
        console.error('[工作流系统] VITE_API_BASE_URL 未配置')
        return
      }
        const resp = await fetch(`${apiBaseUrl}/auth/config`)
        const data = await resp.json()
        
        if (data.code === 200 && data.data) {
          setUseMainSystemAuth(data.data.useMainSystemAuth !== false) // 默认true
          setMainFrontendUrl(data.data.mainFrontendUrl || '')
        }
      } catch (error) {
        console.error('[工作流系统] 获取登录配置失败:', error)
        // 默认使用主系统登录
        setUseMainSystemAuth(true)
      } finally {
        setAuthConfigLoaded(true)
      }
    }
    
    fetchAuthConfig()
  }, [])

  // 防止跳转风暴的标记
  const markRedirect = () => {
    sessionStorage.setItem('workflow_last_redirect', `${Date.now()}`)
  }

  const canRedirect = () => {
    const last = sessionStorage.getItem('workflow_last_redirect')
    if (!last) return true
    return Date.now() - Number(last) > 5000 // 至少5秒间隔，避免跳转风暴
  }

  // 检查认证状态
  useEffect(() => {
    if (!authConfigLoaded) return // 等待配置加载完成
    
    // 检查URL参数中是否有主系统的token（SSO登录）
    const urlParams = new URLSearchParams(window.location.search)
    const mainSystemToken = urlParams.get('token')
    
    if (mainSystemToken) {
      console.log('[工作流系统] 检测到主系统token，开始SSO登录')
      // 保存主系统token
      localStorage.setItem('token', mainSystemToken)
      // 清除URL参数（包括token和returnUrl）
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
      
      // 验证token并获取用户信息（会自动同步用户信息到子系统）
      verifyMainSystemToken(mainSystemToken)
      return
    }
    
    // 检查是否已经在登录页面，避免循环跳转
    const currentPath = window.location.pathname
    const isLoginPage = currentPath === '/login' || currentPath.includes('/login')
    
    // 检查URL中是否已经有returnUrl参数，避免重复跳转
    const hasReturnUrl = urlParams.has('returnUrl')
    
    // 检查本地token
    const token = localStorage.getItem('token')
    const savedUserInfo = localStorage.getItem('userInfo')
    
    if (token && savedUserInfo) {
      // 验证token是否有效
      verifyLocalToken(token)
    } else {
      // 如果没有token，根据配置决定跳转
      if (useMainSystemAuth) {
        // 使用主系统登录，跳转到主系统登录页面
        if (!mainFrontendUrl) {
          console.error('[工作流系统] 配置为使用主系统登录，但 MAIN_FRONTEND_URL 未配置')
          setIsAuthenticated(false)
          setUserInfo(null)
          return
        }
        
        // 防止跳转风暴和循环跳转
        if (hasReturnUrl || isLoginPage) {
          console.warn('[工作流系统] 检测到循环跳转，停止跳转')
          setIsAuthenticated(false)
          setUserInfo(null)
          return
        }
        
        if (!canRedirect()) {
          console.log('[工作流系统] 最近已跳转过登录，忽略本次跳转')
          setIsAuthenticated(false)
          setUserInfo(null)
          return
        }
        
        // 只使用当前路径作为returnUrl，避免嵌套编码
        // 使用 pathname 而不是 href，避免包含查询参数
        const baseUrl = `${window.location.origin}${window.location.pathname}`
        const returnUrl = encodeURIComponent(baseUrl)
        markRedirect()
        window.location.href = `${mainFrontendUrl}/login?returnUrl=${returnUrl}`
      } else {
        // 使用子系统登录，显示登录页面
        setIsAuthenticated(false)
        setUserInfo(null)
      }
    }
  }, [authConfigLoaded, useMainSystemAuth, mainFrontendUrl])

  // 验证本地token
  const verifyLocalToken = async (token: string) => {
    try {
      const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL
      if (!apiBaseUrl) {
        console.error('[工作流系统] VITE_API_BASE_URL 未配置')
        return
      }
      const resp = await fetch(`${apiBaseUrl}/auth/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      const data = await resp.json()
      
      if (data.code === 200 && data.data) {
        setIsAuthenticated(true)
        setUserInfo(data.data)
        localStorage.setItem('userInfo', JSON.stringify(data.data))
      } else {
        // token无效，清除并重新登录
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        if (useMainSystemAuth && mainFrontendUrl && canRedirect()) {
          // 只使用当前路径作为returnUrl，避免嵌套编码
          const returnUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}`)
          markRedirect()
          window.location.href = `${mainFrontendUrl}/login?returnUrl=${returnUrl}`
        } else {
          setIsAuthenticated(false)
          setUserInfo(null)
        }
      }
    } catch (error) {
      console.error('[工作流系统] 验证token失败:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      if (useMainSystemAuth && mainFrontendUrl && canRedirect()) {
        // 只使用当前路径作为returnUrl，避免嵌套编码
        // 使用 pathname 而不是 href，避免包含查询参数
        const baseUrl = `${window.location.origin}${window.location.pathname}`
        const returnUrl = encodeURIComponent(baseUrl)
        markRedirect()
        window.location.href = `${mainFrontendUrl}/login?returnUrl=${returnUrl}`
      } else {
        setIsAuthenticated(false)
        setUserInfo(null)
      }
    }
  }

  // 验证主系统token
  const verifyMainSystemToken = async (token: string) => {
    try {
      // 调用工作流系统的后端API验证主系统token
      const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL
      if (!apiBaseUrl) {
        console.error('[工作流系统] VITE_API_BASE_URL 未配置')
        return
      }
      const resp = await fetch(`${apiBaseUrl}/auth/verify-main-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
      
      const data = await resp.json()
      
      if (data.code === 200 && data.data) {
        // 验证成功，设置用户信息
        const userInfo = data.data.user || {
          id: data.data.userId,
          username: data.data.username,
          name: data.data.name || data.data.username,
          role: data.data.role || 'user',
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        setIsAuthenticated(true)
        setUserInfo(userInfo)
        message.success('登录成功').then(() => {})
      } else {
        // 验证失败，清除token
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        setUserInfo(null)
      }
    } catch (error) {
      console.error('[工作流系统] 验证主系统token失败:', error)
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setUserInfo(null)
    }
  }

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

  const toggleTheme = (event: React.MouseEvent) => {
    if (isAnimating) return
    
    // 获取点击位置
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    
    setAnimationOrigin({ x, y })
    setIsAnimating(true)
    
    // 在动画开始后立即切换主题
    setTimeout(() => {
      const newDarkMode = !darkMode
      setDarkMode(newDarkMode)
      localStorage.setItem('dark-mode', newDarkMode.toString())
      document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light')
    }, 150)
    
    // 动画结束
    setTimeout(() => {
      setIsAnimating(false)
    }, 800)
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
      title: <span>{currentMenuItem.breadcrumb}</span>,
      onClick: () => {}
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
      type: 'divider' as const
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
      type: 'divider' as const
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

  // 如果未认证，根据配置显示登录页面或跳转到主系统
  if (!isAuthenticated) {
    // 如果配置为使用主系统登录，且配置已加载，则跳转到主系统
    // 注意：跳转逻辑在 useEffect 中处理，这里只显示加载状态
    if (authConfigLoaded && useMainSystemAuth && mainFrontendUrl) {
      // 检查是否已经在跳转过程中（URL中有returnUrl参数）
      const urlParams = new URLSearchParams(window.location.search)
      const hasReturnUrl = urlParams.has('returnUrl')
      const hasToken = urlParams.has('token')
      
      // 如果有token参数，说明是从主系统跳转回来的，等待token验证
      if (hasToken) {
        return (
          <ConfigProvider theme={themeConfig}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>正在验证登录信息...</div>
            </div>
          </ConfigProvider>
        )
      }
      
      // 如果已经有returnUrl，说明已经在跳转过程中，显示加载状态
      if (hasReturnUrl) {
        return (
          <ConfigProvider theme={themeConfig}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>正在跳转到登录页面...</div>
            </div>
          </ConfigProvider>
        )
      }
      
      // 如果没有returnUrl，说明是首次访问，跳转逻辑在useEffect中处理
      // 这里只显示加载状态，避免显示登录界面
      return (
        <ConfigProvider theme={themeConfig}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div>正在加载...</div>
          </div>
        </ConfigProvider>
      )
    }
    
    // 如果配置为使用子系统登录，或配置未加载完成，显示登录页面
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

                <NotificationCenter count={notificationCount} />

                <Tooltip title="查看源码">
                  <Button
                    type="text"
                    icon={<GithubOutlined />}
                    onClick={() => window.open('https://github.com/kilimro/ai-trend-publish_web', '_blank')}
                    className="header-action-btn github-link"
                  />
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
                    disabled={isAnimating}
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
      
      {/* 主题切换动画遮罩 */}
      {isAnimating && createPortal(
        <div
          className="theme-toggle-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'hidden'
          }}
        >
          <div
            className="theme-toggle-circle expanding"
            style={{
              position: 'absolute',
              left: animationOrigin.x,
              top: animationOrigin.y,
              width: 0,
              height: 0,
              borderRadius: '50%',
              background: !darkMode ? '#000000' : '#ffffff',
              transform: 'translate(-50%, -50%)',
              willChange: 'width, height, opacity'
            }}
          />
        </div>,
        document.body
      )}
    </ConfigProvider>
  )
}

export default App