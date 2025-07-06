import React, { useState } from 'react'
import {
  Modal,
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Tag,
  Progress,
  theme,
  Flex
} from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import {
  TrendingUpOutlined,
  TrendingDownOutlined,
  EyeOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FilterOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

interface TrendAnalysisModalProps {
  visible: boolean
  onClose: () => void
}

const TrendAnalysisModal: React.FC<TrendAnalysisModalProps> = ({ visible, onClose }) => {
  const { token } = theme.useToken()
  const [timeRange, setTimeRange] = useState('30d')
  const [platform, setPlatform] = useState('all')

  // 模拟详细数据
  const detailedData = [
    { date: '01-01', articles: 12, views: 2400, users: 89, engagement: 4.2 },
    { date: '01-02', articles: 15, views: 2800, users: 102, engagement: 4.5 },
    { date: '01-03', articles: 8, views: 1800, users: 67, engagement: 3.8 },
    { date: '01-04', articles: 18, views: 3200, users: 134, engagement: 5.1 },
    { date: '01-05', articles: 14, views: 2600, users: 98, engagement: 4.3 },
    { date: '01-06', articles: 20, views: 3800, users: 156, engagement: 5.8 },
    { date: '01-07', articles: 16, views: 3000, users: 112, engagement: 4.7 },
    { date: '01-08', articles: 22, views: 4200, users: 178, engagement: 6.2 },
    { date: '01-09', articles: 11, views: 2200, users: 78, engagement: 3.9 },
    { date: '01-10', articles: 19, views: 3600, users: 145, engagement: 5.4 },
    { date: '01-11', articles: 17, views: 3100, users: 123, engagement: 4.8 },
    { date: '01-12', articles: 25, views: 4800, users: 201, engagement: 6.8 },
    { date: '01-13', articles: 13, views: 2500, users: 91, engagement: 4.1 },
    { date: '01-14', articles: 21, views: 4000, users: 167, engagement: 5.9 },
    { date: '01-15', articles: 18, views: 3400, users: 134, engagement: 5.2 }
  ]

  const topArticles = [
    {
      title: 'DeepSeek-R1 登顶AI模型排行榜',
      views: 15420,
      engagement: 8.5,
      platform: '微信公众号',
      publishDate: '2024-01-15'
    },
    {
      title: 'OpenAI发布新版本GPT模型',
      views: 12380,
      engagement: 7.2,
      platform: '微信公众号',
      publishDate: '2024-01-14'
    },
    {
      title: 'GitHub热门AI项目推荐',
      views: 9850,
      engagement: 6.8,
      platform: '微信公众号',
      publishDate: '2024-01-13'
    },
    {
      title: 'AI模型性能对比分析',
      views: 8760,
      engagement: 6.1,
      platform: '微信公众号',
      publishDate: '2024-01-12'
    },
    {
      title: '机器学习最新进展',
      views: 7650,
      engagement: 5.9,
      platform: '微信公众号',
      publishDate: '2024-01-11'
    }
  ]

  const platformStats = [
    { platform: '微信公众号', articles: 156, views: 45680, growth: 12.5 },
    { platform: '其他平台', articles: 23, views: 8920, growth: -2.1 }
  ]

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string) => (
        <Text strong style={{ fontSize: 14 }}>{text}</Text>
      )
    },
    {
      title: '阅读量',
      dataIndex: 'views',
      key: 'views',
      width: 120,
      render: (views: number) => (
        <Flex align="center" gap={4}>
          <EyeOutlined style={{ color: token.colorTextTertiary }} />
          <Text>{views.toLocaleString()}</Text>
        </Flex>
      ),
      sorter: (a: any, b: any) => a.views - b.views
    },
    {
      title: '互动率',
      dataIndex: 'engagement',
      key: 'engagement',
      width: 100,
      render: (rate: number) => (
        <Tag color={rate > 7 ? 'success' : rate > 5 ? 'warning' : 'default'}>
          {rate}%
        </Tag>
      ),
      sorter: (a: any, b: any) => a.engagement - b.engagement
    },
    {
      title: '发布平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (platform: string) => (
        <Tag color="blue">{platform}</Tag>
      )
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 120
    }
  ]

  return (
    <Modal
      title="发布趋势分析"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
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
          <Select
            value={platform}
            onChange={setPlatform}
            style={{ width: 150 }}
          >
            <Option value="all">全部平台</Option>
            <Option value="weixin">微信公众号</Option>
            <Option value="other">其他平台</Option>
          </Select>
          <RangePicker />
          <Button icon={<FilterOutlined />}>高级筛选</Button>
          <Button icon={<DownloadOutlined />} type="primary">导出报告</Button>
        </Space>
      </div>

      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: 'overview',
            label: '总览',
            children: (
              <div>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="总发布量"
                        value={179}
                        prefix={<FileTextOutlined />}
                        suffix="篇"
                        valueStyle={{ color: token.colorPrimary }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <TrendingUpOutlined style={{ color: token.colorSuccess }} /> 较上期增长 12.5%
                        </Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="总阅读量"
                        value={54600}
                        prefix={<EyeOutlined />}
                        valueStyle={{ color: token.colorSuccess }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <TrendingUpOutlined style={{ color: token.colorSuccess }} /> 较上期增长 8.3%
                        </Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="活跃用户"
                        value={1890}
                        prefix={<UserOutlined />}
                        valueStyle={{ color: token.colorWarning }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ArrowDownOutlined style={{ color: token.colorError }} /> 较上期下降 2.1%
                        </Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="平均互动率"
                        value={5.2}
                        suffix="%"
                        valueStyle={{ color: '#722ed1' }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <TrendingUpOutlined style={{ color: token.colorSuccess }} /> 较上期增长 15.6%
                        </Text>
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Card title="趋势图表" style={{ marginBottom: 24 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={detailedData}>
                      <defs>
                        <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={token.colorPrimary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={token.colorPrimary} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={token.colorSuccess} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={token.colorSuccess} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
                      <XAxis dataKey="date" stroke={token.colorTextTertiary} fontSize={12} />
                      <YAxis stroke={token.colorTextTertiary} fontSize={12} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          borderRadius: 8, 
                          border: `1px solid ${token.colorBorderSecondary}`,
                          backgroundColor: token.colorBgElevated
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="articles" 
                        stroke={token.colorPrimary} 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorArticles)"
                        name="发布文章"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke={token.colorSuccess} 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        name="阅读量"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="平台表现" size="small">
                      {platformStats.map((item, index) => (
                        <div key={index} style={{ marginBottom: 16 }}>
                          <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                            <Text strong>{item.platform}</Text>
                            <Tag color={item.growth > 0 ? 'success' : 'error'}>
                              {item.growth > 0 ? '+' : ''}{item.growth}%
                            </Tag>
                          </Flex>
                          <div style={{ marginBottom: 4 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              文章数: {item.articles} | 阅读量: {item.views.toLocaleString()}
                            </Text>
                          </div>
                          <Progress 
                            percent={Math.round((item.views / 54600) * 100)} 
                            strokeColor={token.colorPrimary}
                            size="small"
                          />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="发布时间分布" size="small">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={detailedData.slice(-7)}>
                          <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
                          <XAxis dataKey="date" stroke={token.colorTextTertiary} fontSize={12} />
                          <YAxis stroke={token.colorTextTertiary} fontSize={12} />
                          <RechartsTooltip />
                          <Bar dataKey="articles" fill={token.colorPrimary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>
              </div>
            )
          },
          {
            key: 'articles',
            label: '热门文章',
            children: (
              <Table
                columns={columns}
                dataSource={topArticles}
                rowKey="title"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }}
              />
            )
          },
          {
            key: 'engagement',
            label: '用户互动',
            children: (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card title="互动趋势">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={detailedData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
                          <XAxis dataKey="date" stroke={token.colorTextTertiary} fontSize={12} />
                          <YAxis stroke={token.colorTextTertiary} fontSize={12} />
                          <RechartsTooltip />
                          <Line 
                            type="monotone" 
                            dataKey="engagement" 
                            stroke={token.colorWarning} 
                            strokeWidth={3}
                            dot={{ fill: token.colorWarning, strokeWidth: 2, r: 4 }}
                            name="互动率(%)"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="users" 
                            stroke={token.colorSuccess} 
                            strokeWidth={3}
                            dot={{ fill: token.colorSuccess, strokeWidth: 2, r: 4 }}
                            name="活跃用户"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>
              </div>
            )
          }
        ]}
      />
    </Modal>
  )
}

export default TrendAnalysisModal