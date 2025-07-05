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
      background: token.colorBgContainer,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '368px'
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
            fontSize: '33px',
            fontWeight: 600,
            color: token.colorText
          }}>
            AI 趋势发布系统
          </Title>
          <Text style={{ 
            color: token.colorTextSecondary,
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
            style={{ marginBottom: '24px' }}
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
            style={{ marginBottom: '24px' }}
          >
            <Tabs.TabPane key="account" tab="账户密码登录" />
            <Tabs.TabPane key="mobile" tab="手机号登录" />
          </Tabs>

          {loginType === 'account' && (
            <>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="用户名: admin or user"
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="密码: ant.design"
                  style={{ height: '40px' }}
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
              >
                <Input
                  prefix={<MobileOutlined style={{ color: token.colorTextTertiary }} />}
                  placeholder="手机号"
                  style={{ height: '40px' }}
                />
              </Form.Item>

              <Form.Item
                name="captcha"
                rules={[{ required: true, message: '请输入验证码！' }]}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="请输入验证码"
                    style={{ height: '40px', flex: 1 }}
                  />
                  <Button style={{ height: '40px' }}>
                    获取验证码
                  </Button>
                </div>
              </Form.Item>
            </>
          )}

          <div style={{ marginBottom: '24px' }}>
            <Flex justify="space-between" align="center">
              <Form.Item name="autoLogin" valuePropName="checked" noStyle>
                <Checkbox>自动登录</Checkbox>
              </Form.Item>
              <Button type="link" style={{ padding: 0 }}>
                忘记密码
              </Button>
            </Flex>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: '40px' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        {/* 其他登录方式 */}
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Text style={{ color: token.colorTextSecondary }}>其他登录方式</Text>
            <AlipayCircleOutlined style={iconStyles} />
            <TaobaoCircleOutlined style={iconStyles} />
            <WeiboCircleOutlined style={iconStyles} />
            <WechatOutlined style={iconStyles} />
          </Space>
        </div>

        {/* 演示账号提示 */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: token.colorFillAlter,
          borderRadius: '6px',
          border: `1px solid ${token.colorBorderSecondary}`
        }}>
          <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            演示账号
          </Text>
          <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>
            <div>用户名: admin</div>
            <div>密码: admin123</div>
          </div>
        </div>

        {/* 底部版权 */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          color: token.colorTextTertiary,
          fontSize: '12px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <SafetyOutlined style={{ marginRight: '4px' }} />
            安全登录 · 数据加密传输
          </div>
          <div>
            Copyright © 2024 蚂蚁集团体验技术部出品
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login