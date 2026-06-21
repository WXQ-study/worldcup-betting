import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, SectionList, RefreshControl, Modal, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card, Text, Title, Chip, Button, TextInput, Surface,
  Divider, useTheme, ActivityIndicator, IconButton, SegmentedButtons, Badge, List,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import type { Bet, Match } from '../types';
import { formatDate, formatShortTime, hexToRgba } from '../utils/formatting';
import { WIN_DRAW_LOSS_OPTIONS } from '../utils/betting';

const SETTLE_OPTIONS = [
  { value: 'win', label: '赢', color: '#52c41a' },
  { value: 'loss', label: '输', color: '#ff4d4f' },
  { value: 'half_win', label: '半赢', color: '#73d13d' },
  { value: 'half_loss', label: '半输', color: '#ff7875' },
  { value: 'void', label: '走水', color: '#999' },
];

export default function BettingRecordsScreen() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [betMode, setBetMode] = useState('wdl');
  const [form, setForm] = useState({ match_id: 0, match_name: '', bet_type: 'win', pick: '', score_home: '', score_away: '', odds: '', stake: '', notes: '' });
  const [matchPickerVisible, setMatchPickerVisible] = useState(false);
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const loadData = useCallback(async () => {
    // 分开请求：投注失败不影响比赛列表加载
    try {
      const b = await api.getBets(statusFilter === 'all' ? undefined : { status: statusFilter });
      setBets(b);
    } catch (e: any) {
      console.log('加载投注失败:', e.message);
    }
    try {
      const m = await api.getMatches();
      console.log('加载比赛成功:', m?.length ?? 0, '场');
      setMatches(m);
    } catch (e: any) {
      console.log('加载比赛失败:', e.message);
      Alert.alert('加载失败', '无法加载比赛列表: ' + e.message);
    }
  }, [statusFilter]);

  useEffect(() => { loadData().finally(() => setLoading(false)); }, [loadData]);
  const availableMatches = useMemo(() => {
    // 全部比赛（排除历史交锋），按日期排序
    return matches
      .filter((m) => !m.round?.includes('历史交锋'))
      .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  }, [matches]);

  const matchPickerSections = useMemo(() => {
    const liveMatches = availableMatches.filter((m) => m.status === 'live');
    const scheduledMatches = availableMatches.filter((m) => m.status === 'scheduled');
    const finishedMatches = availableMatches.filter((m) => m.status === 'finished');
    const sections = [];
    // 已结束排最前面（最近完赛的在上），然后正在进行，最后即将进行
    if (finishedMatches.length > 0) sections.push({ title: '已结束', data: finishedMatches });
    if (liveMatches.length > 0) sections.push({ title: '正在进行', data: liveMatches });
    if (scheduledMatches.length > 0) sections.push({ title: '即将进行', data: scheduledMatches });
    return sections;
  }, [availableMatches]);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const groupedBets = useMemo(() => {
    const grouped: Record<string, Bet[]> = {};
    for (const b of bets) {
      const key = formatDate(b.placed_at);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(b);
    }
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [bets]);

  const dailyPnL = useMemo(() => groupedBets.map((s) => ({
    title: s.title,
    pnl: s.data.reduce((sum, b) => sum + b.profit_loss, 0),
  })), [groupedBets]);

  const handleCreateBet = async () => {
    const { match_id, bet_type, pick, odds, stake, notes } = form;
    if (!match_id || !pick || !odds || !stake) { Alert.alert('提示', '请填写完整信息'); return; }
    const oddsNum = parseFloat(odds), stakeNum = parseFloat(stake);
    if (isNaN(oddsNum) || oddsNum < 1.0) { Alert.alert('提示', '赔率必须 >= 1.0'); return; }
    if (isNaN(stakeNum) || stakeNum <= 0) { Alert.alert('提示', '金额必须 > 0'); return; }
    try {
      await api.createBet({ match_id, bet_type, pick, odds: oddsNum, stake: stakeNum, notes: notes || undefined });
      setShowForm(false);
      setForm({ match_id: 0, match_name: '', bet_type: 'win', pick: '', score_home: '', score_away: '', odds: '', stake: '', notes: '' });
      loadData();
    } catch (e: any) { Alert.alert('失败', e.message); }
  };

  // 构建 pick 字段：WDL 和比分合并
  function buildPick(currentPick: string, home: string, away: string, mode: string) {
    const wdlPart = mode === 'both' ? (currentPick.split(' · ')[0] || '') : '';
    const scorePart = home || away ? `${home || '?'}-${away || '?'}` : '';
    if (mode === 'both') return `${wdlPart} · ${scorePart}`;
    if (mode === 'score') return scorePart;
    return currentPick; // wdl only
  }

  const handleSettle = async (betId: number, result: string, stake: number, odds: number) => {
    let pl = 0;
    if (result === 'win') pl = stake * (odds - 1);
    else if (result === 'loss') pl = -stake;
    else if (result === 'half_win') pl = stake * (odds - 1) / 2;
    else if (result === 'half_loss') pl = -stake / 2;
    try { await api.updateBet(betId, { result, profit_loss: Math.round(pl * 100) / 100 }); loadData(); }
    catch (e: any) { Alert.alert('失败', e.message); }
  };

  const handleDeleteBet = (betId: number, betInfo: string) => {
    Alert.alert('删除投注', `确定要删除这条投注吗？\n${betInfo}`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteBet(betId);
            loadData();
          } catch (e: any) { Alert.alert('删除失败', e.message); }
        },
      },
    ]);
  };

  const statusChips = ['all', 'pending', 'win', 'loss'];

  const resultBadge = (result: string, profitLoss: number, stake: number) => {
    const c: Record<string, { bg: string; fg: string; text: string }> = {
      win: { bg: '#f6ffed', fg: '#52c41a', text: `+¥${profitLoss.toFixed(2)}` },
      loss: { bg: '#fff2f0', fg: '#ff4d4f', text: `-¥${stake.toFixed(2)}` },
      pending: { bg: '#fffbe6', fg: '#faad14', text: '待结算' },
      half_win: { bg: '#f6ffed', fg: '#52c41a', text: `+¥${profitLoss.toFixed(2)}` },
      half_loss: { bg: '#fff2f0', fg: '#ff4d4f', text: `-¥${(stake / 2).toFixed(2)}` },
      void: { bg: '#f5f5f5', fg: '#999', text: '走水' },
    };
    const x = c[result] ?? { bg: '#f5f5f5', fg: '#999', text: result };
    return <Badge style={{ backgroundColor: x.bg, color: x.fg }} size={22}>{x.text}</Badge>;
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <MaterialCommunityIcons name="clipboard-text" size={22} color="#1a1a2e" />
        <Title style={styles.pageTitle}>投注记录</Title>
      </View>
        <Button mode="contained-tonal" onPress={() => setShowForm(!showForm)} icon={showForm ? 'chevron-up' : 'plus'}>
          {showForm ? '收起' : '新投注'}
        </Button>
      </View>

      {/* 状态过滤 */}
      <View style={styles.chipRow}>
        {statusChips.map((k) => (
          <Chip key={k} selected={statusFilter === k} onPress={() => setStatusFilter(k)} style={styles.chip} compact showSelectedOverlay>
            {{ all: '全部', pending: '待结算', win: '已赢', loss: '已输' }[k]}
          </Chip>
        ))}
      </View>

      {/* 创建投注表单 */}
      {showForm && (
        <Card style={styles.formCard} mode="elevated">
          <Card.Content style={{ gap: 10 }}>
            <Text variant="labelMedium">选择比赛</Text>
            <Button mode="outlined" onPress={() => setMatchPickerVisible(true)} icon="soccer">
              {form.match_name || '点击选择比赛...'}
            </Button>

            <Text variant="labelMedium">投注类型</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Chip
                selected={betMode === 'wdl' || betMode === 'both'}
                onPress={() => setBetMode((prev) => prev === 'wdl' ? 'score' : prev === 'score' ? 'both' : prev === 'both' ? 'score' : 'wdl')}
                style={{ flex: 1 }}
                showSelectedOverlay
                icon="handshake"
              >胜平负</Chip>
              <Chip
                selected={betMode === 'score' || betMode === 'both'}
                onPress={() => setBetMode((prev) => prev === 'score' ? 'wdl' : prev === 'wdl' ? 'both' : prev === 'both' ? 'wdl' : 'score')}
                style={{ flex: 1 }}
                showSelectedOverlay
                icon="scoreboard"
              >比分</Chip>
              <Chip
                selected={betMode === 'both'}
                onPress={() => setBetMode((prev) => prev === 'both' ? 'wdl' : 'both')}
                compact
                showSelectedOverlay
              >全选</Chip>
            </View>

            {/* WDL 选择器 */}
            {(betMode === 'wdl' || betMode === 'both') && (
              <View style={styles.wdlRow}>
                {WIN_DRAW_LOSS_OPTIONS.map((opt) => (
                  <TouchableOpacity key={opt.key} onPress={() => setForm((f) => {
                    const wdlPick = opt.label; // "主胜" / "平局" / "客胜"
                    const bType = opt.key === 'home' ? 'win' : opt.key === 'away' ? 'loss' : 'draw';
                    const scorePick = betMode === 'both' ? buildPick(wdlPick, f.score_home, f.score_away, 'both') : wdlPick;
                    return { ...f, bet_type: betMode === 'both' ? 'correct_score' : bType, pick: scorePick };
                  })} style={{ flex: 1 }}>
                    <Surface style={[styles.wdlCard, (form.pick === opt.label || form.pick.startsWith(opt.label + ' ·')) && { borderColor: theme.colors.primary, borderWidth: 2 }]} elevation={(form.pick === opt.label || form.pick.startsWith(opt.label + ' ·')) ? 2 : 0}>
                      <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                        <MaterialCommunityIcons name={opt.icon as any} size={24} color="#666" />
                        <Text variant="labelSmall" style={{ fontWeight: '500', marginTop: 4 }}>{opt.label}</Text>
                      </View>
                    </Surface>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {(betMode === 'score' || betMode === 'both') && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TextInput
                  label="主队进球"
                  value={form.score_home}
                  onChangeText={(t) => setForm({ ...form, score_home: t, pick: buildPick(form.pick, t, form.score_away, betMode) })}
                  mode="outlined"
                  keyboardType="number-pad"
                  dense
                  style={{ flex: 1 }}
                  placeholder="0"
                />
                <Text variant="titleMedium" style={{ fontWeight: '800', color: '#999' }}>-</Text>
                <TextInput
                  label="客队进球"
                  value={form.score_away}
                  onChangeText={(t) => setForm({ ...form, score_away: t, pick: buildPick(form.pick, form.score_home, t, betMode) })}
                  mode="outlined"
                  keyboardType="number-pad"
                  dense
                  style={{ flex: 1 }}
                  placeholder="0"
                />
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <TextInput label="赔率" value={form.odds} onChangeText={(t) => setForm({ ...form, odds: t })} mode="outlined" keyboardType="decimal-pad" dense placeholder="1.85" />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput label="金额 ¥" value={form.stake} onChangeText={(t) => setForm({ ...form, stake: t })} mode="outlined" keyboardType="decimal-pad" dense placeholder="100" />
              </View>
            </View>

            <TextInput label="备注（可选）" value={form.notes} onChangeText={(t) => setForm({ ...form, notes: t })} mode="outlined" dense placeholder="分析记录..." />

            {form.pick && form.odds && form.stake ? (
              <Surface style={{ backgroundColor: '#f6ffed', borderRadius: 10, padding: 12 }} elevation={0}>
                <Text style={{ color: '#52c41a', fontWeight: '600' }}>
                  {form.pick} @ {form.odds} · ¥{form.stake} · 潜在盈利 ¥{((parseFloat(form.odds) - 1) * parseFloat(form.stake)).toFixed(2)}
                </Text>
              </Surface>
            ) : null}

            <Button mode="contained" onPress={handleCreateBet} style={{ borderRadius: 10 }} contentStyle={{ paddingVertical: 6 }}>
              确认投注
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* 投注列表 */}
      <SectionList
        sections={groupedBets}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        renderSectionHeader={({ section }) => {
          const pnl = dailyPnL.find((d) => d.title === section.title)?.pnl ?? 0;
          return (
            <Surface style={styles.sectionHeader} elevation={0}>
              <Text variant="titleSmall" style={{ fontWeight: '600' }}>{section.title}</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: pnl >= 0 ? '#52c41a' : '#ff4d4f' }}>
                日盈亏 {pnl >= 0 ? '+' : ''}¥{pnl.toFixed(2)}
              </Text>
            </Surface>
          );
        }}
        renderItem={({ item: bet }) => {
          const betLabel = bet.match
            ? `${bet.match.home_team.name_cn} vs ${bet.match.away_team.name_cn}`
            : `#${bet.match_id}`;
          return (
          <Card style={styles.betCard} mode="elevated" onLongPress={() => handleDeleteBet(bet.id, `${betLabel}\n${bet.pick} @ ${bet.odds} · ¥${bet.stake}`)}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }} onStartShouldSetResponder={() => true} onTouchEnd={() => bet.match && navigation.navigate('MatchDetail', { matchId: bet.match.id })}>
                  <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                    {betLabel}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="calendar" size={12} color="#999" />
                    <Text variant="bodySmall" style={{ color: '#999' }}>{formatShortTime(bet.placed_at)}</Text>
                  </View>
                  <Text variant="bodySmall" style={{ color: '#666' }}>
                    {bet.pick} @ {bet.odds} · ¥{bet.stake}
                    {bet.notes ? ` · ${bet.notes}` : ''}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6, minWidth: 100 }}>
                  {resultBadge(bet.result, bet.profit_loss, bet.stake)}
                  {bet.result === 'pending' && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2, justifyContent: 'flex-end' }}>
                      {SETTLE_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt.value}
                          activeOpacity={0.6}
                          onPress={() => handleSettle(bet.id, opt.value, bet.stake, bet.odds)}
                          style={{
                            backgroundColor: hexToRgba(opt.color, 0.15),
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderWidth: 1,
                            borderColor: opt.color,
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '700', color: opt.color }}>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
          );
        }}
        ListEmptyComponent={<Text style={{ color: '#999', textAlign: 'center', marginTop: 60 }}>暂无投注记录</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />

      {/* 比赛选择 Modal */}
      <Modal visible={matchPickerVisible} animationType="slide" onRequestClose={() => setMatchPickerVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <View style={styles.modalHeader}>
            <Title>选择比赛</Title>
            <IconButton icon="close" onPress={() => setMatchPickerVisible(false)} />
          </View>
          <SectionList
            style={{ flex: 1 }}
            sections={matchPickerSections}
            keyExtractor={(item) => String(item.id)}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text variant="titleSmall" style={{ fontWeight: '600', color: '#666' }}>{title} ({data.length}场)</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 60 }}>
                <Text style={{ color: '#999' }}>
                  {matches.length === 0 ? '正在加载比赛列表...' : '暂无可投注的比赛（所有比赛已结束）'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <List.Item
                title={`${item.home_team.name_cn} vs ${item.away_team.name_cn}`}
                description={`${formatShortTime(item.match_date)} · ${item.round || ''} · ${item.group ? item.group + '组' : ''}`}
                left={(props) => <List.Icon {...props} icon="soccer" />}
                right={() => item.status === 'live' ? <Badge style={{ backgroundColor: '#fff2f0', color: '#ff4d4f', marginRight: 8 }}>进行中</Badge> : null}
                onPress={() => {
                  setForm({ ...form, match_id: item.id, match_name: `${item.home_team.name_cn} vs ${item.away_team.name_cn}` });
                  setMatchPickerVisible(false);
                }}
                style={{ backgroundColor: theme.colors.surface, borderRadius: 12, marginHorizontal: 16, marginVertical: 4 }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        </SafeAreaView>
      </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pageTitle: { fontSize: 22, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: { marginBottom: 2 },
  formCard: { borderRadius: 16, marginBottom: 14 },
  wdlRow: { flexDirection: 'row', gap: 10 },
  wdlCard: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  betCard: { borderRadius: 14, marginBottom: 8 },
  modalContainer: { flex: 1, paddingTop: 48 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
});
