import { theme } from 'antd'

// 预设主题配置
export const themePresets = {
  default: {
    name: '默认蓝',
    token: {
      colorPrimary: '#1677ff',
      colorInfo: '#1677ff',
      colorSuccess: '#00b96b',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
    }
  },
  green: {
    name: '薄荷绿',
    token: {
      colorPrimary: '#00b96b',
      colorInfo: '#00b96b',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
    }
  },
  purple: {
    name: '酱紫',
    token: {
      colorPrimary: '#722ed1',
      colorInfo: '#722ed1',
      colorSuccess: '#00b96b',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
    }
  },
  orange: {
    name: '日暮',
    token: {
      colorPrimary: '#fa8c16',
      colorInfo: '#fa8c16',
      colorSuccess: '#00b96b',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
    }
  },
  red: {
    name: '火红',
    token: {
      colorPrimary: '#f5222d',
      colorInfo: '#f5222d',
      colorSuccess: '#00b96b',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
    }
  },
  cyan: {
    name: '明青',
    token: {
      colorPrimary: '#13c2c2',
      colorInfo: '#13c2c2',
      colorSuccess: '#00b96b',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      borderRadius: 8,
    }
  }
}

// 获取当前主题
export const getCurrentTheme = () => {
  const savedTheme = localStorage.getItem('theme-preset')
  return savedTheme || 'default'
}

// 保存主题
export const saveTheme = (themeKey: string) => {
  localStorage.setItem('theme-preset', themeKey)
}

// 获取主题配置
export const getThemeConfig = (themeKey: string, isDark: boolean) => {
  const preset = themePresets[themeKey as keyof typeof themePresets] || themePresets.default
  
  return {
    token: {
      ...preset.token,
      // 根据暗色模式调整一些通用token
      fontSize: 14,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      wireframe: false,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
    },
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    components: {
      Layout: {
        siderBg: isDark ? '#001529' : '#ffffff',
        headerBg: isDark ? '#141414' : '#ffffff',
        bodyBg: isDark ? '#000000' : '#f5f5f5',
        triggerBg: isDark ? '#002140' : '#ffffff',
        triggerColor: isDark ? '#ffffff' : '#000000'
      },
      Menu: {
        itemBg: 'transparent',
        itemSelectedBg: isDark ? preset.token.colorPrimary : `${preset.token.colorPrimary}15`,
        itemSelectedColor: isDark ? '#ffffff' : preset.token.colorPrimary,
        itemHoverBg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        itemActiveBg: isDark ? preset.token.colorPrimary : `${preset.token.colorPrimary}15`,
        itemColor: isDark ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
        iconSize: 16,
        fontSize: 14,
        itemHeight: 40,
        collapsedIconSize: 16,
        itemBorderRadius: 6,
        itemMarginInline: 4
      },
      Card: {
        headerBg: isDark ? '#141414' : '#fafafa',
        colorBgContainer: isDark ? '#141414' : '#ffffff'
      },
      Button: {
        borderRadius: 6,
        controlHeight: 32,
        fontSize: 14
      },
      Input: {
        borderRadius: 6,
        controlHeight: 32
      },
      Select: {
        borderRadius: 6,
        controlHeight: 32
      },
      Table: {
        headerBg: isDark ? '#1f1f1f' : '#fafafa',
        rowHoverBg: isDark ? '#262626' : '#f5f5f5'
      },
      Modal: {
        borderRadiusLG: 12
      },
      Dropdown: {
        borderRadiusOuter: 8
      }
    }
  }
}