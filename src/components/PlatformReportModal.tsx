import React, { useState } from 'react'
import {
  Modal,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Select,
  Button,
  Space,
  Typography,
  Tag,
  Divider,
  theme,
  Flex
} from 'antd'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line
} from 'recharts'
import {
  WechatOutlined,
  GlobalOutlined,
  TrophyOutlined,
  EyeOutlined,
  UserOutlined,
  HeartOutlined,
  ShareAltOutlined,
  MessageOutlined,
  DownloadOutlined,
  PrinterOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

interface PlatformReportModalProps {
  visible: boolean
  onClose: () => void
}

const PlatformReportModal: React.FC<PlatformReportModalProps> = ({ visible, onClose }) => {
  const { token } = theme.useToken()
  const [timeRange, setTimeRange] = useState('30d')

  // 平台详细数据
  const platformData = [
    {
      platform: '微信公众号',
      icon: <WechatOutlined />,
      color: '#07c160',
      articles: 156,
      views: 45680,
      users: 1890,
      engagement: 5.2,
      growth: 12.5,
      avgReadTime: '3.2分钟',
      shareRate: 8.5,
      commentRate: 3.2
    },
    {
      platform: '其他平台',
      icon: <GlobalOutlined />,
      color: '#1677ff',
      articles: 23,
      views: 8920,
      users: 340,
      engagement: 3.8,
      growth: -2.1,
      avgReadTime: '2.1分钟',
      shareRate: 4.2,
      commentRate: 1.8
    }
  ]

  const pieData = [
    { name: '微信公众号', value: 65, color: '#07c160' },
    { name: '其他平台', value: 25, color: '#1677ff' },
    { name: '草稿箱', value: 10, color: '#faad14' }
  ]

  const monthlyData = [
    { month: '10月', weixin: 120, other: 18 },
    { month: '11月', weixin: 135, other: 21 },
    { month: '12月', weixin: 148, other: 19 },
    { month: '1月', weixin: 156, other: 23 }
  ]

  const topPerformers = [
    {
      title: 'DeepSeek-R1 登顶AI模型排行榜',
      platform: '微信公众号',
      views: 15420,
      engagement: 8.5,
      shares: 1240,
      comments: 89
    },
    {
      title: 'OpenAI发布新版本GPT模型',
      platform: '微信公众号',
      views: 12380,
      engagement: 7.2,
      shares: 980,
      comments: 67
    },
    {
      title: 'GitHub热门AI项目推荐',
      platform: '微信公众号',
      views: 9850,
      engagement: 6.8,
      shares: 750,
      comments: 45
    }
  ]

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      width: 300
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (platform: string) => (
        <Tag color={platform === '微信公众号' ? 'success' : 'blue'}>
          {platform}
        </Tag>
      )
    },
    {
      title: '阅读量',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      render: (views: number) => views.toLocaleString()
    },
    {
      title: '互动率',
      dataIndex: 'engagement',
      key: 'engagement',
      width: 100,
      render: (rate: number) => `${rate}%`
    },
    {
      title: '分享数',
      dataIndex: 'shares',
      key: 'shares',
      width: 100
    },
    {
      title: '评论数',
      dataIndex: 'comments',
      key: 'comments',
      width: 100
    }
  ]

  return (
    <Modal
      title="发布平台详细报告"
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button icon={<PrinterOutlined />}>打印报告</Button>
          <Button icon={<DownloadOutlined />} type="primary">下载PDF</Button>
        </Space>
      }
      width={1000}
      style={{ top: 20 }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Option value="7d">近7天</Option>
            <Option value="30d">近30天</Option>
            <Option value="90d">近90天</Option>
          </Select>
          <Text type="secondary">报告生成时间: {new Date().toLocaleString()}</Text>
        </Space>
      </div>

      {/* 平台概览 */}
      <Card title="平台概览" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {platformData.map((platform, index) => (
            <Col span={12} key={index}>
              <Card size="small" style={{ border: `1px solid ${platform.color}20` }}>
                <Flex align="center" gap={12} style={{ marginBottom: 16 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: `${platform.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: platform.color,
                    fontSize: 20
                  }}>
                    {platform.icon}
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{platform.platform}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      增长率: {platform.growth > 0 ? '+' : ''}{platform.growth}%
                    </Text>
                  </div>
                </Flex>

                <Row gutter={8}>
                  <Col span={12}>
                    <Statistic
                      title="发布文章"
                      value={platform.articles}
                      suffix="篇"
                      valueStyle={{ fontSize: 16, color: platform.color }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="总阅读量"
                      value={platform.views}
                      valueStyle={{ fontSize: 16, color: platform.color }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="活跃用户"
                      value={platform.users}
                      valueStyle={{ fontSize: 16, color: platform.color }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="互动率"
                      value={platform.engagement}
                      suffix="%"
                      valueStyle={{ fontSize: 16, color: platform.color }}
                    />
                  </Col>
                </Row>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Flex justify="space-between" style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 12 }}>平均阅读时长</Text>
                    <Text strong style={{ fontSize: 12 }}>{platform.avgReadTime}</Text>
                  </Flex>
                  <Flex justify="space-between" style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 12 }}>分享率</Text>
                    <Text strong style={{ fontSize: 12 }}>{platform.shareRate}%</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text style={{ fontSize: 12 }}>评论率</Text>
                    <Text strong style={{ fontSize: 12 }}>{platform.commentRate}%</Text>
                  </Flex>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 图表分析 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="平台分布" size="small">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16 }}>
              {pieData.map((item, index) => (
                <Flex key={index} justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Flex align="center" gap={8}>
                    <div style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: 2, 
                      background: item.color 
                    }} />
                    <Text style={{ fontSize: 12 }}>{item.name}</Text>
                  </Flex>
                  <Text strong style={{ fontSize: 12 }}>{item.value}%</Text>
                </Flex>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="月度趋势" size="small">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
                <XAxis dataKey="month" stroke={token.colorTextTertiary} fontSize={12} />
                <YAxis stroke={token.colorTextTertiary} fontSize={12} />
                <RechartsTooltip />
                <Bar dataKey="weixin" fill="#07c160" name="微信公众号" radius={[2, 2, 0, 0]} />
                <Bar dataKey="other" fill="#1677ff" name="其他平台" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 热门内容 */}
      <Card title="热门内容表现" size="small">
        <Table
          columns={columns}
          dataSource={topPerformers}
          rowKey="title"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 关键指标 */}
      <Card title="关键指标对比" size="small" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <EyeOutlined style={{ fontSize: 24, color: token.colorPrimary, marginBottom: 8 }} />
              <div>
                <Text strong style={{ fontSize: 18, display: 'block' }}>54.6K</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>总阅读量</Text>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <UserOutlined style={{ fontSize: 24, color: token.colorSuccess, marginBottom: 8 }} />
              <div>
                <Text strong style={{ fontSize: 18, display: 'block' }}>2.23K</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>活跃用户</Text>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <ShareAltOutlined style={{ fontSize: 24, color: token.colorWarning, marginBottom: 8 }} />
              <div>
                <Text strong style={{ fontSize: 18, display: 'block' }}>1.89K</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>总分享数</Text>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <MessageOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }} />
              <div>
                <Text strong style={{ fontSize: 18, display: 'block' }}>456</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>总评论数</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Modal>
  )
}

export default PlatformReportModal