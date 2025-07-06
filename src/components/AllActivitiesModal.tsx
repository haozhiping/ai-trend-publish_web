import React, { useState } from 'react'
import {
  Modal,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Typography,
  Avatar,
  Tooltip,
  Flex,
  theme
} from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  RocketOutlined,
  BugOutlined,
  SettingOutlined,
  ApiOutlined,
  UserOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Search } = Input
const { RangePicker } = DatePicker
const { Option } = Select
const { Text } = Typography

interface AllActivitiesModalProps {
  visible: boolean
  onClose: () => void
}

const AllActivitiesModal: React.FC<AllActivitiesModalProps> = ({ visible, onClose }) => {
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')

  // 扩展的活动数据
  const allActivities = [
    {
      id: '1',
      time: '14:30:25',
      title: '微信文章工作流执行完成',
      description: '成功发布 8 篇文章到微信公众号',
      status: 'success',
      icon: <CheckCircleOutlined />,
      user: 'System',
      module: 'WeixinWorkflow',
      duration: '2.5分钟',
      details: '处理了15条原始内容，筛选出8篇高质量文章'
    },
    {
      id: '2',
      time: '14:25:10',
      title: 'AI内容排序完成',
      description: '使用DeepSeek模型对内容进行智能排序',
      status: 'success',
      icon: <TrophyOutlined />,
      user: 'AI Engine',
      module: 'ContentRanker',
      duration: '45秒',
      details: '分析了15篇文章，按质量和热度排序'
    },
    {
      id: '3',
      time: '14:20:30',
      title: 'FireCrawl数据抓取',
      description: '从Hacker News抓取最新技术资讯',
      status: 'success',
      icon: <RocketOutlined />,
      user: 'Crawler',
      module: 'FireCrawlScraper',
      duration: '1.2分钟',
      details: '成功抓取25条新闻，过滤重复内容3条'
    },
    {
      id: '4',
      time: '14:15:45',
      title: 'Twitter API调用',
      description: '获取OpenAI官方账号最新动态',
      status: 'success',
      icon: <ApiOutlined />,
      user: 'System',
      module: 'TwitterScraper',
      duration: '30秒',
      details: '获取到12条推文，筛选出5条相关内容'
    },
    {
      id: '5',
      time: '12:15:30',
      title: 'FireCrawl API额度警告',
      description: '当前额度剩余不足20%，建议及时充值',
      status: 'warning',
      icon: <ExclamationCircleOutlined />,
      user: 'Monitor',
      module: 'APIMonitor',
      duration: '-',
      details: '剩余调用次数：150/1000'
    },
    {
      id: '6',
      time: '11:45:20',
      title: '系统配置更新',
      description: '更新了LLM提供者配置',
      status: 'info',
      icon: <SettingOutlined />,
      user: 'Admin',
      module: 'ConfigManager',
      duration: '10秒',
      details: '切换默认LLM从OpenAI到DeepSeek'
    },
    {
      id: '7',
      time: '10:30:15',
      title: 'Twitter API调用失败',
      description: 'API速率限制，将在15分钟后重试',
      status: 'error',
      icon: <CloseCircleOutlined />,
      user: 'System',
      module: 'TwitterScraper',
      duration: '-',
      details: 'HTTP 429: Rate limit exceeded'
    },
    {
      id: '8',
      time: '09:20:00',
      title: '定时任务启动',
      description: '启动每日内容抓取任务',
      status: 'info',
      icon: <ClockCircleOutlined />,
      user: 'Scheduler',
      module: 'TaskScheduler',
      duration: '5秒',
      details: '已注册3个定时任务'
    },
    {
      id: '9',
      time: '08:00:00',
      title: '系统启动完成',
      description: '所有模块初始化成功',
      status: 'success',
      icon: <CheckCircleOutlined />,
      user: 'System',
      module: 'Bootstrap',
      duration: '30秒',
      details: '加载了8个核心模块'
    },
    {
      id: '10',
      time: '07:55:30',
      title: '数据库连接检查',
      description: '验证数据库连接状态',
      status: 'success',
      icon: <CheckCircleOutlined />,
      user: 'System',
      module: 'DatabaseManager',
      duration: '2秒',
      details: '连接池状态正常，活跃连接：5/20'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      success: token.colorSuccess,
      warning: token.colorWarning,
      error: token.colorError,
      info: token.colorPrimary
    }
    return colors[status as keyof typeof colors] || token.colorTextTertiary
  }

  const getStatusTag = (status: string) => {
    const configs = {
      success: { color: 'success', text: '成功' },
      warning: { color: 'warning', text: '警告' },
      error: { color: 'error', text: '失败' },
      info: { color: 'processing', text: '信息' }
    }
    const config = configs[status as keyof typeof configs]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getModuleTag = (module: string) => {
    const moduleColors = {
      WeixinWorkflow: 'green',
      ContentRanker: 'blue',
      FireCrawlScraper: 'orange',
      TwitterScraper: 'cyan',
      APIMonitor: 'purple',
      ConfigManager: 'geekblue',
      TaskScheduler: 'lime',
      Bootstrap: 'gold',
      DatabaseManager: 'volcano'
    }
    return (
      <Tag color={moduleColors[module as keyof typeof moduleColors] || 'default'}>
        {module}
      </Tag>
    )
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (time: string) => (
        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {time}
        </Text>
      )
    },
    {
      title: '活动',
      key: 'activity',
      width: 400,
      render: (_, record: any) => (
        <div>
          <Flex align="center" gap={8} style={{ marginBottom: 4 }}>
            <Avatar 
              size={24}
              icon={record.icon} 
              style={{ 
                background: 'transparent',
                color: getStatusColor(record.status),
                border: 'none'
              }}
            />
            <Text strong style={{ fontSize: 14 }}>{record.title}</Text>
          </Flex>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            {record.description}
          </Text>
          {record.details && (
            <Text type="secondary" style={{ fontSize: 11, fontStyle: 'italic' }}>
              {record.details}
            </Text>
          )}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '成功', value: 'success' },
        { text: '警告', value: 'warning' },
        { text: '失败', value: 'error' },
        { text: '信息', value: 'info' }
      ],
      onFilter: (value: any, record: any) => record.status === value
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module: string) => getModuleTag(module),
      filters: [
        { text: '微信工作流', value: 'WeixinWorkflow' },
        { text: '内容排序', value: 'ContentRanker' },
        { text: 'FireCrawl', value: 'FireCrawlScraper' },
        { text: 'Twitter', value: 'TwitterScraper' },
        { text: 'API监控', value: 'APIMonitor' },
        { text: '配置管理', value: 'ConfigManager' }
      ],
      onFilter: (value: any, record: any) => record.module === value
    },
    {
      title: '执行者',
      dataIndex: 'user',
      key: 'user',
      width: 100,
      render: (user: string) => (
        <Flex align="center" gap={4}>
          <UserOutlined style={{ fontSize: 12, color: token.colorTextTertiary }} />
          <Text style={{ fontSize: 12 }}>{user}</Text>
        </Flex>
      )
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: string) => (
        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {duration}
        </Text>
      )
    }
  ]

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    // 导出逻辑
    console.log('导出活动记录')
  }

  return (
    <Modal
      title="全部活动记录"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      style={{ top: 20 }}
    >
      {/* 筛选工具栏 */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="搜索活动内容"
            style={{ width: 250 }}
            onSearch={setSearchText}
            allowClear
          />
          <Select
            placeholder="状态筛选"
            style={{ width: 120 }}
            allowClear
            onChange={setStatusFilter}
          >
            <Option value="success">成功</Option>
            <Option value="warning">警告</Option>
            <Option value="error">失败</Option>
            <Option value="info">信息</Option>
          </Select>
          <Select
            placeholder="模块筛选"
            style={{ width: 150 }}
            allowClear
            onChange={setModuleFilter}
          >
            <Option value="WeixinWorkflow">微信工作流</Option>
            <Option value="ContentRanker">内容排序</Option>
            <Option value="FireCrawlScraper">FireCrawl</Option>
            <Option value="TwitterScraper">Twitter</Option>
            <Option value="APIMonitor">API监控</Option>
            <Option value="ConfigManager">配置管理</Option>
          </Select>
          <RangePicker 
            showTime 
            placeholder={['开始时间', '结束时间']}
            style={{ width: 300 }}
          />
          <Button icon={<FilterOutlined />}>
            高级筛选
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            刷新
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Space>
      </div>

      {/* 活动表格 */}
      <Table
        columns={columns}
        dataSource={allActivities}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{
          total: allActivities.length,
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
        }}
        scroll={{ y: 400 }}
      />

      {/* 统计信息 */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: token.colorFillAlter, 
        borderRadius: 6,
        fontSize: 12,
        color: token.colorTextSecondary
      }}>
        <Flex justify="space-between">
          <span>
            今日活动总数: <Text strong>127</Text> | 
            成功: <Text style={{ color: token.colorSuccess }}>98</Text> | 
            警告: <Text style={{ color: token.colorWarning }}>15</Text> | 
            失败: <Text style={{ color: token.colorError }}>8</Text> | 
            信息: <Text style={{ color: token.colorPrimary }}>6</Text>
          </span>
          <span>
            最后更新: {dayjs().format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </Flex>
      </div>
    </Modal>
  )
}

export default AllActivitiesModal