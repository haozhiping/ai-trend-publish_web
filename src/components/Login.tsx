import React, { useState } from 'react'
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider,
  Checkbox,
  Alert,
  theme,
  Flex,
  Row,
  Col,
  Tabs
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  SafetyOutlined,
  ThunderboltOutlined,
  MobileOutlined,
  MailOutlined,
  WechatOutlined,
  AlipayOutlined,
  GithubOutlined,
  GoogleOutlined
} from '@ant-design/icons'

const { Title, Text, Link } = Typography
const { TabPane } = Tabs

interface LoginProps {
  onLogin: (userInfo: any) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState<'account' | 'mobile'>('account')

  const handleSubmit = async (values: any) => {
    setLoading(true)
    setError('')
    
    try {
      // 模拟登录验证
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (
        (loginType === 'account' && values.username === 'admin' && values.password === 'admin123') ||
        (loginType === 'mobile' && values.mobile === '13800138000' && values.captcha === '1234')
      ) {
        const userInfo = {
          id: '1',
          username: loginType === 'account' ? values.username : values.mobile,
          email: 'admin@example.com',
          name: '系统管理员',
          avatar: null,
          role: 'admin',
          permissions: ['*']
        }
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('token', 'mock-jwt-token')
        onLogin(userInfo)
      } else {
        setError(loginType === 'account' ? '用户名或密码错误' : '手机号或验证码错误')
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGetCaptcha = () => {
    // 模拟获取验证码
    console.log('获取验证码')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, 
        ${token.colorPrimary}08 0%, 
        ${token.colorPrimaryBg} 25%, 
        ${token.colorBgContainer} 50%,
        ${token.colorPrimaryBg} 75%,
        ${token.colorPrimary}08 100%
      )`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景装饰元素 */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle at 30% 20%, ${token.colorPrimary}15 0%, transparent 50%),
                     radial-gradient(circle at 70% 80%, ${token.colorSuccess}10 0%, transparent 50%),
                     radial-gradient(circle at 90% 40%, ${token.colorWarning}08 0%, transparent 50%)`,
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <Row style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* 左侧品牌展示区 */}
        <Col xs={0} md={12} lg={14} xl={16} style={{
          background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }} />
          
          <div style={{ 
            textAlign: 'center', 
            color: '#ffffff',
            position: 'relative',
            zIndex: 2,
            maxWidth: 480,
            padding: '0 40px'
          }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <ThunderboltOutlined style={{ fontSize: 48, color: '#ffffff' }} />
            </div>
            
            <Title level={1} style={{ 
              color: '#ffffff', 
              marginBottom: 16,
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              AI 趋势发布系统
            </Title>
            
            <Text style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              fontSize: 18,
              lineHeight: 1.6,
              display: 'block',
              marginBottom: 32
            }}>
              智能内容管理平台，让AI为您的内容创作赋能
            </Text>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              marginTop: 48
            }}>
              {[
                { icon: <ThunderboltOutlined />, title: '智能生成', desc: 'AI驱动内容创作' },
                { icon: <SafetyOutlined />, title: '安全可靠', desc: '企业级安全保障' },
                { icon: <UserOutlined />, title: '易于使用', desc: '直观的操作界面' }
              ].map((feature, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: 20,
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <div style={{ 
                    fontSize: 24, 
                    marginBottom: 8,
                    color: '#ffffff'
                  }}>
                    {feature.icon}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#ffffff'
                  }}>
                    {feature.title}
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    {feature.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* 右侧登录表单区 */}
        <Col xs={24} md={12} lg={10} xl={8} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          background: token.colorBgContainer
        }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer
              }}
              bodyStyle={{ padding: '40px 32px 32px' }}
            >
              {/* 登录头部 */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ 
                  margin: 0, 
                  color: token.colorText,
                  fontSize: 28,
                  fontWeight: 600
                }}>
                  欢迎登录
                </Title>
                <Text type="secondary" style={{ 
                  fontSize: 14,
                  marginTop: 8,
                  display: 'block'
                }}>
                  登录您的账户以继续使用
                </Text>
              </div>

              {/* 错误提示 */}
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{ 
                    marginBottom: 24, 
                    borderRadius: 8,
                    border: `1px solid ${token.colorErrorBorder}`,
                    background: token.colorErrorBg
                  }}
                />
              )}

              {/* 登录方式切换 */}
              <Tabs 
                activeKey={loginType} 
                onChange={(key) => setLoginType(key as 'account' | 'mobile')}
                centered
                style={{ marginBottom: 24 }}
                items={[
                  {
                    key: 'account',
                    label: (
                      <span style={{ padding: '0 8px' }}>
                        <UserOutlined style={{ marginRight: 6 }} />
                        账户密码登录
                      </span>
                    )
                  },
                  {
                    key: 'mobile',
                    label: (
                      <span style={{ padding: '0 8px' }}>
                        <MobileOutlined style={{ marginRight: 6 }} />
                        手机号登录
                      </span>
                    )
                  }
                ]}
              />

              {/* 登录表单 */}
              <Form
                name="login"
                onFinish={handleSubmit}
                autoComplete="off"
                size="large"
                layout="vertical"
              >
                {loginType === 'account' ? (
                  <>
                    <Form.Item
                      name="username"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                        placeholder="用户名"
                        style={{ 
                          borderRadius: 8,
                          height: 48,
                          fontSize: 14
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: '请输入密码' }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                        placeholder="密码"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        style={{ 
                          borderRadius: 8,
                          height: 48,
                          fontSize: 14
                        }}
                      />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      name="mobile"
                      rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                      ]}
                    >
                      <Input
                        prefix={<MobileOutlined style={{ color: token.colorTextTertiary }} />}
                        placeholder="手机号"
                        style={{ 
                          borderRadius: 8,
                          height: 48,
                          fontSize: 14
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="captcha"
                      rules={[{ required: true, message: '请输入验证码' }]}
                    >
                      <Row gutter={8}>
                        <Col span={16}>
                          <Input
                            prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />}
                            placeholder="验证码"
                            style={{ 
                              borderRadius: 8,
                              height: 48,
                              fontSize: 14
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <Button
                            onClick={handleGetCaptcha}
                            style={{ 
                              width: '100%',
                              height: 48,
                              borderRadius: 8,
                              fontSize: 14
                            }}
                          >
                            获取验证码
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </>
                )}

                <Form.Item>
                  <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox style={{ fontSize: 14 }}>记住我</Checkbox>
                    </Form.Item>
                    <Link style={{ fontSize: 14 }}>
                      忘记密码？
                    </Link>
                  </Flex>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    style={{ 
                      height: 48,
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`,
                      border: 'none',
                      boxShadow: `0 4px 12px ${token.colorPrimary}30`
                    }}
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                </Form.Item>
              </Form>

              {/* 第三方登录 */}
              <Divider style={{ margin: '24px 0', fontSize: 14, color: token.colorTextTertiary }}>
                其他登录方式
              </Divider>

              <Flex justify="center" gap={16}>
                {[
                  { icon: <WechatOutlined />, color: '#1AAD19', name: '微信' },
                  { icon: <AlipayOutlined />, color: '#1677FF', name: '支付宝' },
                  { icon: <GithubOutlined />, color: '#24292F', name: 'GitHub' },
                  { icon: <GoogleOutlined />, color: '#DB4437', name: 'Google' }
                ].map((provider, index) => (
                  <Button
                    key={index}
                    shape="circle"
                    size="large"
                    style={{
                      width: 48,
                      height: 48,
                      border: `1px solid ${token.colorBorder}`,
                      color: provider.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = provider.color
                      e.currentTarget.style.background = `${provider.color}10`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = token.colorBorder
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {provider.icon}
                  </Button>
                ))}
              </Flex>

              {/* 注册链接 */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: 24,
                fontSize: 14,
                color: token.colorTextSecondary
              }}>
                还没有账户？ <Link>立即注册</Link>
              </div>
            </Card>

            {/* 演示账号信息 */}
            <Card 
              size="small" 
              style={{ 
                marginTop: 16,
                background: token.colorFillAlter,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 8
              }}
              title={
                <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
                  <SafetyOutlined style={{ marginRight: 4 }} />
                  演示账号
                </Text>
              }
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Flex justify="space-between">
                  <Text style={{ fontSize: 12 }}>账户登录:</Text>
                  <Text code style={{ fontSize: 12 }}>admin / admin123</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text style={{ fontSize: 12 }}>手机登录:</Text>
                  <Text code style={{ fontSize: 12 }}>13800138000 / 1234</Text>
                </Flex>
              </Space>
            </Card>

            {/* 底部信息 */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: 24,
              fontSize: 12,
              color: token.colorTextTertiary
            }}>
              <SafetyOutlined style={{ marginRight: 4 }} />
              安全登录 · 数据加密传输 · 隐私保护
            </div>
          </div>
        </Col>
      </Row>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        .ant-tabs-tab {
          font-weight: 500 !important;
        }
        
        .ant-tabs-tab-active {
          font-weight: 600 !important;
        }
        
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          box-shadow: 0 0 0 2px ${token.colorPrimary}20 !important;
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px ${token.colorPrimary}40 !important;
        }
      `}</style>
    </div>
  )
}

export default Login