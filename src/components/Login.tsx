import React, { useState } from 'react'
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
  QqOutlined,
  WechatOutlined,
  GithubOutlined
} from '@ant-design/icons'
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components'
import { Space, Tabs, message, theme } from 'antd'
import type { CSSProperties } from 'react'

type LoginType = 'phone' | 'account'

interface LoginProps {
  onLogin: (userInfo: any) => void
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { token } = theme.useToken()
  const [loginType, setLoginType] = useState<LoginType>('account')

  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  }

  const handleFinish = async (values: any) => {
    try {
      // 模拟登录验证
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const isValidAccount = loginType === 'account' && values.username === 'admin' && values.password === 'admin123'
      const isValidPhone = loginType === 'phone' && values.mobile === '13800138000' && values.captcha === '1234'
      
      if (isValidAccount || isValidPhone) {
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
        message.success('登录成功！')
        onLogin(userInfo)
      } else {
        message.error(loginType === 'account' ? '用户名或密码错误' : '手机号或验证码错误')
      }
    } catch (error) {
      message.error('登录失败，请重试')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景装饰元素 */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        animation: 'float 4s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.06)',
        animation: 'float 5s ease-in-out infinite'
      }} />
      
      <ProConfigProvider hashed={false}>
        <div style={{ 
          backgroundColor: token.colorBgContainer,
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          width: '400px'
        }}>
          <LoginForm
            logo={
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                AI
              </div>
            }
            title="Ant Design"
            subTitle="Ant Design 是西湖区最具影响力的 Web 设计规范"
            onFinish={handleFinish}
            actions={
              <Space>
                其他登录方式
                <AlipayCircleOutlined style={iconStyles} />
                <TaobaoCircleOutlined style={iconStyles} />
                <WeiboCircleOutlined style={iconStyles} />
              </Space>
            }
          >
            <Tabs
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
              items={[
                {
                  key: 'account',
                  label: '账户密码登录'
                },
                {
                  key: 'phone', 
                  label: '手机号登录'
                }
              ]}
            />
            
            {loginType === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'用户名: admin or user'}
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                    strengthText:
                      'Password should contain numbers, letters and special characters, at least 8 characters long.',
                    statusRender: (value) => {
                      const getStatus = () => {
                        if (value && value.length > 12) {
                          return 'ok'
                        }
                        if (value && value.length > 6) {
                          return 'pass'
                        }
                        return 'poor'
                      }
                      const status = getStatus()
                      if (status === 'pass') {
                        return (
                          <div style={{ color: token.colorWarning }}>
                            强度：中
                          </div>
                        )
                      }
                      if (status === 'ok') {
                        return (
                          <div style={{ color: token.colorSuccess }}>
                            强度：强
                          </div>
                        )
                      }
                      return (
                        <div style={{ color: token.colorError }}>强度：弱</div>
                      )
                    },
                  }}
                  placeholder={'密码: ant.design'}
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
              </>
            )}
            
            {loginType === 'phone' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={'prefixIcon'} />,
                  }}
                  name="mobile"
                  placeholder={'手机号'}
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={'请输入验证码'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'获取验证码'}`
                    }
                    return '获取验证码'
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                  onGetCaptcha={async () => {
                    message.success('获取验证码成功！验证码为：1234')
                  }}
                />
              </>
            )}
            
            <div
              style={{
                marginBlockEnd: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </div>
          </LoginForm>
        </div>
      </ProConfigProvider>
      
      {/* 底部信息 */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <Space size={24}>
            <span>Ant Design Pro</span>
            <span>帮助</span>
            <span>隐私</span>
            <span>条款</span>
          </Space>
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          Copyright © 2019 蚂蚁金服体验技术部出品
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .prefixIcon {
          color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default Login