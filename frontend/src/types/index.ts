export interface Team {
  id: number;
  name: string;
  name_cn: string;
  country_code: string;
  fifa_ranking: number | null;
  elo_rating: number;
  group: string | null;
  created_at: string;
}

export interface Player {
  id: number;
  team_id: number;
  name: string;
  name_cn: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  jersey_number: number | null;
  age: number | null;
  nationality: string | null;
  created_at: string;
}

export interface TeamDetail extends Team {
  players: Player[];
}

export interface Match {
  id: number;
  home_team_id: number;
  away_team_id: number;
  match_date: string;
  group: string | null;
  round: string | null;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  home_score: number | null;
  away_score: number | null;
  venue: string | null;
  competition: string | null;
  home_team: Team;
  away_team: Team;
  created_at: string;
}

export interface RecentMatch {
  id: number;
  opponent_name_cn: string;
  match_date: string;
  is_home: boolean;
  goals_for: number | null;
  goals_against: number | null;
  result: string | null;
  competition: string | null;
}

export interface MatchDetail {
  match: Match;
  home_team_detail: TeamDetail;
  away_team_detail: TeamDetail;
  home_recent_form: RecentMatch[];
  away_recent_form: RecentMatch[];
}

export interface Bet {
  id: number;
  match_id: number;
  bet_type: 'win' | 'draw' | 'loss' | 'over' | 'under' | 'handicap' | 'correct_score';
  pick: string;
  odds: number;
  stake: number;
  result: 'pending' | 'win' | 'loss' | 'half_win' | 'half_loss' | 'void';
  profit_loss: number;
  notes: string | null;
  placed_at: string;
  settled_at: string | null;
  match: Match | null;
}

export interface Stats {
  total_bets: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_staked: number;
  total_profit: number;
  roi: number;
  avg_odds: number;
}

export interface Bankroll {
  id: number;
  initial_balance: number;
  current_balance: number;
  total_profit: number;
  total_bets: number;
  win_rate: number;
  roi: number;
  updated_at: string;
}

export interface Prediction {
  match_id: number;
  home_team: string;
  away_team: string;
  match_date: string | null;
  venue: string | null;
  round: string | null;
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  recommendation: string;
  confidence: string;
  expected_value: number | null;
  recommended_odds: number | null;
}

export interface BetCreate {
  match_id: number;
  bet_type: string;
  pick: string;
  odds: number;
  stake: number;
  notes?: string;
}

export interface BetUpdate {
  result?: string;
  profit_loss?: number;
}
