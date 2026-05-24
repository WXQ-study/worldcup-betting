import { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../api';
import type { Bet, Match } from '../types';
import MatchDetailModal from '../components/MatchDetailModal';

export default function BettingRecords() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const [form, setForm] = useState({
    match_id: 0,
    bet_type: 'win',
    pick: '',
    odds: 0,
    stake: 100,
    notes: '',
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
    if (!form.match_id || !form.odds || !form.stake) return;
    await api.createBet({
      match_id: form.match_id,
      bet_type: form.bet_type,
      pick: form.pick,
      odds: form.odds,
      stake: form.stake,
      notes: form.notes || undefined,
    });
    setShowForm(false);
    setForm({ match_id: 0, bet_type: 'win', pick: '', odds: 0, stake: 100, notes: '' });
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

      {/* Create Bet Form */}
      {showForm && (
        <div style={{
          background: '#fff', borderRadius: 12, padding: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16,
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>新建投注</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>比赛</label>
              <select value={form.match_id} onChange={(e) => setForm({ ...form, match_id: Number(e.target.value) })}
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
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>投注类型</label>
              <select value={form.bet_type} onChange={(e) => setForm({ ...form, bet_type: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }}>
                <option value="win">胜平负</option>
                <option value="over">大小球</option>
                <option value="handicap">让球盘</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>投注选项</label>
              <input placeholder="例: 主胜 / 大2.5" value={form.pick} onChange={(e) => setForm({ ...form, pick: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>赔率</label>
              <input type="number" step="0.01" value={form.odds || ''} onChange={(e) => setForm({ ...form, odds: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>投注金额 ¥</label>
              <input type="number" step="1" value={form.stake || ''} onChange={(e) => setForm({ ...form, stake: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#666' }}>备注</label>
            <input placeholder="可选" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 14 }} />
          </div>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleCreate} style={{
              padding: '10px 32px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #1677ff, #4096ff)', color: '#fff',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
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
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {bet.pick} @ {bet.odds} | ¥{bet.stake}
                      {bet.notes && <span> | 📝 {bet.notes}</span>}
                    </div>
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
