import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Card, Text, Title, Chip, Surface, Divider, List, useTheme, ActivityIndicator, SegmentedButtons, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { api } from '../api';
import type { MatchDetail } from '../types';
import { formatDate, formatShortTime, POSITION_LABELS, POSITION_ICONS } from '../utils/formatting';

function groupPlayers(players: any[]) {
  const order = ['GK', 'DEF', 'MID', 'FWD'];
  const grouped: Record<string, any[]> = {};
  for (const p of players) {
    if (!grouped[p.position]) grouped[p.position] = [];
    grouped[p.position].push(p);
  }
  return order.filter((pos) => grouped[pos]).map((pos) => ({ position: pos, players: grouped[pos] }));
}

export default function MatchDetailScreen() {
  const route = useRoute<any>();
  const matchId = route.params.matchId;
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [squadTab, setSquadTab] = useState('home');
  const intervalRef = useRef<number | null>(null);
  const detailRef = useRef<MatchDetail | null>(null);
  const theme = useTheme();

  // 保持 ref 与 state 同步，避免闭包过期
  const setDetailSync = (data: MatchDetail | null) => {
    detailRef.current = data;
    setDetail(data);
  };

  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const data = await api.getMatchDetail(matchId);
      setDetailSync(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(() => {
      const current = detailRef.current;
      if (current && current.match.status !== 'finished' && current.match.status !== 'cancelled') {
        load(true);
      }
    }, 30000) as unknown as number;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!detail) return <View style={styles.center}><Text style={{ color: '#999' }}>加载失败</Text></View>;

  const { match, home_team_detail, away_team_detail } = detail;

  return (
    <ScrollView 
      style={{ backgroundColor: theme.colors.background }} 
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(false)} colors={[theme.colors.primary]} />}
    >
      {/* 比赛核心信息 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content style={{ alignItems: 'center', gap: 8 }}>
          <Text variant="headlineSmall" style={{ fontWeight: '800', textAlign: 'center' }}>
            {match.home_team.name_cn} vs {match.away_team.name_cn}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {match.round && <Chip compact textStyle={{ fontSize: 11 }}>{match.round}</Chip>}
            {match.group && <Chip compact textStyle={{ fontSize: 11 }}>{match.group}组</Chip>}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons name="calendar" size={13} color="#999" />
            <Text variant="bodySmall" style={{ color: '#999' }}>
              {match.match_date ? formatShortTime(match.match_date) : '-'}
            </Text>
            {match.venue ? (
              <>
                <Text style={{ color: '#999', marginLeft: 2 }}>·</Text>
                <MaterialCommunityIcons name="map-marker" size={13} color="#999" />
                <Text variant="bodySmall" style={{ color: '#999' }}>{match.venue}</Text>
              </>
            ) : null}
          </View>
          {match.status === 'finished' ? (
            <Surface style={{ backgroundColor: theme.colors.primaryContainer, borderRadius: 16, paddingHorizontal: 32, paddingVertical: 12 }} elevation={0}>
              <Text style={{ fontSize: 36, fontWeight: '800', color: theme.colors.primary }}>
                {match.home_score} - {match.away_score}
              </Text>
              <Text style={{ textAlign: 'center', color: theme.colors.primary, fontSize: 13 }}>比赛已结束</Text>
            </Surface>
          ) : (
            <Chip mode="outlined" style={{ backgroundColor: match.status === 'live' ? '#fff2f0' : '#f0f2f5' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {match.status === 'live' ? (
                  <MaterialCommunityIcons name="circle" size={10} color="#ff4d4f" />
                ) : (
                  <MaterialCommunityIcons name="timer-sand" size={14} color="#999" />
                )}
                <Text>{match.status === 'live' ? '进行中' : '未开始'}</Text>
              </View>
            </Chip>
          )}
        </Card.Content>
      </Card>

      {/* 球队对比 */}
      <View style={styles.compareRow}>
        <Card style={{ flex: 1, borderRadius: 14 }} mode="elevated">
          <Card.Content style={{ alignItems: 'center', gap: 4 }}>
            <Text variant="titleMedium" style={{ fontWeight: '700' }}>{home_team_detail.name_cn}</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>FIFA #{home_team_detail.fifa_ranking ?? '-'}</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>ELO {home_team_detail.elo_rating}</Text>
            <Chip compact textStyle={{ fontSize: 10 }}>{home_team_detail.players.length} 名球员</Chip>
          </Card.Content>
        </Card>
        <View style={{ justifyContent: 'center', paddingHorizontal: 8 }}>
          <Surface style={{ backgroundColor: theme.colors.primaryContainer, borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }} elevation={0}>
            <Text style={{ fontWeight: '800', color: theme.colors.primary, fontSize: 14 }}>VS</Text>
          </Surface>
        </View>
        <Card style={{ flex: 1, borderRadius: 14 }} mode="elevated">
          <Card.Content style={{ alignItems: 'center', gap: 4 }}>
            <Text variant="titleMedium" style={{ fontWeight: '700' }}>{away_team_detail.name_cn}</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>FIFA #{away_team_detail.fifa_ranking ?? '-'}</Text>
            <Text variant="bodySmall" style={{ color: '#666' }}>ELO {away_team_detail.elo_rating}</Text>
            <Chip compact textStyle={{ fontSize: 10 }}>{away_team_detail.players.length} 名球员</Chip>
          </Card.Content>
        </Card>
      </View>

      {/* 阵容切换 */}
      <SegmentedButtons
        value={squadTab}
        onValueChange={setSquadTab}
        buttons={[
          { value: 'home', label: `${home_team_detail.name_cn}`, style: { flex: 1 } },
          { value: 'away', label: `${away_team_detail.name_cn}`, style: { flex: 1 } },
        ]}
        style={{ marginBottom: 12 }}
      />

      {/* 球员列表 */}
      <Card style={styles.card} mode="elevated">
        <Card.Content style={{ gap: 16 }}>
          {groupPlayers(squadTab === 'home' ? home_team_detail.players : away_team_detail.players).map((group) => (
            <View key={group.position}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <MaterialCommunityIcons name={POSITION_ICONS[group.position as keyof typeof POSITION_ICONS] as any} size={16} color="#1a1a2e" />
                <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                  {POSITION_LABELS[group.position]} ({group.players.length})
                </Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {group.players.map((p: any) => (
                  <Surface key={p.id} style={{ width: '30%', borderRadius: 10, padding: 8, alignItems: 'center' }} elevation={0}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: theme.colors.primary }}>{p.jersey_number ?? '-'}</Text>
                    <Text variant="bodySmall" style={{ textAlign: 'center' }}>{p.name_cn}</Text>
                    {p.age && <Text variant="bodySmall" style={{ color: '#999', fontSize: 10 }}>{p.age}岁</Text>}
                  </Surface>
                ))}
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  container: { padding: 16 },
  card: { borderRadius: 16, marginBottom: 12 },
  compareRow: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 12 },
});
