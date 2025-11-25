import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Row, 
  Col, 
  Card, 
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
  Select,
  message,
  Spin,
  Empty
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
  FileProtectOutlined,
  StarOutlined,
  AreaChartOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined
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
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { Title, Text } = Typography
const { Option } = Select

interface AnnouncementBanner {
  id: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  isSticky: boolean
  publishTime?: string | null
}

interface MetricsState {
  totalArticles: number
  todayPublished: number
  successRate: number
  totalViews: number
  activeWorkflows: number
}

interface ChartPoint {
  name: string
  articles: number
  views: number
}

interface PieDatum {
  name: string
  value: number
  color: string
}

interface RecentActivity {
  id: string
  title: string
  description: string
  status: 'success' | 'warning' | 'error' | 'info'
  time: string
  module: string
}

interface ApiQuota {
  id: number
  name: string
  type: string
  used: number
  amount: string
  status: string
  trend: number
}

interface SystemResources {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

interface WorkflowStatus {
  id: number
  name: string
  status: string
  nextRun?: string | null
}

interface HealthState {
  score: number
  level: string
  message: string
}

const Dashboard: React.FC = () => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<string>('7d')
  const [chartType, setChartType] = useState<string>('area')
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [announcements, setAnnouncements] = useState<AnnouncementBanner[]>([])

  const [systemStatus, setSystemStatus] = useState({
    status: 'running',
    uptime: '2天 14小时 32分钟',
    lastUpdate: '2024-01-15 14:30:00',
    version: 'v1.2.3'
  })
  const [systemBusy, setSystemBusy] = useState(false)

