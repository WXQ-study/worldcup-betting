import { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../api';
import type { Bet, Match } from '../types';
import MatchDetailModal from '../components/MatchDetailModal';

const WIN_DRAW_LOSS_OPTIONS = [
  { key: 'win', label: '主胜', icon: '🏠', color: '#e74c3c', bg: '#fff2f0' },
  { key: 'draw', label: '平局', icon: '🤝', color: '#faad14', bg: '#fffbe6' },
  { key: 'loss', label: '客胜', icon: '✈️', color: '#1677ff', bg: '#f0f5ff' },
];

const SCORE_GRID = [
  { h: 0, a: 0 }, { h: 1, a: 0 }, { h: 2, a: 0 }, { h: 3, a: 0 },
  { h: 0, a: 1 }, { h: 1, a: 1 }, { h: 2, a: 1 }, { h: 3, a: 1 },
  { h: 0, a: 2 }, { h: 1, a: 2 }, { h: 2, a: 2 }, { h: 3, a: 2 },
  { h: 0, a: 3 }, { h: 1, a: 3 }, { h: 2, a: 3 }, { h: 3, a: 3 },
];

function estimateScoreOdds(homeElo: number, awayElo: number, h: number, a: number): number {
  const diff = homeElo - awayElo;
  const baseProb = 1 / (1 + Math.pow(10, -diff / 400));
  const scoreProb = baseProb * Math.exp(-(Math.abs(h - a))) * (h + a > 0 ? 1 / (h + a + 1) : 0.5);
  const rawOdds = 1 / Math.max(scoreProb, 0.001);
  return Math.round(Math.min(Math.max(rawOdds, 1.5), 100) * 100) / 100;
}

export default function BettingRecords() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [selectedMatchOdds, setSelectedMatchOdds] = useState<{ home: number; draw: number; away: number } | null>(null);

  const [form, setForm] = useState({
    match_id: 0,
    bet_type: 'win' as string,
    pick: '',
    odds: 0,
    stake: 100,
    notes: '',
    tab: 'wdl' as 'wdl' | 'score',
  });

  const loadData = useCallback(() => {
    Promise.all([api.getBets(statusFilter ? { status: statusFilter } : {}), api.getMatches()])
      .then(([b, m]) => {
        setBets(b);
        setMatches(m.filter((x) => x.status === 'scheduled'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const loadMatchOdds = useCallback(async (matchId: number) => {
    try {
      const oddsList = await fetch(`/api/matches/${matchId}/odds`).then(r => r.json());
      if (oddsList && oddsList.length > 0) {
        setSelectedMatchOdds({
          home: oddsList[0].home_odds,
          draw: oddsList[0].draw_odds,
          away: oddsList[0].away_odds,
        });
      }
    } catch {
      setSelectedMatchOdds(null);
    }
  }, []);

  const getSelectedMatch = useMemo(() => {
    return matches.find((m) => m.id === form.match_id);
  }, [matches, form.match_id]);

  const handleWDLSelect = (key: string, label: string, odds: number) => {
    setForm({ ...form, bet_type: key, pick: label, odds });
  };

  const handleScoreSelect = (h: number, a: number) => {
    if (!getSelectedMatch) return;
    const pick = `${h}-${a}`;
    const odds = estimateScoreOdds(
      getSelectedMatch.home_team.elo_rating,
      getSelectedMatch.away_team.elo_rating,
      h, a,
    );
    setForm({ ...form, bet_type: 'correct_score', pick, odds });
  };

  const groupedBets = useMemo(() => {
    const groupMap = new Map<string, Bet[]>();
    for (const bet of bets) {
      const d = new Date(bet.placed_at);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!groupMap.has(dateKey)) groupMap.set(dateKey, []);
      groupMap.get(dateKey)!.push(bet);
    }

    const sortedKeys = Array.from(groupMap.keys()).sort((a, b) => b.localeCompare(a));

    return sortedKeys.map((key) => {
      const betsByDate = groupMap.get(key)!;
      const d = new Date(key);
      const displayDate = d.toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
      });
      return [displayDate, betsByDate] as [string, Bet[]];
    });
  }, [bets]);

  const handleCreate = async () => {
    if (!form.match_id || !form.odds || !form.stake || !form.pick) return;
    await api.createBet({
      match_id: form.match_id,
      bet_type: form.bet_type,
      pick: form.pick,
      odds: form.odds,
      stake: form.stake,
      notes: form.notes || undefined,
    });
    setShowForm(false);
    setForm({ match_id: 0, bet_type: 'win', pick: '', odds: 0, stake: 100, notes: '', tab: 'wdl' });
    setSelectedMatchOdds(null);
    loadData();
  };

  const handleSettle = async (id: number, result: string, profit: number) => {
    await api.updateBet(id, { result, profit_loss: profit });
    loadData();
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>📝 投注记录</h2>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '8px 20px', borderRadius: 8, border: 'none',
          background: '#1677ff', color: '#fff', cursor: 'pointer',
          fontSize: 14, fontWeight: 500,
        }}>
          {showForm ? '取消' : '+ 新建投注'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16,
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>新建投注</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>比赛</label>
              <select value={form.match_id} onChange={(e) => {
                const id = Number(e.target.value);
                setForm({ ...form, match_id: id, pick: '', odds: 0 });
                setSelectedMatchOdds(null);
                if (id) loadMatchOdds(id);
              }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }}>
                <option value={0}>选择比赛</option>
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.home_team.name_cn} vs {m.away_team.name_cn}
                    {m.round ? ` (${m.round})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>投注金额 ¥</label>
              <input type="number" step="1" min={1} value={form.stake || ''} onChange={(e) => setForm({ ...form, stake: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>赔率</label>
              <input type="number" step="0.01" value={form.odds || ''} onChange={(e) => setForm({ ...form, odds: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }} />
            </div>
          </div>

          {form.match_id > 0 && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#666' }}>投注类型</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setForm({ ...form, tab: 'wdl', pick: '', odds: 0 })}
                    style={{
                      padding: '8px 24px', borderRadius: 8, border: 'none',
                      background: form.tab === 'wdl' ? '#1677ff' : '#f0f2f5',
                      color: form.tab === 'wdl' ? '#fff' : '#666',
                      fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    🎯 胜平负
                  </button>
                  <button onClick={() => setForm({ ...form, tab: 'score', pick: '', odds: 0 })}
                    style={{
                      padding: '8px 24px', borderRadius: 8, border: 'none',
                      background: form.tab === 'score' ? '#1677ff' : '#f0f2f5',
                      color: form.tab === 'score' ? '#fff' : '#666',
                      fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    🥅 比分
                  </button>
                </div>
              </div>

              {form.tab === 'wdl' && selectedMatchOdds && (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#666' }}>
                    选择结果
                    {getSelectedMatch && (
                      <span style={{ color: '#999', marginLeft: 6 }}>
                        ({getSelectedMatch.home_team.name_cn} vs {getSelectedMatch.away_team.name_cn})
                      </span>
                    )}
                  </label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {WIN_DRAW_LOSS_OPTIONS.map((opt) => {
                      const odds = opt.key === 'win' ? selectedMatchOdds.home
                        : opt.key === 'draw' ? selectedMatchOdds.draw
                        : selectedMatchOdds.away;
                      const isSelected = form.bet_type === opt.key;
                      return (
                        <div key={opt.key} onClick={() => handleWDLSelect(opt.key, opt.label, odds)}
                          style={{
                            flex: 1, padding: '16px', borderRadius: 10, cursor: 'pointer',
                            textAlign: 'center', userSelect: 'none',
                            border: isSelected ? `2px solid ${opt.color}` : '2px solid #f0f0f0',
                            background: isSelected ? opt.bg : '#fafafa',
                            transition: 'all 0.2s',
                            transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                          }}>
                          <div style={{ fontSize: 28, marginBottom: 4 }}>{opt.icon}</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: isSelected ? opt.color : '#333' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: isSelected ? opt.color : '#666', marginTop: 4 }}>
                            {odds.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {form.tab === 'score' && (
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#666' }}>
                    选择比分
                    {getSelectedMatch && (
                      <span style={{ color: '#999', marginLeft: 6 }}>
                        ({getSelectedMatch.home_team.name_cn} vs {getSelectedMatch.away_team.name_cn})
                      </span>
                    )}
                  </label>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
                  }}>
                    {SCORE_GRID.map((s) => {
                      const pick = `${s.h}-${s.a}`;
                      const isSelected = form.pick === pick;
                      const isHomeWin = s.h > s.a;
                      const isDraw = s.h === s.a;
                      const isAwayWin = s.a > s.h;
                      const borderColor = isHomeWin ? '#e74c3c' : isDraw ? '#faad14' : '#1677ff';
                      return (
                        <div key={pick} onClick={() => handleScoreSelect(s.h, s.a)}
                          style={{
                            padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
                            textAlign: 'center',
                            border: isSelected ? `2px solid ${borderColor}` : '1px solid #f0f0f0',
                            background: isSelected ? `${borderColor}12` : '#fafafa',
                            transition: 'all 0.15s',
                            fontWeight: isSelected ? 700 : 400,
                            color: isSelected ? borderColor : '#333',
                            fontSize: 15,
                          }}>
                          {s.h}-{s.a}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {form.pick && form.odds > 0 && (
                <div style={{
                  marginTop: 16, padding: '12px 16px', background: '#f6ffed',
                  borderRadius: 8, border: '1px solid #b7eb8f',
                  fontSize: 14, color: '#389e0d',
                }}>
                  🎯 投注预览: <strong>{form.pick}</strong> @ <strong>{form.odds.toFixed(2)}</strong>
                  <span style={{ margin: '0 12px', color: '#ccc' }}>|</span>
                  本金 ¥{form.stake}
                  <span style={{ margin: '0 12px', color: '#ccc' }}>|</span>
                  可赢 ¥{(form.stake * form.odds).toFixed(2)}
                  <span style={{ margin: '0 12px', color: '#ccc' }}>|</span>
                  利润 ¥{(form.stake * form.odds - form.stake).toFixed(2)}
                </div>
              )}
            </>
          )}

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>备注</label>
            <input placeholder="可选" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }} />
          </div>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleCreate} disabled={!form.pick || !form.odds || form.odds <= 0}
              style={{
                padding: '10px 32px', borderRadius: 8, border: 'none',
                background: form.pick && form.odds > 0 ? 'linear-gradient(135deg, #1677ff, #4096ff)' : '#d9d9d9',
                color: form.pick && form.odds > 0 ? '#fff' : '#999',
                cursor: form.pick && form.odds > 0 ? 'pointer' : 'not-allowed',
                fontSize: 14, fontWeight: 600,
                transition: 'all 0.2s',
              }}>
              确认投注
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {[
          { label: '全部', value: '' },
          { label: '待结算', value: 'pending' },
          { label: '已赢', value: 'win' },
          { label: '已输', value: 'loss' },
        ].map((f) => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)} style={{
            padding: '4px 14px', borderRadius: 16, border: '1px solid #d9d9d9',
            background: statusFilter === f.value ? '#1677ff' : '#fff',
            color: statusFilter === f.value ? '#fff' : '#666',
            fontSize: 13, cursor: 'pointer',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Bet List Grouped by Date */}
      {bets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无投注记录</div>
      ) : (
        groupedBets.map(([date, dateBets]) => (
          <div key={date} style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
              marginBottom: 8, paddingLeft: 4,
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
                {date}
              </span>
              <span style={{
                fontSize: 11, color: '#bbb',
                background: '#f5f5f5', padding: '2px 10px', borderRadius: 10,
              }}>
                {dateBets.length}笔
              </span>
              <span style={{
                fontSize: 12, marginLeft: 'auto', fontWeight: 600,
                color: dateBets.reduce((sum, b) => sum + (b.result !== 'pending' ? b.profit_loss : 0), 0) >= 0 ? '#52c41a' : '#ff4d4f',
              }}>
                当日盈亏: ¥{dateBets.reduce((sum, b) => sum + (b.result !== 'pending' ? b.profit_loss : 0), 0).toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              {dateBets.map((bet) => (
                <div key={bet.id} onClick={() => bet.match && setSelectedMatchId(bet.match.id)} style={{
                  background: '#fff', borderRadius: 10, padding: '14px 20px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: bet.match ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => { if (bet.match) e.currentTarget.style.background = '#f5f5f5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>
                      {bet.match
                        ? `${bet.match.home_team.name_cn} vs ${bet.match.away_team.name_cn}`
                        : `比赛 #${bet.match_id}`}
                    </div>
                    {bet.match && (
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                        {bet.match.round && (
                          <span style={{
                            display: 'inline-block', background: '#f0f5ff', color: '#1677ff',
                            padding: '0 6px', borderRadius: 3, fontSize: 11, marginRight: 6,
                          }}>
                            {bet.match.round}
                          </span>
                        )}
                        {new Date(bet.match.match_date).toLocaleString('zh-CN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                        {bet.match.venue && ` | 🏟 ${bet.match.venue}`}
                      </div>
                    )}
                    <span style={{
                      display: 'inline-block', padding: '1px 6px', borderRadius: 3,
                      fontSize: 11, marginRight: 4, background: '#f0f5ff', color: '#1677ff',
                    }}>
                      {bet.bet_type === 'correct_score' ? '比分' :
                       bet.bet_type === 'win' ? '主胜' :
                       bet.bet_type === 'draw' ? '平局' :
                       bet.bet_type === 'loss' ? '客胜' : bet.bet_type}
                    </span>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      {bet.pick} @ {bet.odds} | ¥{bet.stake}
                      {bet.notes && <span> | 📝 {bet.notes}</span>}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {bet.result === 'pending' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleSettle(bet.id, 'win', bet.stake * bet.odds - bet.stake)} style={{
                          padding: '4px 12px', borderRadius: 4, border: 'none',
                          background: '#f6ffed', color: '#52c41a', cursor: 'pointer', fontSize: 12,
                        }}>赢</button>
                        <button onClick={() => handleSettle(bet.id, 'loss', -bet.stake)} style={{
                          padding: '4px 12px', borderRadius: 4, border: 'none',
                          background: '#fff2f0', color: '#ff4d4f', cursor: 'pointer', fontSize: 12,
                        }}>输</button>
                        <button onClick={() => handleSettle(bet.id, 'half_win', (bet.stake * bet.odds - bet.stake) / 2)} style={{
                          padding: '4px 12px', borderRadius: 4, border: 'none',
                          background: '#fffbe6', color: '#faad14', cursor: 'pointer', fontSize: 12,
                        }}>半赢</button>
                        <button onClick={() => handleSettle(bet.id, 'half_loss', -bet.stake / 2)} style={{
                          padding: '4px 12px', borderRadius: 4, border: 'none',
                          background: '#fffbe6', color: '#faad14', cursor: 'pointer', fontSize: 12,
                        }}>半输</button>
                        <button onClick={() => handleSettle(bet.id, 'void', 0)} style={{
                          padding: '4px 12px', borderRadius: 4, border: 'none',
                          background: '#f5f5f5', color: '#999', cursor: 'pointer', fontSize: 12,
                        }}>走水</button>
                      </div>
                    ) : (
                      <div style={{
                        padding: '6px 14px', borderRadius: 6, fontSize: 14, fontWeight: 600,
                        background:
                          bet.result === 'win' ? '#f6ffed' :
                          bet.result === 'loss' ? '#fff2f0' :
                          bet.result === 'void' ? '#f5f5f5' : '#fffbe6',
                        color:
                          bet.result === 'win' ? '#52c41a' :
                          bet.result === 'loss' ? '#ff4d4f' :
                          bet.result === 'void' ? '#999' : '#faad14',
                      }}>
                        {bet.result === 'win' ? `+¥${bet.profit_loss.toFixed(2)}` :
                         bet.result === 'loss' ? `-¥${Math.abs(bet.profit_loss).toFixed(2)}` :
                         bet.result === 'void' ? '走水' : `¥${bet.profit_loss.toFixed(2)}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {selectedMatchId && (
        <MatchDetailModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </div>
  );
}
