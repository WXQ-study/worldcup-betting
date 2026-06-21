import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  children: React.ReactNode;
  fallbackName?: string;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.fallbackName ? ` - ${this.props.fallbackName}` : ''}]`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Surface style={styles.card} elevation={2}>
            <MaterialCommunityIcons name="alert" size={48} color="#faad14" />
            <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 8, textAlign: 'center' }}>
              页面加载出错
            </Text>
            <Text variant="bodySmall" style={{ color: '#999', textAlign: 'center', marginBottom: 16 }}>
              {this.state.error || '未知错误'}
            </Text>
            <Button mode="contained" onPress={this.handleReset} style={{ borderRadius: 8 }}>
              重新加载
            </Button>
          </Surface>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    padding: 32,
  },
  card: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },
});
