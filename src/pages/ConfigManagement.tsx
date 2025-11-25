import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select, 
  InputNumber,
  message,
  Tabs,
  Space,
  Alert,
  Divider
} from 'antd'
import { SaveOutlined, ReloadOutlined, GithubOutlined } from '@ant-design/icons'
import { getApiBaseUrl, getAuthHeaders } from '../utils/api'

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

const ConfigManagement: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(true)

  // 加载配置
  const loadConfig = async () => {
    try {
      setLoadingConfig(true)
      const resp = await fetch(`${getApiBaseUrl()}/config`, {
        method: 'GET',
        headers: getAuthHeaders()
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '加载配置失败')
        return
      }
      // 设置表单值
      form.setFieldsValue(data.data || {})
    } catch (e) {
      console.error(e)
      message.error('加载配置失败，请检查后端服务')
    } finally {
      setLoadingConfig(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // 调用后端API保存配置
      const resp = await fetch(`${getApiBaseUrl()}/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ configs: values })
      })
      const data = await resp.json()
      if (!resp.ok || data.code !== 200) {
        message.error(data?.message || '保存配置失败')
        return
      }
      message.success('配置已保存（需要重启系统才能生效）')
    } catch (error) {
      console.error('保存配置失败:', error)
      message.error('保存配置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    await loadConfig()
    message.info('配置已重置为服务器当前值')
  }

  return (
    <div>
      <Card
        title="系统配置"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              loading={loading}
              onClick={handleSave}
            >
              保存配置
            </Button>
          </Space>
        }
      >
        <Alert
          message="配置说明"
          description="修改配置后需要重启系统才能生效。请确保API密钥的正确性，错误的配置可能导致系统无法正常工作。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              size="small" 
              type="link" 
              icon={<GithubOutlined />}
              onClick={() => window.open('https://github.com/kilimro/ai-trend-publish_web', '_blank')}
            >
              查看文档
            </Button>
          }
        />

        {loadingConfig ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span>加载配置中...</span>
          </div>
        ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            // LLM配置
            DEFAULT_LLM_PROVIDER: 'DEEPSEEK',
            OPENAI_BASE_URL: 'https://api.openai.com/v1',
            OPENAI_MODEL: 'gpt-3.5-turbo',
            DEEPSEEK_BASE_URL: 'https://api.deepseek.com/v1',
            DEEPSEEK_MODEL: 'deepseek-chat',
            QWEN_BASE_URL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            QWEN_MODEL: 'qwen-max',
            
            // 模块配置
            AI_CONTENT_RANKER_LLM_PROVIDER: 'DEEPSEEK:deepseek-reasoner',
            AI_SUMMARIZER_LLM_PROVIDER: 'QWEN:qwen-max',
            ARTICLE_TEMPLATE_TYPE: 'default',
            ARTICLE_NUM: 10,
            
            // 微信配置
            NEED_OPEN_COMMENT: false,
            ONLY_FANS_CAN_COMMENT: false,
            AUTHOR: 'AI助手',
            
            // 数据库配置
            ENABLE_DB: true,
            DB_HOST: 'localhost',
            DB_PORT: 3306,
            DB_USER: 'root',
            DB_DATABASE: 'trendfinder',
            
            // 通知配置
            ENABLE_BARK: false
          }}
        >
          <Tabs defaultActiveKey="llm">
            <TabPane tab="LLM配置" key="llm">
              <Form.Item
                name="DEFAULT_LLM_PROVIDER"
                label="默认LLM提供者"
                rules={[{ required: true, message: '请选择默认LLM提供者' }]}
              >
                <Select>
                  <Option value="OPENAI">OpenAI</Option>
                  <Option value="DEEPSEEK">DeepSeek</Option>
                  <Option value="QWEN">通义千问</Option>
                  <Option value="XUNFEI">讯飞星火</Option>
                  <Option value="CUSTOM">自定义</Option>
                </Select>
              </Form.Item>

              <Divider orientation="left">OpenAI 配置</Divider>
              <Form.Item name="OPENAI_BASE_URL" label="OpenAI API地址">
                <Input placeholder="https://api.openai.com/v1" />
              </Form.Item>
              <Form.Item name="OPENAI_API_KEY" label="OpenAI API密钥">
                <Input placeholder="sk-..." />
              </Form.Item>
              <Form.Item name="OPENAI_MODEL" label="OpenAI模型">
                <Input placeholder="gpt-3.5-turbo" />
              </Form.Item>

              <Divider orientation="left">DeepSeek 配置</Divider>
              <Form.Item name="DEEPSEEK_BASE_URL" label="DeepSeek API地址">
                <Input placeholder="https://api.deepseek.com/v1" />
              </Form.Item>
              <Form.Item name="DEEPSEEK_API_KEY" label="DeepSeek API密钥">
                <Input placeholder="sk-..." />
              </Form.Item>
              <Form.Item name="DEEPSEEK_MODEL" label="DeepSeek模型">
                <Input placeholder="deepseek-chat|deepseek-reasoner" />
              </Form.Item>

              <Divider orientation="left">通义千问 配置</Divider>
              <Form.Item name="QWEN_BASE_URL" label="千问 API地址">
                <Input placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1" />
              </Form.Item>
              <Form.Item name="QWEN_API_KEY" label="千问 API密钥">
                <Input placeholder="sk-..." />
              </Form.Item>
              <Form.Item name="QWEN_MODEL" label="千问模型">
                <Input placeholder="qwen-max" />
              </Form.Item>

              <Divider orientation="left">讯飞星火 配置</Divider>
              <Form.Item name="XUNFEI_API_KEY" label="讯飞 API密钥">
                <Input placeholder="..." />
              </Form.Item>
            </TabPane>

            <TabPane tab="模块配置" key="modules">
              <Form.Item
                name="AI_CONTENT_RANKER_LLM_PROVIDER"
                label="内容排名模块LLM提供者"
              >
                <Input placeholder="DEEPSEEK:deepseek-reasoner" />
              </Form.Item>

              <Form.Item
                name="AI_SUMMARIZER_LLM_PROVIDER"
                label="内容摘要模块LLM提供者"
              >
                <Input placeholder="QWEN:qwen-max" />
              </Form.Item>

              <Form.Item
                name="ARTICLE_TEMPLATE_TYPE"
                label="文章模板类型"
              >
                <Select>
                  <Option value="default">默认模板</Option>
                  <Option value="modern">现代风格</Option>
                  <Option value="tech">技术专栏</Option>
                  <Option value="mianpro">Mianpro风格</Option>
                  <Option value="random">随机选择</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="ARTICLE_NUM"
                label="文章数量"
                rules={[{ required: true, message: '请输入文章数量' }]}
              >
                <InputNumber min={1} max={50} />
              </Form.Item>
            </TabPane>

            <TabPane tab="微信配置" key="weixin">
              <Form.Item name="WEIXIN_APP_ID" label="微信公众号AppID">
                <Input placeholder="wx..." />
              </Form.Item>

              <Form.Item name="WEIXIN_APP_SECRET" label="微信公众号AppSecret">
                <Input placeholder="..." />
              </Form.Item>

              <Form.Item name="AUTHOR" label="作者名称">
                <Input placeholder="AI助手" />
              </Form.Item>

              <Form.Item name="NEED_OPEN_COMMENT" label="开启评论" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="ONLY_FANS_CAN_COMMENT" label="仅粉丝可评论" valuePropName="checked">
                <Switch />
              </Form.Item>
            </TabPane>

            <TabPane tab="数据源配置" key="datasource">
              <Form.Item name="FIRE_CRAWL_API_KEY" label="FireCrawl API密钥">
                <Input placeholder="fc-..." />
              </Form.Item>

              <Form.Item name="X_API_BEARER_TOKEN" label="Twitter API Token">
                <Input placeholder="..." />
              </Form.Item>

              <Form.Item name="DASHSCOPE_API_KEY" label="阿里云API密钥">
                <Input placeholder="sk-..." />
              </Form.Item>
            </TabPane>

            <TabPane tab="数据库配置" key="database">
              <Form.Item name="ENABLE_DB" label="启用数据库" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item name="DB_HOST" label="数据库主机">
                <Input placeholder="localhost" />
              </Form.Item>

              <Form.Item name="DB_PORT" label="数据库端口">
                <InputNumber min={1} max={65535} />
              </Form.Item>

              <Form.Item name="DB_USER" label="数据库用户名">
                <Input placeholder="root" />
              </Form.Item>

              <Form.Item name="DB_PASSWORD" label="数据库密码">
                <Input placeholder="..." />
              </Form.Item>

              <Form.Item name="DB_DATABASE" label="数据库名称">
                <Input placeholder="trendfinder" />
              </Form.Item>
            </TabPane>

            <TabPane tab="通知配置" key="notification">
              <Alert
                message="通知配置说明"
                description="配置工作流执行结果的通知方式。工作流执行成功、失败或需要人工处理时，会发送通知到配置的平台。"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Divider orientation="left">Bark 通知</Divider>
              <Form.Item name="ENABLE_BARK" label="启用Bark通知" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="BARK_URL" label="Bark通知URL">
                <Input placeholder="https://api.day.app/your_key" />
              </Form.Item>

              <Divider orientation="left">钉钉通知</Divider>
              <Form.Item name="ENABLE_DINGDING" label="启用钉钉通知" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="DINGDING_WEBHOOK" label="钉钉机器人Webhook">
                <Input placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxx" />
              </Form.Item>
              <Form.Item name="DINGDING_KEYWORD" label="钉钉机器人关键词">
                <Input placeholder="工作流" />
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  钉钉机器人需要消息中包含此关键词才能发送。可以在工作流配置中覆盖此设置。
                </div>
              </Form.Item>
              <Alert
                message="钉钉机器人配置"
                description="在钉钉群聊中添加自定义机器人，获取Webhook地址。机器人需要设置关键词（如'工作流'），消息中必须包含此关键词才能发送。支持@所有人功能（紧急消息会自动@所有人）。"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </TabPane>

            <TabPane tab="短视频配置" key="video">
              <Alert
                message="短视频生成系统配置说明"
                description="配置短视频生成系统的授权码和路径。系统会调用独立的视频生成程序（exe）来生成视频，生成的视频会保存到指定目录供用户下载。"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Divider orientation="left">授权码配置</Divider>
              <Form.Item 
                name="VIDEO_GENERATOR_LICENSE" 
                label="短视频生成系统授权码"
                rules={[{ required: true, message: '请输入授权码' }]}
                tooltip="授权码支持按天/周/月/季度/半年/年/永久购买"
              >
                <Input placeholder="请输入授权码" />
              </Form.Item>
              <Alert
                message="授权码说明"
                description="授权码用于激活视频生成功能。支持多种时长：1天、7天、30天、90天、180天、365天、永久。授权码过期后需要重新购买。"
                type="warning"
                showIcon
                style={{ marginTop: 16, marginBottom: 24 }}
              />

              <Divider orientation="left">程序路径配置</Divider>
              <Form.Item 
                name="VIDEO_GENERATOR_EXE_PATH" 
                label="视频生成程序路径"
                tooltip="视频生成 exe 程序的完整路径"
              >
                <Input defaultValue="D:\code\weixin\ai-video\video-generator.exe" />
              </Form.Item>
              <Form.Item 
                name="VIDEO_OUTPUT_PATH" 
                label="视频输出路径"
                tooltip="生成的视频保存路径"
              >
                <Input defaultValue="D:\code\weixin\ai-trend-publish_web\src\video" />
              </Form.Item>

              <Divider orientation="left">环境检测</Divider>
              <Form.Item label="环境状态">
                <Button onClick={async () => {
                  // TODO: 调用后端API检测环境
                  message.info("正在检测环境...");
                }}>
                  检测环境
                </Button>
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
        )}
      </Card>
    </div>
  )
}

export default ConfigManagement