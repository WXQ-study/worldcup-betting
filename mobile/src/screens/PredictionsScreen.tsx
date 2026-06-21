import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, SectionList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Title, Chip, Surface, useTheme, ActivityIndicator, Icon } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import type { Prediction } from '../types';
import ProbabilityBar from '../components/ProbabilityBar';
import { formatDate, ROUND_ORDER, ROUNDS, hexToRgba } from '../utils/formatting';

export default function PredictionsScreen() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [evFilter, setEvFilter] = useState<'all' | 'positive'>('all');
  const [activeRound, setActiveRound] = useState<string>('all');
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const loadData = useCallback(async () => { setPredictions(await api.getPredictions()); }, []);
  useEffect(() => { loadData().finally(() => setLoading(false)); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const filtered = useMemo(() => {
    let data = predictions;
    if (evFilter === 'positive') data = data.filter((p) => p.expected_value !== null && p.expected_value > 0);
    if (activeRound !== 'all') data = data.filter((p) => p.round === activeRound);
    const grouped: Record<string, Prediction[]> = {};
    for (const p of data) {
      const key = `${p.round || '未知'} · ${p.match_date ? formatDate(p.match_date) : ''}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    }
    return Object.entries(grouped)
      .sort((a, b) => (ROUND_ORDER[a[0].split(' · ')[0]] ?? 99) - (ROUND_ORDER[b[0].split(' · ')[0]] ?? 99))
      .map(([title, data]) => ({ title, data }));
  }, [predictions, evFilter, activeRound]);

  const roundChips = ['all', ...ROUNDS];

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <MaterialCommunityIcons name="robot" size={22} color="#1a1a2e" />
          <Title style={styles.pageTitle}>智能推荐</Title>
        </View>

      {/* EV 筛选 */}
      <View style={styles.chipRow}>
        <Chip selected={evFilter === 'all'} onPress={() => setEvFilter('all')} style={styles.chip} showSelectedOverlay>全部</Chip>
        <Chip selected={evFilter === 'positive'} onPress={() => setEvFilter('positive')} style={styles.chip} showSelectedOverlay icon="star">正EV推荐</Chip>
      </View>

      {/* 轮次筛选 */}
      <View style={styles.chipRow}>
        {roundChips.map((r) => (
          <Chip
            key={r}
            selected={activeRound === r}
            onPress={() => setActiveRound(r)}
            style={styles.chip}
            showSelectedOverlay
            compact
          >
            {r === 'all' ? '全部' : r.replace('小组赛', '')}
          </Chip>
        ))}
      </View>

      <SectionList
        sections={filtered}
        keyExtractor={(item) => String(item.match_id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        renderSectionHeader={({ section: { title, data } }) => (
          <Surface style={styles.sectionHeader} elevation={0}>
            <Text variant="titleSmall" style={{ fontWeight: '600' }}>{title}</Text>
            <Chip compact textStyle={{ fontSize: 11 }}>{data.length} 场</Chip>
          </Surface>
        )}
        renderItem={({ item }) => {
          const confColor = item.confidence === '高' ? '#52c41a' : item.confidence === '中' ? '#faad14' : '#ff4d4f';
          return (
            <Card
              style={styles.card}
              mode="elevated"
              onPress={() => navigation.navigate('MatchDetail', { matchId: item.match_id })}
            >
              <Card.Content style={{ gap: 8 }}>
                {/* 标题行 */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700', flex: 1 }}>
                    {item.home_team} vs {item.away_team}
                  </Text>
                  <Chip compact textStyle={{ fontSize: 10, color: confColor }} style={{ backgroundColor: hexToRgba(confColor, 0.15) }}>
                    置信度: {item.confidence}
                  </Chip>
                </View>

                {/* 元信息 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                  {item.round && <Chip compact textStyle={{ fontSize: 10 }}>{item.round}</Chip>}
                  <Text variant="bodySmall" style={{ color: '#999' }}>
                    {item.match_date && formatDate(item.match_date)}
                    {item.venue ? ` · ${item.venue}` : ''}
                  </Text>
                </View>

                {/* 概率条 */}
                <ProbabilityBar homeTeam={item.home_team} awayTeam={item.away_team} homeProb={item.home_win_prob} drawProb={item.draw_prob} awayProb={item.away_win_prob} />

                {/* 底部 */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="bodyMedium" style={{ color: '#666' }}>
                    推荐: <Text style={{ fontWeight: '700', color: theme.colors.primary }}>{item.recommendation}</Text>
                  </Text>
                  {item.expected_value !== null ? (
                    <Surface style={{ backgroundColor: item.expected_value > 0 ? '#f6ffed' : '#fff2f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }} elevation={0}>
                      <Text style={{ color: item.expected_value > 0 ? '#52c41a' : '#ff4d4f', fontWeight: '700', fontSize: 14 }}>
                        EV {item.expected_value > 0 ? '+' : ''}{item.expected_value.toFixed(1)}%
                      </Text>
                    </Surface>
                  ) : (
                    <Text variant="bodySmall" style={{ color: '#ccc' }}>无赔率数据</Text>
                  )}
                </View>
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={<Text style={{ color: '#999', textAlign: 'center', marginTop: 60 }}>暂无匹配的比赛</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  pageTitle: { fontSize: 22, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: { marginBottom: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8, marginTop: 4 },
  card: { borderRadius: 14, marginBottom: 10 },
});
