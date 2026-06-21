import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: collapsed ? 60 : 220,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        transition: 'width 0.3s',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>⚽</span>
          {!collapsed && <h1 style={{ fontSize: 16, margin: 0, whiteSpace: 'nowrap' }}>加美墨世界杯</h1>}
        </div>

        {/* User Info */}
        {!collapsed && user && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.65)',
          }}>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>👤 {user.username}</div>
            <div style={{ marginTop: 2 }}>{user.email}</div>
          </div>
        )}

        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {[
            { to: '/', label: '📊', text: '仪表盘' },
            { to: '/predictions', label: '🧻', text: '智能推荐' },
            { to: '/matches', label: '🏟️', text: '所有比赛' },
            { to: '/bets', label: '📝', text: '投注记录' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 4,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'all 0.2s',
              })}
            >
              <span style={{ fontSize: 18 }}>{item.label}</span>
              {!collapsed && item.text}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        {!collapsed && (
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: 13,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            🚪 退出登录
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: '12px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: 18,
          }}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </aside>

      <main style={{
        flex: 1,
        background: '#f0f2f5',
        overflow: 'auto',
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
