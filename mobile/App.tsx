import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { FootballTheme } from './src/utils/theme';

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={FootballTheme}>
        <AppNavigator />
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
