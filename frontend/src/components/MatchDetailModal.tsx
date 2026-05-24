import { useEffect, useState } from 'react';
import { api } from '../api';
import type { MatchDetail } from '../types';

const POSITION_LABELS: Record<string, string> = {
  GK: '门将', DEF: '后卫', MID: '中场', FWD: '前锋',
};

const POSITION_ICONS: Record<string, string> = {
  GK: '🧤', DEF: '🛡️', MID: '⚙️', FWD: '⚡',
};

interface Props {
  matchId: number;
  onClose: () => void;
}

export default function MatchDetailModal({ matchId, onClose }: Props) {
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'home' | 'away'>('home');

  useEffect(() => {
    setLoading(true);
    api.getMatchDetail(matchId)
      .then(setDetail)
      .catch(() => alert('加载比赛详情失败'))
      .finally(() => setLoading(false));
  }, [matchId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (loading) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  const m = detail.match;
  const home = detail.home_team_detail;
  const away = detail.away_team_detail;
  const activeTeam = tab === 'home' ? home : away;

  const groupPlayers = (players: typeof home.players) => {
    const groups: Record<string, typeof players> = {};
    for (const p of players) {
      if (!groups[p.position]) groups[p.position] = [];
      groups[p.position].push(p);
    }
    return groups;
  };

  const homeGrouped = groupPlayers(home.players);
  const awayGrouped = groupPlayers(away.players);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0',
        }}>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700 }}>
              {m.home_team.name_cn} vs {m.away_team.name_cn}
            </h2>
            <div style={{ fontSize: 13, color: '#999' }}>
              <span style={{
                display: 'inline-block', background: '#f0f5ff', color: '#1677ff',
                padding: '0 8px', borderRadius: 3, fontSize: 12, marginRight: 8,
              }}>
                {m.round || m.competition}
              </span>
              {m.match_date && new Date(m.match_date).toLocaleString('zh-CN', {
                year: 'numeric', month: 'long', day: 'numeric',
                weekday: 'short', hour: '2-digit', minute: '2-digit',
              })}
              {m.venue && ` | 🏟 ${m.venue}`}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
            color: '#999', lineHeight: 1, padding: '0 4px',
          }}>✕</button>
        </div>

        {/* Team Comparison Summary */}
        <div style={{
          display: 'flex', gap: 16, marginBottom: 20,
        }}>
          {[
            { team: home, side: 'home' as const, label: '主场' },
            { team: away, side: 'away' as const, label: '客场' },
          ].map(({ team: t, side, label: sideLabel }) => (
            <div key={side} style={{
              flex: 1, background: '#fafafa', borderRadius: 10, padding: '14px 16px',
              border: side === 'home' ? '1px solid #e6f4ff' : '1px solid #fff2f0',
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                {t.name_cn}
                <span style={{
                  fontSize: 11, marginLeft: 8, color: '#999', fontWeight: 400,
                }}>
                  {sideLabel} | FIFA #{t.fifa_ranking} | ELO {t.elo_rating}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#666', display: 'flex', gap: 16 }}>
                <span>👥 {t.players.length}人</span>
                <span>🏆 FIFA {t.fifa_ranking || '-'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab: Squad / Form */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 16,
          background: '#f5f5f5', borderRadius: 8, padding: 3,
        }}>
          {[
            { key: 'home' as const, label: `🏠 ${m.home_team.name_cn} 阵容` },
            { key: 'away' as const, label: `✈️ ${m.away_team.name_cn} 阵容` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 6, border: 'none',
                background: tab === t.key ? '#fff' : 'transparent',
                color: tab === t.key ? '#333' : '#999',
                cursor: 'pointer', fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Player Roster */}
        <div style={{ marginBottom: 20 }}>
          {['GK', 'DEF', 'MID', 'FWD'].map((pos) => {
            const grouped = tab === 'home' ? homeGrouped : awayGrouped;
            const players = grouped[pos] || [];
            if (players.length === 0) return null;
            return (
              <div key={pos} style={{ marginBottom: 12 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: '#1677ff',
                  marginBottom: 6, textTransform: 'uppercase',
                }}>
                  {POSITION_ICONS[pos]} {POSITION_LABELS[pos]} ({players.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 4 }}>
                  {players.map((p) => (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '4px 10px', borderRadius: 6, background: '#f9f9f9',
                      fontSize: 12,
                    }}>
                      {p.jersey_number && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 20, height: 20, borderRadius: 4,
                          background: pos === 'GK' ? '#ffd591' : '#d9d9d9',
                          color: '#333', fontSize: 10, fontWeight: 700,
                        }}>
                          {p.jersey_number}
                        </span>
                      )}
                      <span style={{ fontWeight: 500 }}>{p.name_cn}</span>
                      <span style={{ color: '#999', fontSize: 11, marginLeft: 'auto' }}>
                        {p.age || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Form */}
        <div style={{
          borderTop: '1px solid #f0f0f0', paddingTop: 16,
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
            近一年战绩
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { form: detail.home_recent_form, teamName: home.name_cn },
              { form: detail.away_recent_form, teamName: away.name_cn },
            ].map(({ form, teamName }, idx) => (
              <div key={idx}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>
                  {teamName}
                </div>
                {form.length === 0 ? (
                  <div style={{ fontSize: 12, color: '#ccc' }}>暂无历史数据</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {form.map((f) => (
                      <div key={f.id} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 12, padding: '4px 8px', borderRadius: 4,
                        background: '#fafafa',
                      }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                          background: f.result === '胜' ? '#f6ffed' : f.result === '负' ? '#fff2f0' : '#fffbe6',
                          color: f.result === '胜' ? '#52c41a' : f.result === '负' ? '#ff4d4f' : '#faad14',
                        }}>
                          {f.result || '-'}
                        </span>
                        <span style={{ color: '#999', fontSize: 11, flexShrink: 0 }}>
                          {new Date(f.match_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </span>
                        <span style={{ flex: 1 }}>
                          {f.is_home ? '' : '客'} {f.opponent_name_cn}
                        </span>
                        <span style={{
                          fontWeight: 600,
                          color: f.result === '胜' ? '#52c41a' : f.result === '负' ? '#ff4d4f' : '#faad14',
                        }}>
                          {f.goals_for !== null ? `${f.goals_for}:${f.goals_against}` : '-'}
                        </span>
                        <span style={{ color: '#ccc', fontSize: 10 }}>{f.competition}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.45)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 20,
};

const modalStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16,
  width: '100%', maxWidth: 800, maxHeight: '90vh', overflow: 'auto',
  padding: 28, boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
};
