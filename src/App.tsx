import React, { useState, useMemo } from 'react'
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
  Divider
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
  HomeOutlined
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import WorkflowManagement from './pages/WorkflowManagement'
import ContentManagement from './pages/ContentManagement'
import TemplateManagement from './pages/TemplateManagement'
import DataSources from './pages/DataSources'
import PublishHistory from './pages/PublishHistory'
import ConfigManagement from './pages/ConfigManagement'
import SystemLogs from './pages/SystemLogs'
import './index.css'

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

  const toggleTheme = () => {
    setDarkMode((prev) => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light')
      return !prev
    })
  }

  const currentMenuItem = menuItems.find(item => item.key === location.pathname)

  const breadcrumbItems = [
    {
      title: (
        <Space>
          <HomeOutlined />
          <span>首页</span>
        </Space>
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
      icon: <UserOutlined />,
      label: '个人设置'
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: '帮助文档'
    },
    {
      key: 'github',
      icon: <GithubOutlined />,
      label: 'GitHub'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true
    }
  ]

  const themeConfig = useMemo(() => ({
    token: {
      colorPrimary: '#1677ff',
      colorBgBase: darkMode ? '#141414' : '#ffffff',
      colorTextBase: darkMode ? '#ffffff' : '#000000',
      colorBgContainer: darkMode ? '#1f1f1f' : '#ffffff',
      colorBgElevated: darkMode ? '#262626' : '#ffffff',
      colorBorder: darkMode ? '#424242' : '#d9d9d9',
      colorBorderSecondary: darkMode ? '#303030' : '#f0f0f0',
      borderRadius: 8,
      fontSize: 14,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      boxShadow: darkMode 
        ? '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)'
        : '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      boxShadowSecondary: darkMode
        ? '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
        : '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
    },
    algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    components: {
      Layout: {
        siderBg: darkMode ? '#001529' : '#ffffff',
        headerBg: darkMode ? '#1f1f1f' : '#ffffff',
        bodyBg: darkMode ? '#141414' : '#f5f5f5'
      },
      Menu: {
        itemBg: 'transparent',
        itemSelectedBg: darkMode ? '#1677ff' : '#e6f4ff',
        itemSelectedColor: darkMode ? '#ffffff' : '#1677ff',
        itemHoverBg: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        itemActiveBg: darkMode ? '#1677ff' : '#e6f4ff'
      },
      Card: {
        headerBg: darkMode ? '#1f1f1f' : '#fafafa'
      }
    }
  }), [darkMode])

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={256}
          style={{
            background: darkMode ? '#001529' : '#ffffff',
            borderRight: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
            boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 100
          }}
        >
          {/* Logo区域 */}
          <div style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            borderBottom: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
            background: darkMode ? '#001529' : '#ffffff'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: darkMode ? '#ffffff' : '#1677ff',
              fontSize: collapsed ? 20 : 18,
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
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
                fontWeight: 'bold'
              }}>
                AI
              </div>
              {!collapsed && (
                <span style={{ color: darkMode ? '#ffffff' : '#262626' }}>
                  趋势发布系统
                </span>
              )}
            </div>
          </div>

          {/* 菜单 */}
          <Menu
            theme={darkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              borderRight: 0,
              background: 'transparent',
              fontSize: 14,
              fontWeight: 500
            }}
          />
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
          {/* 顶部导航 */}
          <Header style={{
            background: darkMode ? '#1f1f1f' : '#ffffff',
            borderBottom: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 99,
            boxShadow: '0 1px 4px rgba(0,21,41,.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                  fontSize: 16,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
              <Divider type="vertical" style={{ height: 24 }} />
              <Breadcrumb 
                items={breadcrumbItems}
                style={{ 
                  fontSize: 14,
                  color: darkMode ? '#ffffff' : '#262626'
                }}
              />
            </div>

            <Space size="middle">
              <Tooltip title="通知">
                <Badge count={3} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{ 
                      fontSize: 16,
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
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
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </Tooltip>

              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: 8 }}>
                  <Avatar 
                    size={32}
                    style={{ 
                      background: 'linear-gradient(135deg, #1677ff, #69c0ff)',
                      border: '2px solid rgba(22, 119, 255, 0.2)'
                    }}
                    icon={<UserOutlined />}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>
                      管理员
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.2 }}>
                      admin@example.com
                    </Text>
                  </div>
                </Space>
              </Dropdown>
            </Space>
          </Header>

          {/* 主内容区域 */}
          <Content style={{
            margin: 0,
            minHeight: 'calc(100vh - 64px)',
            background: darkMode ? '#141414' : '#f5f5f5',
            padding: 24,
            overflow: 'auto'
          }}>
            <div style={{ 
              maxWidth: '100%',
              margin: '0 auto',
              background: 'transparent'
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
    </ConfigProvider>
  )
}

export default App