import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Surface, useTheme, Divider, IconButton, Badge, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import type { Stats, Bankroll, Prediction, Bet } from '../types';
import { formatShortTime } from '../utils/formatting';

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bankroll, setBankroll] = useState<Bankroll | null>(null);
  const [topPredictions, setTopPredictions] = useState<Prediction[]>([]);
  const [recentBets, setRecentBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const loadData = useCallback(async () => {
    try {
      const [s, b, p, bets] = await Promise.all([
        api.getStats(), api.getBankroll(), api.getPredictions(), api.getBets(),
      ]);
      setStats(s); setBankroll(b);
      setTopPredictions(
        [...p].filter((x) => x.expected_value !== null && x.expected_value > 0)
          .sort((a, b_) => (b_.expected_value ?? 0) - (a.expected_value ?? 0)).slice(0, 5)
      );
      setRecentBets(bets.slice(0, 5));
    } catch (e: any) {
      console.log('仪表盘加载失败:', e.message);
    }
  }, []);

  // 投入金额 = stats.total_staked（后端返回投注总额）
  const totalStaked = stats?.total_staked ?? 0;

  useEffect(() => { loadData().finally(() => setLoading(false)); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  const statCards = [
    { icon: 'wallet', label: '投入金额', value: `¥${totalStaked.toFixed(2)}`, color: theme.colors.primary },
    { icon: 'chart-line', label: '总盈亏', value: stats ? `${stats.total_profit >= 0 ? '+' : ''}¥${stats.total_profit.toFixed(2)}` : '-', color: stats && stats.total_profit >= 0 ? '#52c41a' : '#ff4d4f' },
    { icon: 'ticket', label: '投注笔数', value: stats ? String(stats.total_bets) : '-', color: theme.colors.secondary },
    { icon: 'trophy', label: '胜率', value: stats ? `${stats.win_rate}%` : '-', color: '#fa8c16' },
    { icon: 'percent', label: 'ROI', value: stats ? `${stats.roi}%` : '-', color: stats && stats.roi >= 0 ? '#52c41a' : '#ff4d4f' },
    { icon: 'calculator', label: '平均赔率', value: stats ? String(stats.avg_odds) : '-', color: '#13c2c2' },
  ];

  const resultBadge = (result: string, profitLoss: number, stake: number) => {
    const config: Record<string, { bg: string; fg: string; text: string }> = {
      win: { bg: '#f6ffed', fg: '#52c41a', text: `+¥${profitLoss.toFixed(2)}` },
      loss: { bg: '#fff2f0', fg: '#ff4d4f', text: `-¥${stake.toFixed(2)}` },
      pending: { bg: '#fffbe6', fg: '#faad14', text: '待结算' },
      half_win: { bg: '#f6ffed', fg: '#52c41a', text: `+¥${profitLoss.toFixed(2)}` },
      half_loss: { bg: '#fff2f0', fg: '#ff4d4f', text: `-¥${(stake / 2).toFixed(2)}` },
      void: { bg: '#f5f5f5', fg: '#999', text: '走水' },
    };
    const c = config[result] ?? { bg: '#f5f5f5', fg: '#999', text: result };
    return <Badge style={{ backgroundColor: c.bg, color: c.fg }} size={22}>{c.text}</Badge>;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
      >
        <Title style={styles.pageTitle}>投注仪表盘</Title>

      {/* 统计卡片网格 */}
      <View style={styles.statsGrid}>
        {statCards.map((s, i) => (
          <Surface key={i} style={styles.statCard} elevation={1}>
            <Text variant="labelSmall" style={{ color: '#999', marginBottom: 4 }}>{s.label}</Text>
            <Text variant="headlineSmall" style={{ fontWeight: '800', color: s.color }}>{s.value}</Text>
          </Surface>
        ))}
      </View>

      {/* 最佳推荐 */}
      <Card style={styles.card} mode="elevated">
        <Card.Title
          title={<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MaterialCommunityIcons name="robot" size={20} color="#1a1a2e" /><Text style={{ fontWeight: '600', fontSize: 16 }}>最佳投注推荐</Text></View>}
          titleVariant="titleMedium"
        />
        <Divider />
        <Card.Content style={{ paddingTop: 12 }}>
          {topPredictions.length === 0 ? (
            <Text style={{ color: '#999', textAlign: 'center', paddingVertical: 20 }}>暂无正预期值推荐</Text>
          ) : (
            topPredictions.map((p, i) => (
              <View key={p.match_id}>
                {i > 0 && <Divider style={{ marginVertical: 8 }} />}
                <View style={styles.predRow}>
                  <View style={{ flex: 1 }} onStartShouldSetResponder={() => true} onTouchEnd={() => navigation.navigate('MatchDetail', { matchId: p.match_id })}>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{p.home_team} vs {p.away_team}</Text>
                    <Text variant="bodySmall" style={{ color: '#999', marginTop: 2 }}>
                      {p.round && `${p.round} · `}{p.match_date && formatShortTime(p.match_date)}
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#666', marginTop: 2 }}>
                      推荐: {p.recommendation} · 置信度: {p.confidence}
                    </Text>
                  </View>
                  {p.expected_value !== null && (
                    <Surface style={{ backgroundColor: '#f6ffed', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }} elevation={0}>
                      <Text style={{ color: '#52c41a', fontWeight: '700', fontSize: 14 }}>+{p.expected_value.toFixed(1)}% EV</Text>
                    </Surface>
                  )}
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      {/* 最近投注 */}
      <Card style={styles.card} mode="elevated">
        <Card.Title
          title={<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MaterialCommunityIcons name="clipboard-text" size={20} color="#1a1a2e" /><Text style={{ fontWeight: '600', fontSize: 16 }}>最近投注</Text></View>}
          titleVariant="titleMedium"
        />
        <Divider />
        <Card.Content style={{ paddingTop: 12 }}>
          {recentBets.length === 0 ? (
            <Text style={{ color: '#999', textAlign: 'center', paddingVertical: 20 }}>暂无投注记录</Text>
          ) : (
            recentBets.map((bet, i) => (
              <View key={bet.id}>
                {i > 0 && <Divider style={{ marginVertical: 8 }} />}
                <View style={styles.betRow}>
                  <View style={{ flex: 1 }} onStartShouldSetResponder={() => true} onTouchEnd={() => bet.match && navigation.navigate('MatchDetail', { matchId: bet.match.id })}>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {bet.match ? `${bet.match.home_team.name_cn} vs ${bet.match.away_team.name_cn}` : `#${bet.match_id}`}
                    </Text>
                    {bet.match && <Text variant="bodySmall" style={{ color: '#999' }}>{formatShortTime(bet.match.match_date)}</Text>}
                    <Text variant="bodySmall" style={{ color: '#666' }}>{bet.pick} @ {bet.odds} · ¥{bet.stake}</Text>
                  </View>
                  {resultBadge(bet.result, bet.profit_loss, bet.stake)}
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  container: { padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { width: '47%', borderRadius: 14, padding: 16 },
  card: { borderRadius: 16, marginBottom: 16 },
  predRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  betRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
});
