import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Team, Match, Bet, Stats, Bankroll, Prediction,
  BetCreate, BetUpdate, MatchDetail,
} from '../types';

const BASE = 'http://localhost:8000/api';
const TOKEN_KEY = 'auth_token';

// ---- 自动认证 ----

let cachedToken: string | null = null;
let autoAuthReady: Promise<void> | null = null;

const DEVICE_ID_KEY = 'device_id';
const PASSWORD_KEY = 'device_pw';

/** 持久化的设备凭据 */
async function getOrCreateCreds(): Promise<{ username: string; password: string }> {
  let username = await AsyncStorage.getItem(DEVICE_ID_KEY);
  let password = await AsyncStorage.getItem(PASSWORD_KEY);
  if (!username || !password) {
    username = 'dev_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    password = 'pw_' + Math.random().toString(36).slice(2, 16);
    await AsyncStorage.multiSet([
      [DEVICE_ID_KEY, username],
      [PASSWORD_KEY, password],
    ]);
  }
  return { username, password };
}

/** 应用启动时自动注册/登录，全程透明 */
async function autoAuth(): Promise<void> {
  // 1. 尝试恢复已保存的 token
  const saved = await AsyncStorage.getItem(TOKEN_KEY);
  if (saved) {
    cachedToken = saved;
    return;
  }

  const creds = await getOrCreateCreds();

  // 2. 尝试登录
  try {
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: creds.username, password: creds.password }),
    });
    if (loginRes.ok) {
      const data = await loginRes.json();
      cachedToken = data.access_token;
      await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
      return;
    }
  } catch (e: any) {
    console.log('自动登录网络错误:', e.message);
  }

  // 3. 注册新账号（后端数据库重置后也能正常工作）
  try {
    const regRes = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: creds.username,
        email: creds.username + '@auto.local',
        password: creds.password,
      }),
    });
    if (regRes.ok) {
      const data = await regRes.json();
      cachedToken = data.access_token;
      await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
      return;
    }
    // 用户名已存在但密码不对 → 换一个新 ID 重新注册
    if (regRes.status === 400 || regRes.status === 409) {
      await AsyncStorage.multiRemove([DEVICE_ID_KEY, PASSWORD_KEY]);
      // 递归一次：生成新凭据后重试
      const newCreds = await getOrCreateCreds();
      const retryRes = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newCreds.username,
          email: newCreds.username + '@auto.local',
          password: newCreds.password,
        }),
      });
      if (retryRes.ok) {
        const data = await retryRes.json();
        cachedToken = data.access_token;
        await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
      }
    }
  } catch (e: any) {
    console.log('自动注册失败:', e.message);
  }
}

// 在模块加载时立即启动自动认证
autoAuthReady = autoAuth();

/** 等待自动认证完成 */
export function waitForAuth(): Promise<void> {
  return autoAuthReady ?? Promise.resolve();
}

// ---- HTTP 请求封装 ----

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  // 等待自动认证完成
  if (autoAuthReady) await autoAuthReady;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (cachedToken) {
    headers['Authorization'] = `Bearer ${cachedToken}`;
  }

  const res = await fetch(`${BASE}${url}`, { headers, ...options });

  if (!res.ok) {
    const err = await res.text();
    // 401 时清除过期 token，下次启动重新认证
    if (res.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      cachedToken = null;
    }
    throw new Error(err || res.statusText);
  }

  return res.json();
}

// ---- 业务 API ----

export const api = {
  getTeams: () => request<Team[]>('/teams/'),

  getMatches: (params?: { status?: string; group?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.group) qs.set('group', params.group);
    if (params?.search) qs.set('search', params.search);
    const q = qs.toString();
    return request<Match[]>(`/matches/${q ? `?${q}` : ''}`);
  },

  getMatch: (id: number) => request<Match>(`/matches/${id}`),

  getMatchDetail: (id: number) => request<MatchDetail>(`/matches/${id}/detail`),

  getMatchOdds: (matchId: number) =>
    request<{ id: number; match_id: number; bookmaker: string; home_odds: number; draw_odds: number; away_odds: number; timestamp: string }[]>(`/matches/${matchId}/odds`),

  getBets: (params?: { status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    const q = qs.toString();
    return request<Bet[]>(`/bets/${q ? `?${q}` : ''}`);
  },

  createBet: (data: BetCreate) =>
    request<Bet>('/bets/', { method: 'POST', body: JSON.stringify(data) }),

  updateBet: (id: number, data: BetUpdate) =>
    request<Bet>(`/bets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // 后端不支持 DELETE，用 PATCH 模拟软删除
  deleteBet: (id: number) =>
    request<Bet>(`/bets/${id}`, { method: 'PATCH', body: JSON.stringify({ result: 'void', profit_loss: 0 }) }),

  getStats: () => request<Stats>('/bets/stats/summary'),

  getBankroll: () => request<Bankroll>('/bets/bankroll/status'),

  getPredictions: () => request<Prediction[]>('/predictions/upcoming'),

  getPrediction: (matchId: number) =>
    request<Prediction>(`/predictions/match/${matchId}`),
};
