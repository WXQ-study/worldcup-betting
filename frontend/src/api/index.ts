import type { Team, Match, Bet, Stats, Bankroll, Prediction, BetCreate, BetUpdate, MatchDetail, Odds } from '../types';

const BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${url}`, {
    headers,
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json();
}

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

  getMatchOdds: (id: number) => request<Odds[]>(`/matches/${id}/odds`),

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

  getStats: () => request<Stats>('/bets/stats/summary'),

  getBankroll: () => request<Bankroll>('/bets/bankroll/status'),

  getPredictions: () => request<Prediction[]>('/predictions/upcoming'),

  getPrediction: (matchId: number) =>
    request<Prediction>(`/predictions/match/${matchId}`),
};
