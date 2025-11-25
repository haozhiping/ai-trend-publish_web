import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select,
  Upload,
  message,
  Popconfirm,
  Tag,
  Space
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CopyOutlined,
  StarOutlined,
  SearchOutlined
} from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'
import placeholderImg from '../assets/template-placeholder.svg'
import defaultTemplateImg from '../img/mysoai.png'

const { Option } = Select
const { TextArea } = Input

interface Template {
  id: number
  name: string
  type: 'article' | 'aibench' | 'hellogithub'
  description?: string
  previewUrl?: string
  content: string
  isDefault?: boolean
  platform?: string
}

const TemplateManagement: React.FC = () => {
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchType, setSearchType] = useState<string>('')

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [form] = Form.useForm()

  const templateTypes = [
    { value: 'article', label: '文章模板' },
    { value: 'aibench', label: 'AI排行榜模板' },
    { value: 'hellogithub', label: 'GitHub项目模板' }
  ]

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const resp = await fetch(`${getApiBaseUrl()}/templates`, {
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '获取模板失败')
        return
      }
      const templateList = data.data || []
      setAllTemplates(templateList)
      setTemplates(templateList)
    } catch (error) {
      console.error(error)
      message.error('获取模板失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    form.setFieldsValue(template)
    setIsModalVisible(true)
  }

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    setIsPreviewVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${getApiBaseUrl()}/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      message.success('模板已删除')
      fetchTemplates()
    } catch (error) {
      console.error(error)
      message.error('删除模板失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      const method = editingTemplate ? 'PUT' : 'POST'
      const url = editingTemplate
        ? `${getApiBaseUrl()}/templates/${editingTemplate.id}`
        : `${getApiBaseUrl()}/templates`

      const resp = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(values)
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '保存模板失败')
        return
      }
      message.success(editingTemplate ? '模板已更新' : '模板已创建')
      fetchTemplates()
      
      setIsModalVisible(false)
      setEditingTemplate(null)
      form.resetFields()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleCopy = async (template: Template) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...template,
          name: `${template.name} - 副本`,
          isDefault: false,
        })
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '复制模板失败')
        return
      }
      message.success('模板已复制')
      fetchTemplates()
    } catch (error) {
      console.error(error)
      message.error('复制模板失败')
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/templates/${id}/default`, {
        method: 'POST',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '设置默认模板失败')
        return
      }
      message.success('已设置为默认模板')
      fetchTemplates()
    } catch (error) {
      console.error(error)
      message.error('设置默认模板失败')
    }
  }

  const getTypeTag = (type: string) => {
    const typeConfig = {
      article: { color: 'blue', text: '文章模板' },
      aibench: { color: 'green', text: 'AI排行榜' },
      hellogithub: { color: 'orange', text: 'GitHub项目' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'default', text: type || '未知类型' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = []
    }
    acc[template.type].push(template)
    return acc
  }, {} as Record<string, Template[]>)

  const handleTemplateSearch = () => {
    let filtered = allTemplates
    if (searchKeyword) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      )
    }
    if (searchType) {
      filtered = filtered.filter(t => t.type === searchType)
    }
    setTemplates(filtered)
  }

  return (
    <div>
      <Card
        title="模板管理"
        loading={loading}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTemplate(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            新建模板
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input.Search
              placeholder="搜索模板名称或描述"
              style={{ width: 300 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
            />
            <Select
              placeholder="选择模板类型"
              style={{ width: 150 }}
              value={searchType}
              onChange={setSearchType}
              allowClear
            >
              {templateTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleTemplateSearch}>
              检索
            </Button>
          </Space>
        </div>
        {Object.entries(groupedTemplates).map(([type, typeTemplates]) => (
          <div key={type} style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>
              {templateTypes.find(t => t.value === type)?.label}
            </h3>
            <Row gutter={[16, 16]}>
              {typeTemplates.map(template => (
                <Col xs={24} sm={12} lg={8} xl={6} key={template.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img
                          alt={template.name}
                          src={template.previewUrl || defaultTemplateImg}
                          style={{ width: '100%', height: 'auto', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement
                            target.src = defaultTemplateImg
                          }}
                        />
                        {template.isDefault && (
                          <Tag 
                            color="gold" 
                            icon={<StarOutlined />}
                            style={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8 
                            }}
                          >
                            默认
                          </Tag>
                        )}
                      </div>
                    }
                    actions={[
                      <EyeOutlined key="preview" onClick={() => handlePreview(template)} />,
                      <EditOutlined key="edit" onClick={() => handleEdit(template)} />,
                      <CopyOutlined key="copy" onClick={() => handleCopy(template)} />,
                      <Popconfirm
                        title="确定要删除这个模板吗？"
                        onConfirm={() => handleDelete(template.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined key="delete" />
                      </Popconfirm>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {template.name}
                          {template.isDefault && <Tag color="gold">默认</Tag>}
                        </div>
                      }
                      description={template.description}
                    />
                    <div style={{ marginTop: 12 }}>
                      {getTypeTag(template.type)}
                      {!template.isDefault && (
                        <Button
                          size="small"
                          type="link"
                          onClick={() => handleSetDefault(template.id)}
                        >
                          设为默认
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Card>

      <Modal
        title={editingTemplate ? '编辑模板' : '新建模板'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingTemplate(null)
          form.resetFields()
        }}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="模板类型"
                rules={[{ required: true, message: '请选择模板类型' }]}
              >
                <Select placeholder="请选择模板类型">
                  {templateTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="模板描述"
          >
            <TextArea rows={2} placeholder="请输入模板描述" />
          </Form.Item>

          <Form.Item
            name="previewUrl"
            label="预览图URL"
          >
            <Input placeholder="请输入预览图URL" />
          </Form.Item>

          <Form.Item
            name="content"
            label="模板内容"
            rules={[{ required: true, message: '请输入模板内容' }]}
          >
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Editor
                height="400px"
                defaultLanguage="html"
                value={form.getFieldValue('content')}
                onChange={(value) => form.setFieldsValue({ content: value })}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14
                }}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="模板预览"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        {previewTemplate && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>{previewTemplate.name}</h3>
              <p>{previewTemplate.description}</p>
              {getTypeTag(previewTemplate.type)}
            </div>
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: 6,
              height: 600,
              overflow: 'auto'
            }}>
              <Editor
                height="100%"
                defaultLanguage="html"
                value={previewTemplate.content}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TemplateManagement