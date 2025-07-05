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
  Tabs,
  message
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  MobileOutlined,
  SafetyOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  WechatOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

interface LoginProps {
  onLogin: (userInfo: any) => void
}

type LoginType = 'account' | 'mobile'

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginType, setLoginType] = useState<LoginType>('account')
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    setError('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (values.username === 'admin' && values.password === 'admin123') {
        const userInfo = {
          id: '1',
          username: values.username,
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
        setError('用户名或密码错误')
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGetCaptcha = async () => {
    setCaptchaLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('获取验证码成功！验证码为：1234')
      
      // 开始倒计时
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      message.error('获取验证码失败')
    } finally {
      setCaptchaLoading(false)
    }
  }

  const iconStyles = {
    marginInlineStart: '16px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '368px',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '48px 40px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Logo 和标题 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            background: '#1677ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '24px',
            color: '#ffffff'
          }}>
            AI
          </div>
          <Title level={2} style={{ 
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 600,
            color: '#000000'
          }}>
            AI 趋势发布系统
          </Title>
          <Text style={{ 
            color: '#999999',
            fontSize: '14px'
          }}>
            Ant Design 是西湖区最具影响力的 Web 设计规范
          </Text>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px', borderRadius: '8px' }}
          />
        )}

        {/* 登录表单 */}
        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          {/* 标签页 */}
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            style={{ marginBottom: '32px' }}
            items={[
              { key: 'account', label: '账户密码登录' },
              { key: 'mobile', label: '手机号登录' }
            ]}
          />

          {loginType === 'account' && (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
                style={{ marginBottom: '20px' }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#999999' }} />}
                  placeholder="用户名: admin or user"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
                style={{ marginBottom: '24px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999999' }} />}
                  placeholder="密码: admin123"
                />
              </Form.Item>
            </>
          )}

          {loginType === 'mobile' && (
            <>
              <Form.Item
                name="mobile"
                rules={[
                  { required: true, message: '请输入手机号！' },
                  { pattern: /^1\d{10}$/, message: '手机号格式错误！' }
                ]}
                style={{ marginBottom: '20px' }}
              >
                <Input
                  prefix={<MobileOutlined style={{ color: '#999999' }} />}
                  placeholder="手机号"
                />
              </Form.Item>

              <Form.Item
                name="captcha"
                rules={[{ required: true, message: '请输入验证码！' }]}
                style={{ marginBottom: '24px' }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input
                    prefix={<LockOutlined style={{ color: '#999999' }} />}
                    placeholder="请输入验证码"
                    style={{ flex: 1 }}
                  />
                  <Button 
                    onClick={handleGetCaptcha}
                    loading={captchaLoading}
                    disabled={countdown > 0}
                    style={{ minWidth: '100px' }}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                </div>
              </Form.Item>
            </>
          )}

          <div style={{ 
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Form.Item name="autoLogin" valuePropName="checked" noStyle>
              <Checkbox style={{ fontSize: '14px', color: '#666666' }}>自动登录</Checkbox>
            </Form.Item>
            <a 
              href="#" 
              style={{ 
                color: '#1677ff',
                fontSize: '14px',
                textDecoration: 'none'
              }}
              onClick={(e) => e.preventDefault()}
            >
              忘记密码
            </a>
          </div>

          <Form.Item style={{ marginBottom: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ 
                height: '48px',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        {/* 其他登录方式 */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <Space>
            <Text style={{ 
              color: '#999999',
              fontSize: '14px'
            }}>
              其他登录方式
            </Text>
            <AlipayCircleOutlined style={iconStyles} />
            <TaobaoCircleOutlined style={iconStyles} />
            <WeiboCircleOutlined style={iconStyles} />
            <WechatOutlined style={iconStyles} />
          </Space>
        </div>

        {/* 演示账号提示 */}
        <div style={{
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Text strong style={{ 
            fontSize: '14px', 
            display: 'block', 
            marginBottom: '8px',
            color: '#333333'
          }}>
            演示账号
          </Text>
          <div style={{ 
            fontSize: '12px', 
            color: '#666666',
            lineHeight: '20px'
          }}>
            <div>用户名: admin</div>
            <div>密码: admin123</div>
          </div>
        </div>

        {/* 底部版权 */}
        <div style={{ 
          textAlign: 'center',
          color: '#cccccc',
          fontSize: '12px',
          lineHeight: '20px'
        }}>
          <div>
            Copyright © 2024 蚂蚁集团体验技术部出品
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login