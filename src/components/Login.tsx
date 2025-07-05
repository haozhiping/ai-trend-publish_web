import React, { useState } from 'react'
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Divider,
  Checkbox,
  Alert,
  theme,
  Flex,
  Tabs
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  MobileOutlined,
  MailOutlined,
  WechatOutlined,
  AlipayOutlined,
  TaobaoOutlined,
  WeiboOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

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
      background: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 0'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 368,
        margin: '0 auto'
      }}>
        {/* 顶部 Logo 和标题 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            height: 44,
            lineHeight: '44px',
            marginBottom: 16
          }}>
            <img 
              alt="logo" 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iOCIgZmlsbD0iIzE2NzdGRiIvPgo8cGF0aCBkPSJNMjIgMTJMMzAgMjJMMjIgMzJMMTQgMjJMMjIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
              style={{ height: 44 }}
            />
          </div>
          <Title level={2} style={{ 
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: 600,
            margin: 0
          }}>
            AI 趋势发布系统
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            智能内容管理平台
          </Text>
        </div>

        {/* 登录表单容器 */}
        <div style={{
          background: '#fff',
          padding: '32px 40px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
          border: '1px solid #f0f0f0'
        }}>
          {/* 错误提示 */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
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
                label: '账户密码登录'
              },
              {
                key: 'mobile',
                label: '手机号登录'
              }
            ]}
          />

          {/* 登录表单 */}
          <Form
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
          >
            {loginType === 'account' ? (
              <>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名!' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    placeholder="用户名: admin"
                    style={{ height: 40 }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    placeholder="密码: admin123"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    style={{ height: 40 }}
                  />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="mobile"
                  rules={[
                    { required: true, message: '请输入手机号!' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误!' }
                  ]}
                >
                  <Input
                    prefix={<MobileOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                    placeholder="手机号: 13800138000"
                    style={{ height: 40 }}
                  />
                </Form.Item>

                <Form.Item
                  name="captcha"
                  rules={[{ required: true, message: '请输入验证码!' }]}
                >
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                      prefix={<MailOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                      placeholder="验证码: 1234"
                      style={{ height: 40, flex: 1 }}
                    />
                    <Button
                      onClick={handleGetCaptcha}
                      style={{ height: 40, width: 120 }}
                    >
                      获取验证码
                    </Button>
                  </div>
                </Form.Item>
              </>
            )}

            <div style={{ marginBottom: 24 }}>
              <Flex justify="space-between" align="center">
                <Form.Item name="autoLogin" valuePropName="checked" noStyle>
                  <Checkbox>自动登录</Checkbox>
                </Form.Item>
                <a style={{ color: token.colorPrimary }}>
                  忘记密码
                </a>
              </Flex>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ 
                  height: 40,
                  fontSize: 16
                }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          {/* 其他登录方式 */}
          <div>
            <Divider plain style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 14 }}>
              其他登录方式
            </Divider>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 24,
              marginTop: 24
            }}>
              <AlipayOutlined 
                style={{ 
                  fontSize: 24, 
                  color: '#1677FF',
                  cursor: 'pointer'
                }} 
              />
              <TaobaoOutlined 
                style={{ 
                  fontSize: 24, 
                  color: '#FF6A00',
                  cursor: 'pointer'
                }} 
              />
              <WeiboOutlined 
                style={{ 
                  fontSize: 24, 
                  color: '#E6162D',
                  cursor: 'pointer'
                }} 
              />
            </div>
          </div>
        </div>

        {/* 底部链接 */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: 24,
          color: 'rgba(0, 0, 0, 0.45)',
          fontSize: 14
        }}>
          <Space split={<Divider type="vertical" />}>
            <a style={{ color: 'rgba(0, 0, 0, 0.45)' }}>帮助</a>
            <a style={{ color: 'rgba(0, 0, 0, 0.45)' }}>隐私</a>
            <a style={{ color: 'rgba(0, 0, 0, 0.45)' }}>条款</a>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default Login