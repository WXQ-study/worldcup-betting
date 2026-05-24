import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Stats, Bankroll, Prediction, Bet } from '../types';
import MatchDetailModal from '../components/MatchDetailModal';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bankroll, setBankroll] = useState<Bankroll | null>(null);
  const [topPredictions, setTopPredictions] = useState<Prediction[]>([]);
  const [recentBets, setRecentBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.getStats(),
      api.getBankroll(),
      api.getPredictions(),
      api.getBets(),
    ]).then(([s, b, p, bets]) => {
      setStats(s);
      setBankroll(b);

      const sorted = [...p]
        .filter((x) => x.expected_value !== null && x.expected_value > 0)
        .sort((a, b_) => (b_.expected_value ?? 0) - (a.expected_value ?? 0))
        .slice(0, 5);
      setTopPredictions(sorted);
      setRecentBets(bets.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 600 }}>投注仪表盘</h2>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {[
          { label: '账户余额', value: bankroll ? `¥${bankroll.current_balance.toFixed(2)}` : '-', color: '#1677ff' },
          { label: '总盈亏', value: bankroll ? `${bankroll.total_profit >= 0 ? '+' : ''}¥${bankroll.total_profit.toFixed(2)}` : '-', color: bankroll && bankroll.total_profit >= 0 ? '#52c41a' : '#ff4d4f' },
          { label: '投注笔数', value: stats ? String(stats.total_bets) : '-', color: '#722ed1' },
          { label: '胜率', value: stats ? `${stats.win_rate}%` : '-', color: '#fa8c16' },
          { label: 'ROI', value: stats ? `${stats.roi}%` : '-', color: stats && stats.roi >= 0 ? '#52c41a' : '#ff4d4f' },
          { label: '平均赔率', value: stats ? String(stats.avg_odds) : '-', color: '#13c2c2' },
        ].map((card) => (
          <div key={card.label} style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top Predictions */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>🤖 最佳投注推荐</h3>
          {topPredictions.length === 0 ? (
            <p style={{ color: '#999', fontSize: 14 }}>暂无正预期值推荐</p>
          ) : (
            topPredictions.map((p) => (
              <div key={p.match_id} onClick={() => setSelectedMatchId(p.match_id)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{p.home_team} vs {p.away_team}</span>
                  <br />
                  <span style={{ fontSize: 12, color: '#999' }}>
                    {p.round && (
                      <span style={{
                        display: 'inline-block', background: '#f0f5ff', color: '#1677ff',
                        padding: '0 6px', borderRadius: 3, fontSize: 11, marginRight: 6,
                      }}>
                        {p.round}
                      </span>
                    )}
                    {p.match_date && new Date(p.match_date).toLocaleString('zh-CN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                    {p.venue && ` | ${p.venue}`}
                  </span>
                  <br />
                  <span style={{ fontSize: 12, color: '#666' }}>
                    推荐: {p.recommendation} | 置信度: {p.confidence}
                  </span>
                </div>
                <div style={{
                  background: '#f6ffed', color: '#52c41a',
                  padding: '4px 10px', borderRadius: 6,
                  fontSize: 14, fontWeight: 600,
                }}>
                  +{p.expected_value?.toFixed(1)}% EV
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Bets */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>📝 最近投注</h3>
          {recentBets.length === 0 ? (
            <p style={{ color: '#999', fontSize: 14 }}>暂无投注记录</p>
          ) : (
            recentBets.map((bet) => (
              <div key={bet.id} onClick={() => bet.match && setSelectedMatchId(bet.match.id)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #f0f0f0',
                cursor: bet.match ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => { if (bet.match) e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {bet.match ? `${bet.match.home_team.name_cn} vs ${bet.match.away_team.name_cn}` : `#${bet.match_id}`}
                  </span>
                  {bet.match && (
                    <>
                      <br />
                      <span style={{ fontSize: 12, color: '#999' }}>
                        {new Date(bet.match.match_date).toLocaleString('zh-CN', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </>
                  )}
                  <br />
                  <span style={{ fontSize: 12, color: '#666' }}>
                    {bet.pick} @ {bet.odds} | 投注 ¥{bet.stake}
                  </span>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  background:
                    bet.result === 'win' ? '#f6ffed' :
                    bet.result === 'loss' ? '#fff2f0' :
                    bet.result === 'pending' ? '#fffbe6' : '#f5f5f5',
                  color:
                    bet.result === 'win' ? '#52c41a' :
                    bet.result === 'loss' ? '#ff4d4f' :
                    bet.result === 'pending' ? '#faad14' : '#999',
                }}>
                  {bet.result === 'win' ? `+¥${bet.profit_loss.toFixed(2)}` :
                   bet.result === 'loss' ? `-¥${bet.stake.toFixed(2)}` :
                   bet.result === 'pending' ? '待结算' : bet.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedMatchId && (
        <MatchDetailModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </div>
  );
}
