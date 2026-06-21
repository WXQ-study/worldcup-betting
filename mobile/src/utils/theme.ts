import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// 足球主题 - 自定义 MD3 色彩
export const FootballTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // 主色调 - 经典足球绿
    primary: '#0d7c3d',
    primaryContainer: '#d4f5e0',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#002110',
    // 次要色
    secondary: '#1677ff',
    secondaryContainer: '#d6e3ff',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#001a41',
    // 强调色
    tertiary: '#722ed1',
    tertiaryContainer: '#f2e8ff',
    // 成功/失败
    error: '#cf1322',
    errorContainer: '#fff2f0',
    // 背景
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceVariant: '#f7f8fa',
    // 文字
    onBackground: '#1a1a2e',
    onSurface: '#1a1a2e',
    onSurfaceVariant: '#6b7280',
    outline: '#e5e7eb',
    outlineVariant: '#d1d5db',
    // 特殊
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#ffffff',
      level3: '#ffffff',
      level4: '#ffffff',
      level5: '#ffffff',
    },
  },
  roundness: 12,
};

export const DarkFootballTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4ade80',
    primaryContainer: '#005228',
    onPrimary: '#001a06',
    onPrimaryContainer: '#d4f5e0',
    secondary: '#82b1ff',
    secondaryContainer: '#003a8c',
    onSecondary: '#001a41',
    onSecondaryContainer: '#d6e3ff',
    tertiary: '#b388ff',
    background: '#0f0f1a',
    surface: '#1a1a2e',
    surfaceVariant: '#252540',
    onBackground: '#e8e8f0',
    onSurface: '#e8e8f0',
    onSurfaceVariant: '#9ca3af',
    outline: '#374151',
    elevation: {
      level0: 'transparent',
      level1: '#1a1a2e',
      level2: '#1e1e34',
      level3: '#22223a',
      level4: '#262640',
      level5: '#2a2a46',
    },
  },
  roundness: 12,
};
