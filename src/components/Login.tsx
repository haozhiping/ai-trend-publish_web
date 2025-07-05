import React, { useState, useEffect } from 'react'
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
  Card
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  SafetyOutlined,
  ThunderboltOutlined,
  GithubOutlined,
  GoogleOutlined,
  WechatOutlined,
  AppleOutlined,
  RocketOutlined,
  StarOutlined,
  HeartOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

interface LoginProps {
  onLogin: (userInfo: any) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([])

  // 生成粒子动画
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          opacity: Math.random() * 0.5 + 0.1
        })
      }
      setParticles(newParticles)
    }
    generateParticles()
  }, [])

  const handleSubmit = async (values: any) => {
    setLoading(true)
    setError('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* 动态背景粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, ${particle.opacity})`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* 背景装饰图形 */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        animation: 'rotate 20s linear infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '150px',
        height: '150px',
        borderRadius: '30%',
        background: 'linear-gradient(-45deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
        animation: 'rotate 15s linear infinite reverse'
      }} />

      {/* 主登录卡片 */}
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}
        bodyStyle={{ padding: '48px 40px' }}
      >
        {/* 卡片顶部装饰 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)'
        }} />

        {/* Logo 和标题区域 */}
        <Flex vertical align="center" style={{ marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <ThunderboltOutlined style={{ 
              fontSize: '36px', 
              color: '#ffffff',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} />
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'shine 3s ease-in-out infinite'
            }} />
          </div>
          
          <Title level={2} style={{ 
            margin: 0, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '28px',
            fontWeight: 700
          }}>
            AI 趋势发布系统
          </Title>
          <Text style={{ 
            textAlign: 'center', 
            marginTop: '8px',
            color: '#8c8c8c',
            fontSize: '16px'
          }}>
            智能内容管理平台
          </Text>
        </Flex>

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ 
              marginBottom: '24px', 
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #fff2f0, #ffebe8)'
            }}
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
              prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="用户名"
              style={{ 
                borderRadius: '12px',
                height: '48px',
                border: '2px solid #f0f0f0',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea'
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{ 
                borderRadius: '12px',
                height: '48px',
                border: '2px solid #f0f0f0',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea'
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#8c8c8c' }}>记住我</Checkbox>
              </Form.Item>
              <Button 
                type="link" 
                style={{ 
                  padding: 0,
                  color: '#667eea',
                  fontWeight: 500
                }}
              >
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
                height: '52px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}
            >
              {loading ? '登录中...' : '立即登录'}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '32px 0', color: '#d9d9d9' }}>
          <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
            其他登录方式
          </Text>
        </Divider>

        {/* 第三方登录 */}
        <Flex justify="center" gap={16} style={{ marginBottom: '32px' }}>
          {[
            { icon: <GithubOutlined />, color: '#24292e', name: 'GitHub' },
            { icon: <GoogleOutlined />, color: '#4285f4', name: 'Google' },
            { icon: <WechatOutlined />, color: '#07c160', name: '微信' },
            { icon: <AppleOutlined />, color: '#000000', name: 'Apple' }
          ].map((item, index) => (
            <Button
              key={index}
              shape="circle"
              size="large"
              style={{
                width: '48px',
                height: '48px',
                border: '2px solid #f0f0f0',
                background: 'rgba(255, 255, 255, 0.8)',
                color: item.color,
                fontSize: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color
                e.currentTarget.style.background = item.color
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                e.currentTarget.style.color = item.color
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {item.icon}
            </Button>
          ))}
        </Flex>

        {/* 演示账号信息 */}
        <Card 
          size="small" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            borderRadius: '12px'
          }}
        >
          <Flex vertical gap={8}>
            <Flex align="center" gap={8} style={{ marginBottom: '8px' }}>
              <RocketOutlined style={{ color: '#667eea' }} />
              <Text strong style={{ fontSize: '14px', color: '#667eea' }}>演示账号</Text>
            </Flex>
            <Flex justify="space-between">
              <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>用户名:</Text>
              <Text code style={{ fontSize: '13px', background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: 'none', borderRadius: '4px' }}>admin</Text>
            </Flex>
            <Flex justify="space-between">
              <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>密码:</Text>
              <Text code style={{ fontSize: '13px', background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', border: 'none', borderRadius: '4px' }}>admin123</Text>
            </Flex>
          </Flex>
        </Card>

        {/* 底部信息 */}
        <Flex justify="center" style={{ marginTop: '32px' }}>
          <Text style={{ fontSize: '13px', color: '#bfbfbf' }}>
            <SafetyOutlined style={{ marginRight: '6px' }} />
            安全登录 · 数据加密传输
          </Text>
        </Flex>
      </Card>

      {/* 底部版权信息 */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        <Flex align="center" gap={8} style={{ marginBottom: '8px' }}>
          <HeartOutlined style={{ color: '#ff4d4f' }} />
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Made with love by AI Team
          </Text>
          <StarOutlined style={{ color: '#faad14' }} />
        </Flex>
        <Text style={{ fontSize: '12px', opacity: 0.7 }}>
          © 2024 AI 趋势发布系统. All rights reserved.
        </Text>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
        
        .ant-input:focus,
        .ant-input-password:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }
        
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #667eea !important;
          border-color: #667eea !important;
        }
        
        .ant-checkbox:hover .ant-checkbox-inner {
          border-color: #667eea !important;
        }
      `}</style>
    </div>
  )
}

export default Login