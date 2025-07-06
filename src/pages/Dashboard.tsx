import React, { useState } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Progress, 
  Alert, 
  Button, 
  Space,
  Tag,
  Avatar,
  List,
  Typography,
  Tooltip,
  Flex,
  theme,
  Segmented,
  DatePicker,
  Select
} from 'antd'
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  PlayCircleOutlined,
  ReloadOutlined,
  TrophyOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  FileOutlined,
  BarChartOutlined,
  PieChartOutlined,
  ApiOutlined,
  MonitorOutlined,
  SettingOutlined,
  EyeOutlined,
  LineChartOutlined,
  CalendarOutlined,
  FilterOutlined,
  MoreOutlined,
  AreaChartOutlined
} from '@ant-design/icons'
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
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

const Dashboard: React.FC = () => {
  const { token } = theme.useToken()
  const [timeRange, setTimeRange] = useState<string>('7d')
  const [chartType, setChartType] = useState<string>('area')
  
  // 公告数据
  const [announcements] = useState([
    {
      id: '1',
      title: '系统维护通知',
      content: '系统将于今晚23:00-01:00进行维护升级，期间可能影响正常使用，请提前做好准备。',
      type: 'warning',
      isSticky: true,
      publishTime: '2024-01-15 10:00:00'
    },
    {
      id: '2',
      title: '新功能上线公告',
      content: 'AI内容排序功能已正式上线，支持更智能的内容筛选和排序，欢迎体验使用。',
      type: 'success',
      isSticky: false,
      publishTime: '2024-01-14 09:00:00'
    }
  ])

  const [systemStatus] = useState({
    status: 'running',
    uptime: '2天 14小时 32分钟',
    lastUpdate: '2024-01-15 14:30:00',
    version: 'v1.2.3'
  })

  const [metrics] = useState({
    totalArticles: 1247,
    todayPublished: 12,
    successRate: 98.5,
    activeWorkflows: 3,
    totalViews: 45678,
    avgResponseTime: 1.2
  })

  const [recentActivities] = useState([
    {
      id: 1,
      time: '14:30',
      title: '微信文章工作流执行完成',
      description: '成功发布 8 篇文章到微信公众号',
      status: 'success',
      icon: <CheckCircleOutlined />,
      user: 'System'
    },
    {
      id: 2,
      time: '12:15',
      title: 'AI模型排行榜更新',
      description: 'DeepSeek-R1 登顶本周排行榜',
      status: 'info',
      icon: <TrophyOutlined />,
      user: 'AI Engine'
    },
    {
      id: 3,
      time: '10:45',
      title: 'GitHub热门项目抓取',
      description: '发现 15 个新的AI相关热门项目',
      status: 'success',
      icon: <RocketOutlined />,
      user: 'Crawler'
    },
    {
      id: 4,
      time: '09:20',
      title: 'FireCrawl API额度警告',
      description: '当前额度剩余不足20%，建议及时充值',
      status: 'warning',
      icon: <ExclamationCircleOutlined />,
      user: 'Monitor'
    }
  ])

  const [chartData] = useState([
    { name: '周一', articles: 8, success: 8, views: 1200, users: 45 },
    { name: '周二', articles: 12, success: 11, views: 1800, users: 67 },
    { name: '周三', articles: 15, success: 14, views: 2200, users: 89 },
    { name: '周四', articles: 10, success: 10, views: 1500, users: 56 },
    { name: '周五', articles: 18, success: 17, views: 2800, users: 123 },
    { name: '周六', articles: 14, success: 13, views: 2100, users: 78 },
    { name: '周日', articles: 16, success: 16, views: 2400, users: 92 }
  ])

  const [pieData] = useState([
    { name: '微信公众号', value: 65, color: token.colorSuccess },
    { name: '其他平台', value: 25, color: token.colorPrimary },
    { name: '草稿箱', value: 10, color: token.colorWarning }
  ])

  const [apiQuotas] = useState([
    { name: 'DeepSeek API', used: 75, total: 100, color: token.colorSuccess, amount: '¥45.60', trend: -5 },
    { name: 'FireCrawl API', used: 85, total: 100, color: token.colorWarning, amount: '150 次', trend: 12 },
    { name: 'Twitter API', used: 40, total: 100, color: token.colorPrimary, amount: '3000 次', trend: -2 },
    { name: '阿里云 API', used: 30, total: 100, color: '#722ed1', amount: '¥28.90', trend: 8 }
  ])

  const handleSystemControl = (action: string) => {
    console.log(`执行系统操作: ${action}`)
  }

  const MetricCard = ({ title, value, prefix, suffix, trend, color, icon, description }: any) => (
    <Card 
      hoverable
      style={{
        borderRadius: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: token.boxShadowTertiary,
        transition: 'all 0.3s ease',
        height: '160px', // 固定高度确保统一
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{ 
        padding: 24, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* 右上角图标 */}
        <div style={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          fontSize: 24, 
          color: color,
          background: `${color}15`,
          padding: 12,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48
        }}>
          {icon}
        </div>
        
        {/* 主要内容区域 */}
        <Flex vertical gap={8} style={{ flex: 1, paddingRight: 60 }}>
          <Text type="secondary" style={{ fontSize: 14, fontWeight: 500 }}>
            {title}
          </Text>
          <div>
            <Text style={{ 
              fontSize: title === '成功率' || title === '总阅读量' ? 24 : 28, 
              fontWeight: 700, 
              color,
              lineHeight: 1,
              fontFamily: 'tabular-nums',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {prefix}{value}{suffix}
            </Text>
          </div>
        </Flex>
        
        {/* 底部区域：描述文字和趋势标签 */}
        <div style={{ 
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 8,
          paddingRight: 60
        }}>
          {description && (
            <Text type="secondary" style={{ 
              fontSize: 12,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}>
              {description}
            </Text>
          )}
        </div>
        
        {/* 趋势标签 - 与右上角图标对齐 */}
        {trend && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Tag 
              color={trend > 0 ? 'success' : 'error'} 
              style={{ 
                margin: 0, 
                fontSize: 11, 
                fontWeight: 500,
                padding: '2px 6px',
                lineHeight: 1.2
              }}
              icon={trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            >
              {Math.abs(trend)}%
            </Tag>
          </div>
        )}
      </div>
    </Card>
  )

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: 320,
      data: chartData
    }

    if (chartType === 'area') {
      return (
        <ResponsiveContainer {...commonProps}>
          <AreaChart data={chartData}>
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
            <XAxis 
              dataKey="name" 
              stroke={token.colorTextTertiary} 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke={token.colorTextTertiary} 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip 
              contentStyle={{ 
                borderRadius: 8, 
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: token.boxShadow,
                fontSize: 12,
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
      )
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer {...commonProps}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
            <XAxis 
              dataKey="name" 
              stroke={token.colorTextTertiary} 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke={token.colorTextTertiary} 
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip 
              contentStyle={{ 
                borderRadius: 8, 
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: token.boxShadow,
                fontSize: 12,
                backgroundColor: token.colorBgElevated
              }}
            />
            <Line 
              type="monotone" 
              dataKey="articles" 
              stroke={token.colorPrimary} 
              strokeWidth={3}
              dot={{ fill: token.colorPrimary, strokeWidth: 2, r: 4 }}
              name="发布文章"
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke={token.colorSuccess} 
              strokeWidth={3}
              dot={{ fill: token.colorSuccess, strokeWidth: 2, r: 4 }}
              name="阅读量"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    return (
      <ResponsiveContainer {...commonProps}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
          <XAxis 
            dataKey="name" 
            stroke={token.colorTextTertiary} 
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke={token.colorTextTertiary} 
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip 
            contentStyle={{ 
              borderRadius: 8, 
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadow,
              fontSize: 12,
              backgroundColor: token.colorBgElevated
            }}
          />
          <Bar 
            dataKey="articles" 
            fill={token.colorPrimary}
            radius={[4, 4, 0, 0]}
            name="发布文章"
          />
          <Bar 
            dataKey="views" 
            fill={token.colorSuccess}
            radius={[4, 4, 0, 0]}
            name="阅读量"
          />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
      {/* 公告横幅 */}
      {announcements.filter(a => a.isSticky).map(announcement => (
        <Alert
          key={announcement.id}
          message={announcement.title}
          description={announcement.content}
          type={announcement.type as any}
          showIcon
          closable
          style={{ 
            marginBottom: 16,
            borderRadius: 8
          }}
          action={
            <Button size="small" type="link" onClick={() => navigate('/announcements')}>
              查看更多
            </Button>
          }
        />
      ))}

      {/* 系统状态横幅 */}
      <Alert
        message={
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={16}>
              <Flex align="center" gap={8}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: token.colorSuccess,
                  animation: 'pulse 2s infinite'
                }} />
                <Text strong style={{ color: token.colorSuccess }}>系统运行正常</Text>
              </Flex>
              <Text type="secondary">运行时间: {systemStatus.uptime}</Text>
              <Text type="secondary">版本: {systemStatus.version}</Text>
              <Text type="secondary">最后更新: {systemStatus.lastUpdate}</Text>
            </Flex>
            <Space>
              <Button 
                size="small" 
                icon={<ReloadOutlined />}
                onClick={() => handleSystemControl('refresh')}
              >
                刷新状态
              </Button>
              <Button 
                size="small" 
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleSystemControl('restart')}
              >
                重启系统
              </Button>
            </Space>
          </Flex>
        }
        type="success"
        style={{ 
          marginBottom: 24,
          borderRadius: 8
        }}
      />

      {/* 核心指标卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="总发布文章"
            value={metrics.totalArticles.toLocaleString()}
            trend={12}
            color={token.colorPrimary}
            icon={<FileOutlined />}
            description="累计发布文章数量"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="今日发布"
            value={metrics.todayPublished}
            trend={8}
            color={token.colorSuccess}
            icon={<ThunderboltOutlined />}
            description="今日新增发布"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="成功率"
            value={metrics.successRate}
            suffix="%"
            trend={2.1}
            color="#722ed1"
            icon={<TrophyOutlined />}
            description="发布成功率"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="总阅读量"
            value={(metrics.totalViews / 1000).toFixed(1)}
            suffix="K"
            trend={15}
            color={token.colorWarning}
            icon={<EyeOutlined />}
            description="累计阅读量"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* 发布趋势图表 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Flex align="center" gap={8}>
                <LineChartOutlined style={{ color: token.colorPrimary }} />
                <span>发布趋势分析</span>
              </Flex>
            }
            extra={
              <Space>
                <Select
                  value={timeRange}
                  onChange={setTimeRange}
                  size="small"
                  style={{ width: 100 }}
                >
                  <Option value="7d">近7天</Option>
                  <Option value="30d">近30天</Option>
                  <Option value="90d">近90天</Option>
                </Select>
                <Segmented
                  value={chartType}
                  onChange={setChartType}
                  options={[
                    { label: '面积图', value: 'area', icon: <AreaChartOutlined /> },
                    { label: '折线图', value: 'line', icon: <LineChartOutlined /> },
                    { label: '柱状图', value: 'bar', icon: <BarChartOutlined /> }
                  ]}
                  size="small"
                />
                <Button size="small" type="link" icon={<MoreOutlined />}>
                  更多
                </Button>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            {renderChart()}
          </Card>
        </Col>

        {/* 发布平台分布 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Flex align="center" gap={8}>
                <PieChartOutlined style={{ color: token.colorSuccess }} />
                <span>发布平台分布</span>
              </Flex>
            }
            extra={
              <Button size="small" type="link">
                详细报告
              </Button>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: token.colorBgElevated,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: 8
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 20 }}>
              {pieData.map((item, index) => (
                <Flex key={index} justify="space-between" align="center" style={{ marginBottom: 12 }}>
                  <Flex align="center" gap={8}>
                    <div style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: 2, 
                      background: item.color 
                    }} />
                    <Text style={{ fontSize: 14 }}>{item.name}</Text>
                  </Flex>
                  <Text strong style={{ fontSize: 14 }}>{item.value}%</Text>
                </Flex>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Flex align="center" gap={8}>
                <ClockCircleOutlined style={{ color: token.colorWarning }} />
                <span>最近活动</span>
              </Flex>
            }
            extra={
              <Space>
                <Button size="small" icon={<FilterOutlined />}>
                  筛选
                </Button>
                <Button size="small" type="link">查看全部</Button>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '16px 0', border: 'none' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={item.icon} 
                        style={{ 
                          background: 'transparent',
                          border: 'none',
                          width: 32,
                          height: 32,
                          color: item.status === 'success' ? token.colorSuccess :
                                item.status === 'warning' ? token.colorWarning :
                                item.status === 'error' ? token.colorError : token.colorPrimary
                        }}
                      />
                    }
                    title={
                      <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                      </Flex>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.4 }}>
                          {item.description}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue" size="small">{item.user}</Tag>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* API 额度监控 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Flex align="center" gap={8}>
                <ApiOutlined style={{ color: '#722ed1' }} />
                <span>API 额度监控</span>
              </Flex>
            }
            extra={
              <Space>
                <Button size="small" icon={<SettingOutlined />}>
                  配置
                </Button>
                <Button size="small" type="link">管理配置</Button>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <Flex vertical gap={20}>
              {apiQuotas.map((quota, index) => (
                <div key={index}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                    <Flex align="center" gap={8}>
                      <Text strong style={{ fontSize: 14 }}>{quota.name}</Text>
                      {quota.trend && (
                        <Tag 
                          color={quota.trend > 0 ? 'error' : 'success'} 
                          size="small"
                          icon={quota.trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        >
                          {Math.abs(quota.trend)}%
                        </Tag>
                      )}
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 12 }}>剩余: {quota.amount}</Text>
                  </Flex>
                  <Progress 
                    percent={quota.used} 
                    strokeColor={quota.color}
                    trailColor={token.colorFillSecondary}
                    strokeWidth={8}
                    style={{ marginBottom: 4 }}
                  />
                  <Flex justify="space-between">
                    <Text type="secondary" style={{ fontSize: 12 }}>已使用 {quota.used}%</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {quota.used >= 80 ? '⚠️ 额度不足' : '✅ 正常'}
                    </Text>
                  </Flex>
                </div>
              ))}
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* 系统资源监控 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Flex align="center" gap={8}>
                <MonitorOutlined style={{ color: token.colorPrimary }} />
                <span>系统资源</span>
              </Flex>
            }
            extra={
              <Button size="small" type="link" icon={<MoreOutlined />}>
                详情
              </Button>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <Flex vertical gap={24}>
              <div>
                <Flex justify="space-between" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14 }}>CPU 使用率</Text>
                  <Text strong style={{ fontSize: 14 }}>45%</Text>
                </Flex>
                <Progress 
                  percent={45} 
                  strokeColor={token.colorPrimary} 
                  trailColor={token.colorFillSecondary} 
                />
              </div>
              <div>
                <Flex justify="space-between" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14 }}>内存使用率</Text>
                  <Text strong style={{ fontSize: 14 }}>68%</Text>
                </Flex>
                <Progress 
                  percent={68} 
                  strokeColor={token.colorSuccess} 
                  trailColor={token.colorFillSecondary} 
                />
              </div>
              <div>
                <Flex justify="space-between" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14 }}>磁盘使用率</Text>
                  <Text strong style={{ fontSize: 14 }}>32%</Text>
                </Flex>
                <Progress 
                  percent={32} 
                  strokeColor={token.colorWarning} 
                  trailColor={token.colorFillSecondary} 
                />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <Flex align="center" gap={8}>
                <SettingOutlined style={{ color: token.colorSuccess }} />
                <span>工作流状态</span>
              </Flex>
            }
            extra={
              <Button size="small" type="link">
                管理
              </Button>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <Flex vertical gap={16}>
              {[
                { name: '微信文章工作流', status: 'running', nextRun: '明天 03:00' },
                { name: 'AI排行榜工作流', status: 'running', nextRun: '周二 03:00' },
                { name: 'GitHub项目工作流', status: 'stopped', nextRun: '已暂停' }
              ].map((workflow, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: 16,
                  background: token.colorFillAlter,
                  borderRadius: 8,
                  border: `1px solid ${token.colorBorderSecondary}`
                }}>
                  <div>
                    <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                      {workflow.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      下次运行: {workflow.nextRun}
                    </Text>
                  </div>
                  <Tag color={workflow.status === 'running' ? 'success' : 'default'}>
                    {workflow.status === 'running' ? '运行中' : '已停止'}
                  </Tag>
                </div>
              ))}
            </Flex>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <Flex align="center" gap={8}>
                <HeartOutlined style={{ color: token.colorError }} />
                <span>系统健康度</span>
              </Flex>
            }
            extra={
              <Button size="small" type="link">
                报告
              </Button>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%',
                background: `conic-gradient(${token.colorSuccess} 0deg 324deg, ${token.colorFillSecondary} 324deg 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                position: 'relative'
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: token.colorBgContainer,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: token.colorSuccess
                }}>
                  90%
                </div>
              </div>
              <Title level={4} style={{ 
                margin: '0 0 8px 0', 
                color: token.colorSuccess, 
                fontSize: 18 
              }}>
                优秀
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                系统运行状态良好
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard