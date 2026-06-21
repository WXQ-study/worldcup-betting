import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, SectionList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Chip, Text, Title, Surface, Card, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import type { Match } from '../types';
import { formatDate, formatTimeHHMM, GROUPS, ROUNDS, getGroupColor, hexToRgba } from '../utils/formatting';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeRound, setActiveRound] = useState('all');
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const intervalRef = useRef<number | null>(null);

  const loadData = useCallback(async () => {
    const params: any = {};
    if (activeGroup !== 'all') params.group = activeGroup;
    if (searchText.trim()) {
      params.search = searchText.trim();
      // 搜索时不限定状态，后端会处理
    }
    const allMatches = await api.getMatches(params);
    // 排除历史交锋（round 包含"历史"的比赛）
    setMatches(allMatches.filter((m) => !m.round?.includes('历史')));
  }, [activeGroup, searchText]);

  useEffect(() => {
    loadData().finally(() => setLoading(false));

    intervalRef.current = setInterval(() => {
      loadData();
    }, 30000) as unknown as number;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadData]);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const filtered = useMemo(() => {
    let data = matches;
    if (activeRound !== 'all') data = data.filter((m) => m.round === activeRound);
    const grouped: Record<string, Match[]> = {};
    for (const m of data) {
      const key = formatDate(m.match_date);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    }
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [matches, activeRound]);

  const statusInfo = (m: Match) => {
    if (m.status === 'finished') return { text: `${m.home_score} - ${m.away_score}`, color: theme.colors.primary, icon: null };
    if (m.status === 'live') return { text: '进行中', color: '#ff4d4f', icon: 'circle' as const };
    if (m.status === 'scheduled') return { text: formatTimeHHMM(m.match_date), color: '#999', icon: null };
    return { text: '已取消', color: '#ccc', icon: null };
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <MaterialCommunityIcons name="stadium" size={22} color="#1a1a2e" />
          <Title style={styles.pageTitle}>比赛列表</Title>
        </View>

      <Searchbar
        placeholder="🔍 搜索球队..."
        onChangeText={setSearchText}
        value={searchText}
        style={styles.search}
        inputStyle={{ fontSize: 15 }}
      />

      <View style={styles.chipRow}>
        {['all', ...GROUPS].map((g) => (
          <Chip key={g} selected={activeGroup === g} onPress={() => setActiveGroup(g)} style={styles.chip} compact showSelectedOverlay>
            {g === 'all' ? '全部' : `${g}组`}
          </Chip>
        ))}
      </View>
      <View style={styles.chipRow}>
        {['all', ...ROUNDS].map((r) => (
          <Chip key={r} selected={activeRound === r} onPress={() => setActiveRound(r)} style={styles.chip} compact showSelectedOverlay>
            {r === 'all' ? '全部' : r.replace('小组赛', '')}
          </Chip>
        ))}
      </View>

      <SectionList
        sections={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        renderSectionHeader={({ section: { title, data } }) => (
          <Surface style={styles.sectionHeader} elevation={0}>
            <Text variant="titleSmall" style={{ fontWeight: '600', color: '#666' }}>{title}</Text>
            <Chip compact textStyle={{ fontSize: 11 }}>{data.length} 场</Chip>
          </Surface>
        )}
        renderItem={({ item }) => {
          const s = statusInfo(item);
          return (
            <Card style={styles.card} mode="elevated" onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}>
              <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '700' }}>
                    {item.home_team.name_cn} vs {item.away_team.name_cn}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MaterialCommunityIcons name="clock-outline" size={13} color="#999" />
                    <Text variant="bodySmall" style={{ color: '#999' }}>{formatTimeHHMM(item.match_date)}</Text>
                    {item.venue ? (
                      <>
                        <MaterialCommunityIcons name="map-marker" size={13} color="#999" style={{ marginLeft: 4 }} />
                        <Text variant="bodySmall" style={{ color: '#999' }}>{item.venue}</Text>
                      </>
                    ) : null}
                  </View>
                  {item.round && (
                    <Chip compact textStyle={{ fontSize: 10 }} style={{ marginTop: 4, backgroundColor: hexToRgba(getGroupColor(item.group || ''), 0.15) }}>
                      {item.group}组 {item.round.replace('小组赛', '')}
                    </Chip>
                  )}
                </View>
                <Surface style={{ backgroundColor: hexToRgba(s.color, 0.12), borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 }} elevation={0}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {s.icon && <MaterialCommunityIcons name={s.icon} size={10} color={s.color} />}
                    <Text style={{ fontSize: 16, fontWeight: '700', color: s.color }}>{s.text}</Text>
                  </View>
                </Surface>
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={<Text style={{ color: '#999', textAlign: 'center', marginTop: 60 }}>暂无比赛</Text>}
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
  search: { borderRadius: 14, marginBottom: 10, elevation: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { marginBottom: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 8 },
  card: { borderRadius: 14, marginBottom: 8 },
});
