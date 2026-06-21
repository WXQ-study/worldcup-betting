import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ErrorBoundary from '../components/ErrorBoundary';

import DashboardScreen from '../screens/DashboardScreen';
import PredictionsScreen from '../screens/PredictionsScreen';
import MatchesScreen from '../screens/MatchesScreen';
import BettingRecordsScreen from '../screens/BettingRecordsScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';

const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 每个 Tab 带自己的 Stack，MatchDetail 共享
const stackScreenOptions = {
  headerStyle: { backgroundColor: '#ffffff' },
  headerTintColor: '#1a1a2e',
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
  headerShadowVisible: false,
  headerBackTitle: '返回',
};

function DashboardStack() {
  const Stack = createNativeStackNavigator();
  return (
    <ErrorBoundary fallbackName="Dashboard">
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="DashboardMain" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: '比赛详情' }} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}

function PredictionsStack() {
  const Stack = createNativeStackNavigator();
  return (
    <ErrorBoundary fallbackName="Predictions">
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="PredictionsMain" component={PredictionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: '比赛详情' }} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}

function MatchesStack() {
  const Stack = createNativeStackNavigator();
  return (
    <ErrorBoundary fallbackName="Matches">
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="MatchesMain" component={MatchesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: '比赛详情' }} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}

function BetsStack() {
  const Stack = createNativeStackNavigator();
  return (
    <ErrorBoundary fallbackName="Bets">
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="BetsMain" component={BettingRecordsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: '比赛详情' }} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1677ff',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { borderTopColor: '#f0f0f0', paddingBottom: 24, paddingTop: 2, height: 68 },
        tabBarLabelStyle: { fontSize: 11, marginTop: -3 },
        tabBarIconStyle: { marginBottom: -2 },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: '仪表盘',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-bar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PredictionsTab"
        component={PredictionsStack}
        options={{
          tabBarLabel: '推荐',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="robot" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MatchesTab"
        component={MatchesStack}
        options={{
          tabBarLabel: '比赛',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="stadium" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="BetsTab"
        component={BetsStack}
        options={{
          tabBarLabel: '投注',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="clipboard-text" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="Main" component={MainTabs} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
