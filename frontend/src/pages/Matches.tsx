import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import type { Match } from '../types';
import MatchDetailModal from '../components/MatchDetailModal';

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const ROUNDS = ['小组赛第1轮', '小组赛第2轮', '小组赛第3轮'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${month}月${day}日 ${weekdays[d.getDay()]}`;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getGroupColor(group: string) {
  const colors = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
    '#3498db', '#9b59b6', '#e84393', '#00b894', '#fd79a8',
    '#6c5ce7', '#00cec9',
  ];
  return colors[group.charCodeAt(0) - 65] || '#3498db';
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeRound, setActiveRound] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const params: { group?: string; search?: string } = {};
    if (activeGroup) params.group = activeGroup;
    if (searchText.trim()) params.search = searchText.trim();

    api.getMatches(params).then((data) => {
      setMatches(data);
      setLoading(false);
    });
  }, [activeGroup, searchText]);

  const filtered = useMemo(() => {
    let list = matches;
    if (activeRound) {
      list = list.filter((m) => m.round === activeRound);
    }
    return list;
  }, [matches, activeRound]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of filtered) {
      const key = formatDate(m.match_date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const da = new Date(a[1][0].match_date);
      const db = new Date(b[1][0].match_date);
      return da.getTime() - db.getTime();
    });
  }, [filtered]);

  const handleSearch = (val: string) => {
    setSearchText(val);
    setActiveRound(null);
  };

  return (
    <div style={{ padding: '20px 28px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: 22, fontWeight: 700 }}>所有比赛</h2>
        <span style={{ color: '#888', fontSize: 14 }}>共 {matches.length} 场比赛</span>
      </div>

      <div style={{
        background: '#fff', borderRadius: 12, padding: '16px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <span style={{ position: 'absolute', left: 12, top: 8, fontSize: 14, color: '#aaa' }}>🔍</span>
            <input
              placeholder="搜索球队名称..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #e0e0e0',
                borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ROUNDS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRound(activeRound === r ? null : r)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none',
                  fontSize: 12, cursor: 'pointer',
                  background: activeRound === r ? '#3498db' : '#f0f2f5',
                  color: activeRound === r ? '#fff' : '#666',
                  transition: 'all 0.2s',
                }}
              >
                {r.replace('小组赛', '')}
              </button>
            ))}
            {activeRound && (
              <button
                onClick={() => setActiveRound(null)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none',
                  fontSize: 12, cursor: 'pointer', background: '#eee', color: '#999',
                }}
              >
                清除
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveGroup(null); setActiveRound(null); }}
            style={{
              padding: '6px 16px', borderRadius: 20, border: 'none',
              fontSize: 13, cursor: 'pointer',
              background: !activeGroup ? '#1a1a2e' : '#f0f2f5',
              color: !activeGroup ? '#fff' : '#666',
              fontWeight: !activeGroup ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            全部
          </button>
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => { setActiveGroup(activeGroup === g ? null : g); setActiveRound(null); }}
              style={{
                padding: '6px 16px', borderRadius: 20, border: 'none',
                fontSize: 13, cursor: 'pointer',
                background: activeGroup === g ? getGroupColor(g) : '#f0f2f5',
                color: activeGroup === g ? '#fff' : '#666',
                fontWeight: activeGroup === g ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {g}组
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          {searchText ? `未找到包含"${searchText}"的比赛` : '暂无比赛'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {groupedByDate.map(([dateKey, dayMatches]) => (
            <div key={dateKey}>
              <div style={{
                fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 10,
                paddingLeft: 4,
              }}>
                {dateKey}
                <span style={{ fontSize: 12, color: '#aaa', fontWeight: 400, marginLeft: 8 }}>
                  {dayMatches.length} 场
                </span>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {dayMatches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMatchId(m.id)}
                    style={{
                      background: '#fff', borderRadius: 10, padding: '14px 20px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      display: 'flex', alignItems: 'center', gap: 16,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: getGroupColor(m.group || 'A') + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: getGroupColor(m.group || 'A'),
                      flexShrink: 0,
                    }}>
                      {m.group}组
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        <span>{m.home_team.name_cn}</span>
                        <span style={{ color: '#bbb', margin: '0 8px' }}>vs</span>
                        <span>{m.away_team.name_cn}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                        <span>{formatTime(m.match_date)}</span>
                        {m.venue && <span> · {m.venue}</span>}
                        {m.round && <span> · {m.round.replace('小组赛', '')}</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: 20, color: '#ccc', flexShrink: 0 }}>›</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
