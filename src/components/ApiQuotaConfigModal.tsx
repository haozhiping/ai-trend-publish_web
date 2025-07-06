import React, { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Progress,
  Tag,
  Alert,
  Divider,
  Select,
  Slider,
  theme,
  Flex,
  message
} from 'antd'
import {
  ApiOutlined,
  SettingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  SaveOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

interface ApiQuotaConfigModalProps {
  visible: boolean
  onClose: () => void
}

const ApiQuotaConfigModal: React.FC<ApiQuotaConfigModalProps> = ({ visible, onClose }) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // API配置数据
  const apiConfigs = [
    {
      name: 'DeepSeek API',
      key: 'deepseek',
      type: 'LLM',
      currentUsage: 75,
      totalQuota: 100,
      unit: '美元',
      resetDate: '2024-02-01',
      warningThreshold: 80,
      enabled: true,
      cost: 45.60,
      requestCount: 15420,
      avgCost: 0.003
    },
    {
      name: 'FireCrawl API',
      key: 'firecrawl',
      type: '数据抓取',
      currentUsage: 85,
      totalQuota: 100,
      unit: '次数',
      resetDate: '2024-02-01',
      warningThreshold: 80,
      enabled: true,
      cost: 0,
      requestCount: 850,
      avgCost: 0
    },
    {
      name: 'Twitter API',
      key: 'twitter',
      type: '社交媒体',
      currentUsage: 40,
      totalQuota: 100,
      unit: '次数',
      resetDate: '2024-02-01',
      warningThreshold: 70,
      enabled: true,
      cost: 0,
      requestCount: 1200,
      avgCost: 0
    },
    {
      name: '阿里云 API',
      key: 'aliyun',
      type: 'LLM',
      currentUsage: 30,
      totalQuota: 100,
      unit: '美元',
      resetDate: '2024-02-01',
      warningThreshold: 75,
      enabled: false,
      cost: 28.90,
      requestCount: 8650,
      avgCost: 0.0033
    }
  ]

  const handleSave = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      console.log('保存API配置:', values)
      
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success('API配置已保存')
      onClose()
    } catch (error) {
      console.error('保存失败:', error)
      message.error('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const getUsageColor = (usage: number, threshold: number) => {
    if (usage >= threshold) return token.colorError
    if (usage >= threshold * 0.8) return token.colorWarning
    return token.colorSuccess
  }

  const getStatusTag = (enabled: boolean, usage: number, threshold: number) => {
    if (!enabled) return <Tag color="default">已禁用</Tag>
    if (usage >= threshold) return <Tag color="error">额度不足</Tag>
    if (usage >= threshold * 0.8) return <Tag color="warning">即将耗尽</Tag>
    return <Tag color="success">正常</Tag>
  }

  return (
    <Modal
      title={
        <Flex align="center" gap={8}>
          <ApiOutlined />
          <span>API 额度配置</span>
        </Flex>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSave} loading={loading} icon={<SaveOutlined />}>
            保存配置
          </Button>
        </Space>
      }
      width={1000}
      style={{ top: 20 }}
    >
      <Alert
        message="API 额度管理"
        description="合理配置API使用限制，避免超出预算。系统会在达到警告阈值时自动发送通知。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* API 概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {apiConfigs.map((api, index) => (
          <Col span={12} key={index}>
            <Card size="small" style={{ height: '100%' }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
                <div>
                  <Title level={5} style={{ margin: 0 }}>{api.name}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>{api.type}</Text>
                </div>
                {getStatusTag(api.enabled, api.currentUsage, api.warningThreshold)}
              </Flex>

              <div style={{ marginBottom: 12 }}>
                <Flex justify="space-between" style={{ marginBottom: 4 }}>
                  <Text style={{ fontSize: 12 }}>使用量</Text>
                  <Text strong style={{ fontSize: 12 }}>
                    {api.currentUsage}% ({api.currentUsage}/{api.totalQuota} {api.unit})
                  </Text>
                </Flex>
                <Progress 
                  percent={api.currentUsage} 
                  strokeColor={getUsageColor(api.currentUsage, api.warningThreshold)}
                  size="small"
                />
              </div>

              <Row gutter={8}>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: 8, background: token.colorFillAlter, borderRadius: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', display: 'block' }}>
                      {api.cost > 0 ? `$${api.cost}` : api.requestCount}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {api.cost > 0 ? '本月费用' : '请求次数'}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center', padding: 8, background: token.colorFillAlter, borderRadius: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', display: 'block' }}>
                      {api.resetDate.split('-')[2]}日
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>重置日期</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* 配置表单 */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          globalWarningThreshold: 80,
          autoDisableOnLimit: true,
          notificationEmail: 'admin@example.com',
          checkInterval: 60,
          enableCostAlert: true,
          monthlyCostLimit: 200
        }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          <SettingOutlined /> 全局设置
        </Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="globalWarningThreshold"
              label="全局警告阈值"
              tooltip="当API使用量达到此百分比时发送警告"
            >
              <Slider
                min={50}
                max={95}
                marks={{
                  50: '50%',
                  70: '70%',
                  80: '80%',
                  90: '90%',
                  95: '95%'
                }}
                tooltip={{ formatter: (value) => `${value}%` }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="checkInterval"
              label="检查间隔（分钟）"
              tooltip="系统检查API使用量的频率"
            >
              <InputNumber
                min={5}
                max={1440}
                style={{ width: '100%' }}
                addonAfter="分钟"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="notificationEmail"
              label="通知邮箱"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="接收警告通知的邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="monthlyCostLimit"
              label="月度费用限制"
              tooltip="每月API费用上限（美元）"
            >
              <InputNumber
                min={0}
                max={10000}
                style={{ width: '100%' }}
                addonBefore={<DollarOutlined />}
                addonAfter="USD"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="autoDisableOnLimit"
              label="达到限制时自动禁用"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="enableCostAlert"
              label="启用费用警告"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="enableSlackNotification"
              label="Slack通知"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={4} style={{ marginBottom: 16 }}>
          <DollarOutlined /> 费用管理
        </Title>

        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Flex vertical align="center">
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: token.colorPrimary }}>
                  $74.50
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>本月总费用</Text>
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Flex vertical align="center">
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: token.colorSuccess }}>
                  $125.50
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>剩余预算</Text>
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Flex vertical align="center">
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: token.colorWarning }}>
                  37%
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>预算使用率</Text>
              </Flex>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Title level={4} style={{ marginBottom: 16 }}>
          <ClockCircleOutlined /> 使用统计
        </Title>

        <div style={{ 
          background: token.colorFillAlter, 
          padding: 16, 
          borderRadius: 8,
          fontSize: 12
        }}>
          <Row gutter={16}>
            <Col span={6}>
              <Text type="secondary">今日请求:</Text>
              <Text strong style={{ marginLeft: 8 }}>1,247</Text>
            </Col>
            <Col span={6}>
              <Text type="secondary">本周请求:</Text>
              <Text strong style={{ marginLeft: 8 }}>8,965</Text>
            </Col>
            <Col span={6}>
              <Text type="secondary">平均响应时间:</Text>
              <Text strong style={{ marginLeft: 8 }}>1.2s</Text>
            </Col>
            <Col span={6}>
              <Text type="secondary">成功率:</Text>
              <Text strong style={{ marginLeft: 8, color: token.colorSuccess }}>99.2%</Text>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  )
}

export default ApiQuotaConfigModal