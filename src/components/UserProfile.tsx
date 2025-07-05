import React, { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Tabs,
  Card,
  List,
  Tag,
  Space,
  Typography,
  Divider,
  Switch,
  Select,
  theme,
  Flex
} from 'antd'
import {
  UserOutlined,
  CameraOutlined,
  LockOutlined,
  BellOutlined,
  GlobalOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'

const { Text, Title } = Typography
const { TabPane } = Tabs
const { Option } = Select

interface UserProfileProps {
  visible: boolean
  onClose: () => void
  userInfo: any
  onUpdateUser: (userInfo: any) => void
}

const UserProfile: React.FC<UserProfileProps> = ({
  visible,
  onClose,
  userInfo,
  onUpdateUser
}) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const [loginHistory] = useState([
    {
      id: 1,
      time: '2024-01-15 14:30:25',
      ip: '192.168.1.100',
      location: '北京市',
      device: 'Chrome 120.0 / Windows 10',
      status: 'success'
    },
    {
      id: 2,
      time: '2024-01-15 09:15:10',
      ip: '192.168.1.100',
      location: '北京市',
      device: 'Chrome 120.0 / Windows 10',
      status: 'success'
    },
    {
      id: 3,
      time: '2024-01-14 18:45:33',
      ip: '192.168.1.100',
      location: '北京市',
      device: 'Chrome 120.0 / Windows 10',
      status: 'success'
    }
  ])

  const handleUpdateProfile = async (values: any) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const updatedUser = { ...userInfo, ...values }
      onUpdateUser(updatedUser)
      message.success('个人信息更新成功')
    } catch (error) {
      message.error('更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values: any) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('密码修改成功')
      passwordForm.resetFields()
    } catch (error) {
      message.error('密码修改失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功')
    } else if (info.file.status === 'error') {
      message.error('头像上传失败')
    }
  }

  return (
    <Modal
      title="个人设置"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Tabs defaultActiveKey="profile" size="large">
        <TabPane tab="基本信息" key="profile">
          <Card bordered={false}>
            <Flex gap={24}>
              {/* 头像上传 */}
              <div style={{ textAlign: 'center' }}>
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="/api/upload/avatar"
                  onChange={handleAvatarChange}
                >
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    src={userInfo?.avatar}
                    style={{
                      background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: token.colorPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: `2px solid ${token.colorBgContainer}`
                  }}>
                    <CameraOutlined style={{ color: '#ffffff', fontSize: 14 }} />
                  </div>
                </Upload>
                <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                  点击更换头像
                </Text>
              </div>

              {/* 基本信息表单 */}
              <div style={{ flex: 1 }}>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={userInfo}
                  onFinish={handleUpdateProfile}
                >
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input placeholder="请输入姓名" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="手机号"
                  >
                    <Input placeholder="请输入手机号" />
                  </Form.Item>

                  <Form.Item
                    name="department"
                    label="部门"
                  >
                    <Select placeholder="请选择部门">
                      <Option value="tech">技术部</Option>
                      <Option value="product">产品部</Option>
                      <Option value="operation">运营部</Option>
                      <Option value="admin">管理部</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{ borderRadius: 6 }}
                    >
                      保存更改
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Flex>
          </Card>
        </TabPane>

        <TabPane tab="安全设置" key="security">
          <Card bordered={false}>
            <Title level={5} style={{ marginBottom: 16 }}>
              <LockOutlined /> 修改密码
            </Title>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              style={{ maxWidth: 400 }}
            >
              <Form.Item
                name="currentPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password
                  placeholder="请输入当前密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度至少6位' }
                ]}
              >
                <Input.Password
                  placeholder="请输入新密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'))
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="请确认新密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ borderRadius: 6 }}
                >
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="通知设置" key="notifications">
          <Card bordered={false}>
            <Title level={5} style={{ marginBottom: 16 }}>
              <BellOutlined /> 通知偏好
            </Title>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Flex justify="space-between" align="center">
                <div>
                  <Text strong>邮件通知</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    接收系统重要通知邮件
                  </Text>
                </div>
                <Switch defaultChecked />
              </Flex>

              <Divider style={{ margin: 0 }} />

              <Flex justify="space-between" align="center">
                <div>
                  <Text strong>工作流通知</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    工作流执行状态变更通知
                  </Text>
                </div>
                <Switch defaultChecked />
              </Flex>

              <Divider style={{ margin: 0 }} />

              <Flex justify="space-between" align="center">
                <div>
                  <Text strong>系统维护通知</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    系统维护和更新通知
                  </Text>
                </div>
                <Switch />
              </Flex>

              <Divider style={{ margin: 0 }} />

              <Flex justify="space-between" align="center">
                <div>
                  <Text strong>API 额度警告</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    API 使用量达到阈值时通知
                  </Text>
                </div>
                <Switch defaultChecked />
              </Flex>
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="登录记录" key="loginHistory">
          <Card bordered={false}>
            <Title level={5} style={{ marginBottom: 16 }}>
              <GlobalOutlined /> 最近登录记录
            </Title>
            <List
              dataSource={loginHistory}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={item.status === 'success' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                        style={{
                          background: item.status === 'success' ? token.colorSuccess : token.colorWarning
                        }}
                      />
                    }
                    title={
                      <Flex justify="space-between" align="center">
                        <Text strong>{item.time}</Text>
                        <Tag color={item.status === 'success' ? 'success' : 'warning'}>
                          {item.status === 'success' ? '成功' : '失败'}
                        </Tag>
                      </Flex>
                    }
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          IP: {item.ip} · {item.location}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          设备: {item.device}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default UserProfile