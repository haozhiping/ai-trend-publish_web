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
  Flex
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  SafetyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

interface LoginProps {
  onLogin: (userInfo: any) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (values: any) => {
    setLoading(true)
    setError('')
    
    try {
      // 模拟登录验证
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

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${token.colorPrimary}15, ${token.colorPrimaryBg})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }}>
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: token.boxShadowSecondary,
          border: `1px solid ${token.colorBorderSecondary}`
        }}
        bodyStyle={{ padding: 40 }}
      >
        {/* Logo 和标题 */}
        <Flex vertical align="center" style={{ marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: `0 8px 24px ${token.colorPrimary}30`
          }}>
            <ThunderboltOutlined style={{ fontSize: 32, color: '#ffffff' }} />
          </div>
          <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
            AI 趋势发布系统
          </Title>
          <Text type="secondary" style={{ textAlign: 'center', marginTop: 8 }}>
            智能内容管理平台
          </Text>
        </Flex>

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 24, borderRadius: 8 }}
          />
        )}

        {/* 登录表单 */}
        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
              placeholder="用户名"
              style={{ borderRadius: 8 }}
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
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Button type="link" style={{ padding: 0 }}>
                忘记密码？
              </Button>
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
                fontWeight: 500
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            演示账号
          </Text>
        </Divider>

        {/* 演示账号信息 */}
        <Card 
          size="small" 
          style={{ 
            background: token.colorFillAlter,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 8
          }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Flex justify="space-between">
              <Text strong style={{ fontSize: 12 }}>用户名:</Text>
              <Text code style={{ fontSize: 12 }}>admin</Text>
            </Flex>
            <Flex justify="space-between">
              <Text strong style={{ fontSize: 12 }}>密码:</Text>
              <Text code style={{ fontSize: 12 }}>admin123</Text>
            </Flex>
          </Space>
        </Card>

        {/* 底部信息 */}
        <Flex justify="center" style={{ marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <SafetyOutlined /> 安全登录 · 数据加密传输
          </Text>
        </Flex>
      </Card>
    </div>
  )
}

export default Login