  const [metrics, setMetrics] = useState<MetricsState>({
    totalArticles: 0,
    todayPublished: 0,
    successRate: 0,
    totalViews: 0,
    activeWorkflows: 0
  })

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [pieData, setPieData] = useState<PieDatum[]>([])
  const [apiQuotas, setApiQuotas] = useState<ApiQuota[]>([])
  const [systemResources, setSystemResources] = useState<SystemResources>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0
  })
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus[]>([])
  const [healthState, setHealthState] = useState<HealthState>({
    score: 0,
    level: '--',
    message: '等待数据...'
  })

  const pieColors = useMemo(() => ([
    token.colorSuccess,
    token.colorPrimary,
    token.colorWarning,
    '#722ed1',
    '#13c2c2'
  ]), [token])

  const platformNameMap: Record<string, string> = {
    weixin: '微信公众号',
    wechat: '微信公众号',
    draft: '草稿',
    weibo: '微博',
    douyin: '抖音',
    bilibili: '哔哩哔哩',
    unknown: '其他'
  }

  const loadSystemStatus = async () => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/system/status`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      const data = await resp.json()
      if (resp.ok && data.code === 200 && data.data) {
        setSystemStatus(data.data)
      }
    } catch (error) {
      console.error('加载系统状态失败', error)
    }
  }

  useEffect(() => {
    loadSystemStatus()
  }, [])

  const rangeMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

  const loadDashboard = async (rangeKey: string) => {
    const days = rangeMap[rangeKey] ?? 7
    setDashboardLoading(true)
    try {
      const resp = await fetch(`${getApiBaseUrl()}/dashboard/overview?rangeDays=${days}`, {
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        throw new Error(data?.message || '获取仪表盘数据失败')
      }
      const payload = data.data
      setMetrics(payload.metrics || {
        totalArticles: 0, todayPublished: 0, successRate: 0, totalViews: 0, activeWorkflows: 0
      })
      setChartData((payload.chart?.points || []).map((point: any) => ({
        name: point.name,
        articles: point.articles ?? 0,
        views: point.views ?? 0
      })))
      const distribution = payload.platformDistribution || []
      setPieData(distribution.map((item: any, index: number) => ({
        name: platformNameMap[item.platform] || item.name || '其他',
        value: Number(item.value ?? 0),
        color: pieColors[index % pieColors.length]
      })))
      setRecentActivities((payload.recentActivities || []).map((item: any) => ({
        id: String(item.id),
        title: item.title,
        description: item.description,
        status: item.status,
        time: item.time,
        module: item.module
      })))
      setApiQuotas((payload.apiQuotas || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        used: item.used ?? 0,
        amount: item.amount ?? '-',
        status: item.status ?? 'normal',
        trend: item.trend ?? 0
      })))
      setSystemResources(payload.systemResources || { cpuUsage: 0, memoryUsage: 0, diskUsage: 0 })
      setWorkflowStatus((payload.workflowStatus || []).map((workflow: any) => ({
        id: workflow.id,
        name: workflow.name,
        status: workflow.status,
        nextRun: workflow.nextRun
      })))
      setHealthState(payload.health || { score: 0, level: '--', message: '暂无数据' })
      setAnnouncements((payload.announcements || []).map((item: any) => ({
        id: String(item.id),
        title: item.title,
        content: item.content,
        type: item.type as AnnouncementBanner['type'],
        isSticky: ['high', 'urgent'].includes(item.priority),
        publishTime: item.publishTime
      })))
    } catch (error: any) {
      console.error('加载仪表盘失败', error)
      message.error(error.message || '加载仪表盘失败')
    } finally {
      setDashboardLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard(timeRange)
  }, [])

  const handleRangeChange = (value: string) => {
    setTimeRange(value)
    loadDashboard(value)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const getActivityIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined />
      case 'warning':
        return <ExclamationCircleOutlined />
      case 'error':
        return <CloseCircleOutlined />
      default:
        return <InfoCircleOutlined />
    }
  }

  const formatActivityTime = (value: string) => {
    if (!value) return '--'
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format('HH:mm') : value
  }

  const formatNextRun = (value?: string | null) => {
    if (!value) return '未计划'
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format('MM-DD HH:mm') : value
  }

  const safeHealthScore = Math.min(Math.max(healthState.score, 0), 100)
  const healthColor = safeHealthScore >= 85
    ? token.colorSuccess
    : safeHealthScore >= 60
    ? token.colorWarning
    : token.colorError
  const healthDegree = Math.round((safeHealthScore / 100) * 360)

  const getActivityColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return token.colorSuccess
      case 'warning':
        return token.colorWarning
      case 'error':
        return token.colorError
      default:
        return token.colorPrimary
    }
  }

  const handleSystemControl = async (action: 'refresh' | 'restart') => {
    const endpoint = action === 'refresh' ? 'refresh' : 'restart'
    setSystemBusy(true)
    
    if (action === 'restart') {
      // 重启后端会导致前端也需要刷新，提示用户
      const confirmed = window.confirm(
        '⚠️  确定要重启后端服务吗？\n\n' +
        '【重要】请确保后端是以下方式之一启动的：\n' +
        '✓ 使用 start-backend-loop.bat（自动重启脚本）\n' +
        '✓ PM2 守护进程\n' +
        '✓ systemd 服务\n\n' +
        '如果是手动 deno task start 启动的：\n' +
        '❌ 点击重启后后端将退出且无法自动恢复\n' +
        '❌ 需要手动到终端重新运行 deno task start\n\n' +
        '重启后新的配置将生效。\n\n' +
        '是否继续？'
      )
      if (!confirmed) {
        setSystemBusy(false)
        return
      }
    }
    
    try {
      const resp = await fetch(`${getApiBaseUrl()}/system/${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '系统操作失败')
        return
      }
      
      if (action === 'restart') {
        message.success('后端正在重启，10 秒后自动刷新页面...', 10)
        // 10 秒后自动刷新页面（给后端足够时间重启）
        setTimeout(() => {
          window.location.reload()
        }, 10000)
      } else {
        message.success(data.message || '操作成功')
        if (data.data) {
          setSystemStatus(data.data)
        }
      }
    } catch (error) {
      console.error('系统操作失败', error)
      if (action === 'restart') {
        message.warning('后端已退出，10 秒后尝试重新连接...', 10)
        setTimeout(() => {
          window.location.reload()
        }, 10000)
      } else {
        message.error('系统操作失败')
      }
    } finally {
      if (action !== 'restart') {
        setSystemBusy(false)
      }
    }
  }

  const MetricCard = ({ title, value, prefix, suffix, trend, color, icon, description, onClick }: any) => (
    <Card 
      hoverable
      onClick={onClick}
      style={{
        borderRadius: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: token.boxShadowTertiary,
        transition: 'all 0.3s ease',
        height: '160px',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default'
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
    <Spin spinning={dashboardLoading}>
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
                loading={systemBusy}
              >
                刷新状态
              </Button>
              <Button 
                size="small" 
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleSystemControl('restart')}
                loading={systemBusy}
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
            onClick={() => handleNavigate('/content')}
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
            onClick={() => handleNavigate('/publish-history')}
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
            onClick={() => handleNavigate('/publish-history')}
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
            onClick={() => handleNavigate('/publish-history')}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* 发布趋势图表 */}
        <Col xs={24} lg={16}>
          <Card
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
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
                  onChange={handleRangeChange}
                  size="small"
                  style={{ width: 100 }}
                  loading={dashboardLoading}
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
                <Button size="small" type="link" icon={<MoreOutlined />} onClick={() => handleNavigate('/publish-history')}>
                  更多
                </Button>
              </Space>
            }
          >
            {renderChart()}
          </Card>
        </Col>

        {/* 发布平台分布 */}
        <Col xs={24} lg={8}>
          <Card
            style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 400 }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }} 
            title={
              <Flex align="center" gap={8}>
                <PieChartOutlined style={{ color: token.colorSuccess }} />
                <span>发布平台分布</span>
              </Flex>
            }
            extra={
              <Button size="small" type="link" onClick={() => handleNavigate('/publish-history')}>
                详细报告
              </Button>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            {pieData.length > 0 ? (
              <>
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
              </>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无发布数据" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} 
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
                <Button size="small" type="link" onClick={() => handleNavigate('/system-logs')}>查看全部</Button>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <List
              dataSource={recentActivities.slice(0, 5)}
              locale={{ emptyText: '暂无活动' }}
              renderItem={(item) => (
                <List.Item style={{ padding: '16px 0', border: 'none' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={getActivityIcon(item.status)} 
                        style={{ 
                          background: 'transparent',
                          border: 'none',
                          width: 32,
                          height: 32,
                          color: getActivityColor(item.status)
                        }}
                      />
                    }
                    title={
                      <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatActivityTime(item.time)}
                        </Text>
                      </Flex>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.4 }}>
                          {item.description}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue" size="small">{item.module}</Tag>
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
            style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 400 }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }} 
            title={
              <Flex align="center" gap={8}>
                <ApiOutlined style={{ color: '#722ed1' }} />
                <span>API 额度监控</span>
              </Flex>
            }
            extra={
              <Space>
                <Button size="small" icon={<SettingOutlined />} onClick={() => handleNavigate('/config')}>
                  配置
                </Button>
                <Button size="small" type="link" onClick={() => handleNavigate('/data-sources')}>管理配置</Button>
              </Space>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary
            }}
          >
            <Flex vertical gap={20}>
              {apiQuotas.slice(0, 5).map((quota, index) => {
                const quotaColor = pieColors[index % pieColors.length]
                return (
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
                    strokeColor={quotaColor}
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
              )})}
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
              boxShadow: token.boxShadowTertiary,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 400
            }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Flex vertical gap={24}>
              <div>
                <Flex justify="space-between" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14 }}>CPU 使用率</Text>
                  <Text strong style={{ fontSize: 14 }}>{systemResources.cpuUsage}%</Text>
                </Flex>
                <Progress 
                  percent={systemResources.cpuUsage} 
                  strokeColor={token.colorPrimary} 
                  trailColor={token.colorFillSecondary} 
                />
              </div>
              <div>
                <Flex justify="space-between" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14 }}>内存使用率</Text>
                  <Text strong style={{ fontSize: 14 }}>{systemResources.memoryUsage}%</Text>
                </Flex>
                <Progress 
                  percent={systemResources.memoryUsage} 
                  strokeColor={token.colorSuccess} 
                  trailColor={token.colorFillSecondary} 
                />
              </div>
              <div>
                <Flex justify="space-between" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14 }}>磁盘使用率</Text>
                  <Text strong style={{ fontSize: 14 }}>{systemResources.diskUsage}%</Text>
                </Flex>
                <Progress 
                  percent={systemResources.diskUsage} 
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
              <Button size="small" type="link" onClick={() => handleNavigate('/workflows')}>
                管理
              </Button>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 400
            }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}
          >
            {workflowStatus.length > 0 ? (
              <Flex vertical gap={16}>
                {workflowStatus.map((workflow) => (
                  <div key={workflow.id} style={{ 
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
                        下次运行: {formatNextRun(workflow.nextRun)}
                      </Text>
                    </div>
                    <Tag color={workflow.status === 'running' ? 'success' : workflow.status === 'paused' ? 'warning' : 'default'}>
                      {workflow.status === 'running' ? '运行中' : workflow.status === 'paused' ? '暂停' : '已停止'}
                    </Tag>
                  </div>
                ))}
              </Flex>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无工作流数据" />
            )}
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
              <Button size="small" type="link" onClick={() => handleNavigate('/system-logs')}>
                报告
              </Button>
            }
            style={{
              borderRadius: 12,
              border: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: token.boxShadowTertiary,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 400
            }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%',
                background: `conic-gradient(${healthColor} 0deg ${healthDegree}deg, ${token.colorFillSecondary} ${healthDegree}deg 360deg)`,
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
                  color: healthColor
                }}>
                  {safeHealthScore}%
                </div>
              </div>
              <Title level={4} style={{ 
                margin: '0 0 8px 0', 
                color: healthColor, 
                fontSize: 18 
              }}>
                {healthState.level}
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {healthState.message}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
      </div>
    </Spin>
  )
}

export default Dashboard