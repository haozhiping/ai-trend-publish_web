import React from 'react'
import { 
  Drawer, 
  Space, 
  Typography, 
  Divider, 
  Switch, 
  Button,
  Tooltip,
  theme,
  Flex
} from 'antd'
import { 
  CheckOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { themePresets } from '../utils/theme'

const { Title, Text } = Typography

interface ThemeSelectorProps {
  visible: boolean
  onClose: () => void
  currentTheme: string
  isDark: boolean
  onThemeChange: (themeKey: string) => void
  onDarkModeChange: (isDark: boolean) => void
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  visible,
  onClose,
  currentTheme,
  isDark,
  onThemeChange,
  onDarkModeChange
}) => {
  const { token } = theme.useToken()

  const ColorBlock = ({ color, isSelected, onClick }: { 
    color: string
    isSelected: boolean
    onClick: () => void 
  }) => (
    <div
      onClick={onClick}
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        background: color,
        cursor: 'pointer',
        border: `2px solid ${isSelected ? color : 'transparent'}`,
        boxShadow: isSelected ? `0 0 0 2px ${token.colorBgContainer}` : 'none',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      {isSelected && (
        <CheckOutlined 
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 'bold'
          }} 
        />
      )}
    </div>
  )

  return (
    <Drawer
      title={
        <Flex align="center" gap={8}>
          <SettingOutlined />
          <span>主题设置</span>
        </Flex>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={300}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* 暗色模式切换 */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>
            整体风格设置
          </Title>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={8}>
              {isDark ? <MoonOutlined /> : <SunOutlined />}
              <Text>{isDark ? '暗色模式' : '亮色模式'}</Text>
            </Flex>
            <Switch
              checked={isDark}
              onChange={onDarkModeChange}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
          </Flex>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* 主题色选择 */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>
            主题色
          </Title>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {Object.entries(themePresets).map(([key, preset]) => (
              <Flex 
                key={key}
                justify="space-between" 
                align="center"
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: currentTheme === key ? token.colorFillAlter : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => onThemeChange(key)}
              >
                <Flex align="center" gap={12}>
                  <ColorBlock
                    color={preset.token.colorPrimary}
                    isSelected={currentTheme === key}
                    onClick={() => onThemeChange(key)}
                  />
                  <Text strong={currentTheme === key}>
                    {preset.name}
                  </Text>
                </Flex>
                {currentTheme === key && (
                  <CheckOutlined style={{ color: preset.token.colorPrimary }} />
                )}
              </Flex>
            ))}
          </Space>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* 预设主题快速切换 */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>
            快速切换
          </Title>
          <Flex wrap="wrap" gap={8}>
            {Object.entries(themePresets).map(([key, preset]) => (
              <Tooltip key={key} title={preset.name}>
                <ColorBlock
                  color={preset.token.colorPrimary}
                  isSelected={currentTheme === key}
                  onClick={() => onThemeChange(key)}
                />
              </Tooltip>
            ))}
          </Flex>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* 重置按钮 */}
        <div>
          <Button 
            block 
            onClick={() => {
              onThemeChange('default')
              onDarkModeChange(false)
            }}
          >
            重置为默认主题
          </Button>
        </div>

        {/* 说明文字 */}
        <div style={{ 
          padding: 12, 
          background: token.colorFillAlter, 
          borderRadius: 6,
          fontSize: 12,
          color: token.colorTextSecondary,
          lineHeight: 1.5
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 主题设置会自动保存到本地存储，下次访问时会自动应用您的设置。
          </Text>
        </div>
      </Space>
    </Drawer>
  )
}

export default ThemeSelector