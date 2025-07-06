import React, { useState } from 'react'
import {
  Drawer,
  Form,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Divider,
  Checkbox,
  Radio,
  Slider,
  InputNumber,
  theme,
  Flex
} from 'antd'
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

interface ActivityFilterDrawerProps {
  visible: boolean
  onClose: () => void
  onFilter: (filters: any) => void
}

const ActivityFilterDrawer: React.FC<ActivityFilterDrawerProps> = ({ 
  visible, 
  onClose, 
  onFilter 
}) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()

  const activityTypes = [
    { label: '工作流执行', value: 'workflow' },
    { label: '内容发布', value: 'publish' },
    { label: '系统更新', value: 'system' },
    { label: 'API调用', value: 'api' },
    { label: '用户操作', value: 'user' },
    { label: '错误警告', value: 'error' }
  ]

  const statusOptions = [
    { label: '成功', value: 'success' },
    { label: '失败', value: 'failed' },
    { label: '警告', value: 'warning' },
    { label: '处理中', value: 'processing' }
  ]

  const moduleOptions = [
    { label: '微信工作流', value: 'WeixinWorkflow' },
    { label: 'AI引擎', value: 'AIEngine' },
    { label: '内容爬虫', value: 'Crawler' },
    { label: '系统监控', value: 'Monitor' },
    { label: '配置管理', value: 'ConfigManager' }
  ]

  const handleSubmit = () => {
    const values = form.getFieldsValue()
    onFilter(values)
    onClose()
  }

  const handleReset = () => {
    form.resetFields()
  }

  return (
    <Drawer
      title={
        <Flex align="center" gap={8}>
          <FilterOutlined />
          <span>活动筛选</span>
        </Flex>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      footer={
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={handleReset} icon={<ReloadOutlined />}>
            重置
          </Button>
          <Button type="primary" onClick={handleSubmit} icon={<SearchOutlined />}>
            应用筛选
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          timeRange: [dayjs().subtract(7, 'day'), dayjs()],
          status: ['success', 'failed', 'warning'],
          activityTypes: ['workflow', 'publish', 'system'],
          priority: [1, 5],
          includeSystem: true
        }}
      >
        {/* 时间范围 */}
        <Form.Item
          name="timeRange"
          label="时间范围"
        >
          <RangePicker
            showTime
            style={{ width: '100%' }}
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>

        <Divider />

        {/* 活动类型 */}
        <Form.Item
          name="activityTypes"
          label="活动类型"
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {activityTypes.map(type => (
                <Checkbox key={type.value} value={type.value}>
                  {type.label}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

        <Divider />

        {/* 状态筛选 */}
        <Form.Item
          name="status"
          label="状态"
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {statusOptions.map(status => (
                <Checkbox key={status.value} value={status.value}>
                  {status.label}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

        <Divider />

        {/* 模块筛选 */}
        <Form.Item
          name="modules"
          label="相关模块"
        >
          <Select
            mode="multiple"
            placeholder="选择模块"
            style={{ width: '100%' }}
            allowClear
          >
            {moduleOptions.map(module => (
              <Option key={module.value} value={module.value}>
                {module.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider />

        {/* 优先级范围 */}
        <Form.Item
          name="priority"
          label="优先级范围"
        >
          <Slider
            range
            min={1}
            max={5}
            marks={{
              1: '低',
              2: '',
              3: '中',
              4: '',
              5: '高'
            }}
            style={{ marginBottom: 16 }}
          />
        </Form.Item>

        <Divider />

        {/* 高级选项 */}
        <Title level={5} style={{ marginBottom: 16 }}>高级选项</Title>

        <Form.Item
          name="includeSystem"
          valuePropName="checked"
        >
          <Checkbox>包含系统自动活动</Checkbox>
        </Form.Item>

        <Form.Item
          name="includeErrors"
          valuePropName="checked"
        >
          <Checkbox>仅显示错误和警告</Checkbox>
        </Form.Item>

        <Form.Item
          name="groupByModule"
          valuePropName="checked"
        >
          <Checkbox>按模块分组显示</Checkbox>
        </Form.Item>

        <Divider />

        {/* 排序选项 */}
        <Form.Item
          name="sortBy"
          label="排序方式"
        >
          <Radio.Group>
            <Radio value="time">按时间</Radio>
            <Radio value="priority">按优先级</Radio>
            <Radio value="module">按模块</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="sortOrder"
          label="排序顺序"
        >
          <Radio.Group>
            <Radio value="desc">降序</Radio>
            <Radio value="asc">升序</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider />

        {/* 显示数量 */}
        <Form.Item
          name="limit"
          label="显示数量"
        >
          <InputNumber
            min={10}
            max={1000}
            step={10}
            style={{ width: '100%' }}
            placeholder="最多显示条数"
          />
        </Form.Item>

        {/* 预设筛选 */}
        <div style={{ 
          marginTop: 24,
          padding: 16,
          background: token.colorFillAlter,
          borderRadius: 8
        }}>
          <Title level={5} style={{ marginBottom: 12 }}>快速筛选</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              block 
              size="small"
              onClick={() => {
                form.setFieldsValue({
                  timeRange: [dayjs().subtract(1, 'hour'), dayjs()],
                  status: ['failed', 'warning'],
                  activityTypes: ['workflow', 'api', 'system']
                })
              }}
            >
              最近1小时的问题
            </Button>
            <Button 
              block 
              size="small"
              onClick={() => {
                form.setFieldsValue({
                  timeRange: [dayjs().subtract(24, 'hour'), dayjs()],
                  status: ['success'],
                  activityTypes: ['workflow', 'publish']
                })
              }}
            >
              今日成功活动
            </Button>
            <Button 
              block 
              size="small"
              onClick={() => {
                form.setFieldsValue({
                  timeRange: [dayjs().subtract(7, 'day'), dayjs()],
                  modules: ['WeixinWorkflow'],
                  status: ['success', 'failed']
                })
              }}
            >
              本周工作流活动
            </Button>
          </Space>
        </div>
      </Form>
    </Drawer>
  )
}

export default ActivityFilterDrawer