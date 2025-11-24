import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Select, 
  Button, 
  Space, 
  DatePicker, 
  Input,
  Tag,
  Tooltip,
  message
} from 'antd'
import { 
  ReloadOutlined, 
  DownloadOutlined, 
  ClearOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  SearchOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import JsonView from '@uiw/react-json-view'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { Option } = Select
const { RangePicker } = DatePicker
const { Search } = Input

interface LogEntry {
  id: number
  timestamp?: string
  createdAt?: string
  level: 'info' | 'warn' | 'error' | 'debug'
  module: string
  message: string
  details?: any
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [filters, setFilters] = useState({
    level: '',
    module: '',
    search: '',
    dateRange: null as any
  })

  const logLevels = [
    { value: 'debug', label: 'Debug', color: '#666' },
    { value: 'info', label: 'Info', color: '#1890ff' },
    { value: 'warn', label: 'Warning', color: '#faad14' },
    { value: 'error', label: 'Error', color: '#ff4d4f' }
  ]

  const [modules, setModules] = useState<string[]>([])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.level) params.append('level', filters.level)
      if (filters.module) params.append('module', filters.module)
      if (filters.search) params.append('keyword', filters.search)
      if (filters.dateRange && filters.dateRange.length === 2) {
        params.append('startTime', filters.dateRange[0].format('YYYY-MM-DD HH:mm:ss'))
        params.append('endTime', filters.dateRange[1].format('YYYY-MM-DD HH:mm:ss'))
      }
      const resp = await fetch(`${getApiBaseUrl()}/system/logs?${params.toString()}`, {
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '获取日志失败')
        return
      }
      const normalizedLogs = (data.data.items || []).map((log: any) => ({
        ...log,
        timestamp: log.timestamp || log.createdAt
      }))
      setLogs(normalizedLogs)
      const uniqueModules: string[] = Array.from(new Set(normalizedLogs.map((l: LogEntry) => l.module)))
      setModules(uniqueModules)
    } catch (error) {
      console.error(error)
      message.error('获取日志失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filters])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(fetchLogs, 10000)
    return () => clearInterval(interval)
  }, [autoRefresh, filters])

  const handleClearLogs = async () => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/system/logs/clear`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '清空失败')
        return
      }
      message.success('日志已清空')
      setLogs([])
    } catch (error) {
      console.error(error)
      message.error('清空失败')
    }
  }

  const handleExportLogs = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.level) params.append('level', filters.level)
      if (filters.module) params.append('module', filters.module)
      if (filters.search) params.append('keyword', filters.search)
      const resp = await fetch(`${getApiBaseUrl()}/system/logs/export?${params.toString()}`, {
        headers: getAuthHeaders()
      })
      const text = await resp.text()
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `system-logs-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      message.error('导出失败')
    }
  }

  const getLevelTag = (level: string) => {
    const levelConfig = logLevels.find(l => l.value === level)
    return (
      <Tag color={levelConfig?.color} style={{ minWidth: 60, textAlign: 'center' }}>
        {levelConfig?.label.toUpperCase()}
      </Tag>
    )
  }

  const getModuleTag = (module: string) => {
    return <Tag color="blue">{module}</Tag>
  }

  return (
    <div>
      <Card
        title="系统日志"
        extra={
          <Space>
            <Tooltip title={autoRefresh ? '暂停自动刷新' : '开启自动刷新'}>
              <Button
                icon={autoRefresh ? <PauseOutlined /> : <PlayCircleOutlined />}
                onClick={() => setAutoRefresh(!autoRefresh)}
                type={autoRefresh ? 'primary' : 'default'}
              >
                {autoRefresh ? '暂停' : '开始'}
              </Button>
            </Tooltip>
            <Button icon={<ReloadOutlined />} onClick={fetchLogs} loading={loading}>
              刷新
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportLogs}>
              导出
            </Button>
            <Button icon={<ClearOutlined />} danger onClick={handleClearLogs}>
              清空
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search
              placeholder="搜索日志内容"
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
              onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
              allowClear
            />
            <Select
              placeholder="选择日志级别"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, level: value || '' }))}
            >
              {logLevels.map(level => (
                <Option key={level.value} value={level.value}>
                  {level.label}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="选择模块"
              style={{ width: 200 }}
              allowClear
              onChange={(value) => setFilters(prev => ({ ...prev, module: value || '' }))}
            >
              {modules.map(module => (
                <Option key={module} value={module}>
                  {module}
                </Option>
              ))}
            </Select>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              showTime
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
            <div style={{ color: '#666', fontSize: 14 }}>
              共 {logs.length} 条日志
            </div>
          </Space>
        </div>

        <div className="log-container">
          {logs.map(log => (
            <div key={log.id} className="log-line">
              <span className="log-timestamp">[{log.timestamp || log.createdAt}]</span>
              <span style={{ marginRight: 8 }}>
                {getLevelTag(log.level)}
              </span>
              <span style={{ marginRight: 8 }}>
                {getModuleTag(log.module)}
              </span>
              <span>{log.message}</span>
              {log.details && (
                <div style={{ 
                  marginLeft: 200, 
                  marginTop: 4, 
                  color: '#888', 
                  fontSize: 11,
                  fontFamily: 'monospace'
                }}>
                  <JsonView value={log.details} collapsed={1} style={{ background: 'none', fontSize: 12 }} />
                </div>
              )}
            </div>
          ))}
          
          {logs.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: 40 }}>
              暂无日志数据
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default SystemLogs