import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import type { Prediction } from '../types';
import MatchDetailModal from '../components/MatchDetailModal';

const ROUND_ORDER = ['小组赛第1轮', '小组赛第2轮', '小组赛第3轮'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    month: 'long', day: 'numeric', weekday: 'short',
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
    weekday: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function formatShortTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [evFilter, setEvFilter] = useState<'all' | 'positive'>('all');
  const [activeRound, setActiveRound] = useState<string | 'all'>('all');
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  useEffect(() => {
    api.getPredictions()
      .then(setPredictions)
      .finally(() => setLoading(false));
  }, []);

  const rounds = useMemo(() => {
    const roundSet = new Set(predictions.map((p) => p.round).filter(Boolean) as string[]);
    return ROUND_ORDER.filter((r) => roundSet.has(r));
  }, [predictions]);

  const grouped = useMemo(() => {
    let filtered = [...predictions];

    if (evFilter === 'positive') {
      filtered = filtered.filter((p) => (p.expected_value ?? 0) > 0);
    }

    filtered.sort((a, b) => {
      const dateA = a.match_date ? new Date(a.match_date).getTime() : 0;
      const dateB = b.match_date ? new Date(b.match_date).getTime() : 0;
      return dateA - dateB;
    });

    const groupMap = new Map<string, Prediction[]>();
    const seenRounds = new Set<string>();

    for (const p of filtered) {
      const roundKey = p.round || '其他';
      if (activeRound !== 'all' && roundKey !== activeRound) continue;
      seenRounds.add(roundKey);

      const dateKey = p.match_date ? formatDate(p.match_date) : '待定';
      const sectionKey = `${roundKey}|${dateKey}`;

      if (!groupMap.has(sectionKey)) {
        groupMap.set(sectionKey, []);
      }
      groupMap.get(sectionKey)!.push(p);
    }

    const sortedRounds = ROUND_ORDER.filter((r) => seenRounds.has(r));
    const otherRounds = [...seenRounds].filter((r) => !ROUND_ORDER.includes(r));

    const result: { round: string; date: string; matches: Prediction[] }[] = [];

    for (const round of [...sortedRounds, ...otherRounds]) {
      const dateMap = new Map<string, Prediction[]>();
      for (const [key, matches] of groupMap) {
        const [r, d] = key.split('|');
        if (r === round) {
          if (!dateMap.has(d)) dateMap.set(d, []);
          dateMap.set(d, [...(dateMap.get(d) || []), ...matches]);
        }
      }
      for (const [date, matches] of dateMap) {
        result.push({ round, date, matches });
      }
    }

    return result;
  }, [predictions, evFilter, activeRound]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>🤖 智能推荐</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setEvFilter('all')} style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid #d9d9d9',
            background: evFilter === 'all' ? '#1677ff' : '#fff',
            color: evFilter === 'all' ? '#fff' : '#333', cursor: 'pointer', fontSize: 13,
          }}>
            全部
          </button>
          <button onClick={() => setEvFilter('positive')} style={{
            padding: '6px 16px', borderRadius: 6, border: '1px solid #d9d9d9',
            background: evFilter === 'positive' ? '#1677ff' : '#fff',
            color: evFilter === 'positive' ? '#fff' : '#333', cursor: 'pointer', fontSize: 13,
          }}>
            正EV推荐
          </button>
        </div>
      </div>

      {/* Round Filter Tabs */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20,
        padding: '4px 6px', background: '#fff', borderRadius: 10,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)', overflow: 'auto',
      }}>
        {[{ label: '🏟 全部轮次', value: 'all' as const }, ...rounds.map((r) => ({ label: r, value: r }))].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveRound(tab.value)}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: activeRound === tab.value ? '#1677ff' : 'transparent',
              color: activeRound === tab.value ? '#fff' : '#666',
              cursor: 'pointer', fontSize: 13, fontWeight: activeRound === tab.value ? 600 : 400,
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>
                {predictions.filter((p) => p.round === tab.value).length}场
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grouped by round + date */}
      {grouped.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          暂无匹配的比赛
        </div>
      ) : (
        grouped.map((section, idx) => (
          <div key={`${section.round}-${section.date}`} style={{ marginBottom: idx < grouped.length - 1 ? 20 : 0 }}>
            {/* Section Header */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
              marginBottom: 10, paddingLeft: 4,
            }}>
              <span style={{
                fontSize: 15, fontWeight: 600, color: '#333',
              }}>
                {section.round}
              </span>
              <span style={{ fontSize: 13, color: '#999' }}>
                {section.date}
              </span>
              <span style={{
                fontSize: 11, color: '#bbb', marginLeft: 'auto',
                background: '#f5f5f5', padding: '2px 10px', borderRadius: 10,
              }}>
                {section.matches.length}场
              </span>
            </div>

            {/* Match Cards */}
            <div style={{ display: 'grid', gap: 8 }}>
              {section.matches.map((p) => (
                <div key={p.match_id} onClick={() => setSelectedMatchId(p.match_id)} style={{
                  background: '#fff', borderRadius: 12, padding: 16,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600 }}>
                        {p.home_team} vs {p.away_team}
                      </h3>
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>
                        {p.match_date && formatTime(p.match_date)}
                        {p.venue && ` | 🏟 ${p.venue}`}
                      </div>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 12,
                        background: p.confidence === '高' ? '#f6ffed' : p.confidence === '中' ? '#fffbe6' : '#fff2f0',
                        color: p.confidence === '高' ? '#52c41a' : p.confidence === '中' ? '#faad14' : '#ff4d4f',
                      }}>
                        置信度: {p.confidence}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700, color: '#1677ff',
                        padding: '4px 12px', borderRadius: 6, background: '#f0f5ff',
                      }}>
                        推荐: {p.recommendation}
                      </div>
                      {p.expected_value !== null && p.recommended_odds !== null && (
                        <div style={{
                          marginTop: 6, fontSize: 12,
                          color: p.expected_value > 0 ? '#52c41a' : '#ff4d4f',
                        }}>
                          赔率 {p.recommended_odds}
                          <span style={{ marginLeft: 6 }}>
                            EV: {p.expected_value > 0 ? '+' : ''}{p.expected_value}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Probability Bar */}
                  <div style={{ display: 'flex', height: 22, borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      width: `${p.home_win_prob}%`,
                      background: 'linear-gradient(135deg, #1677ff, #69b1ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 11, fontWeight: 500,
                      minWidth: p.home_win_prob > 8 ? undefined : 28,
                    }}>
                      {p.home_team} {p.home_win_prob}%
                    </div>
                    <div style={{
                      width: `${p.draw_prob}%`,
                      background: 'linear-gradient(135deg, #d9d9d9, #e8e8e8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#666', fontSize: 11, fontWeight: 500,
                      minWidth: p.draw_prob > 8 ? undefined : 28,
                    }}>
                      平 {p.draw_prob}%
                    </div>
                    <div style={{
                      width: `${p.away_win_prob}%`,
                      background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 11, fontWeight: 500,
                      minWidth: p.away_win_prob > 8 ? undefined : 28,
                    }}>
                      {p.away_team} {p.away_win_prob}%
                    </div>
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
