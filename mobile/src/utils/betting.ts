export const WIN_DRAW_LOSS_OPTIONS = [
  { key: 'home', label: '主胜', emoji: '🏠', icon: 'home-variant' as const, field: 'home_win' as const },
  { key: 'draw', label: '平局', emoji: '🤝', icon: 'handshake' as const, field: 'draw' as const },
  { key: 'away', label: '客胜', emoji: '✈️', icon: 'airplane' as const, field: 'away_win' as const },
];

export function generateScoreGrid(): { h: number; a: number; label: string }[] {
  const grid: { h: number; a: number; label: string }[] = [];
  for (let h = 0; h <= 3; h++) {
    for (let a = 0; a <= 3; a++) {
      grid.push({ h, a, label: `${h}-${a}` });
    }
  }
  return grid;
}

export const SCORE_GRID = generateScoreGrid();

export function estimateScoreOdds(
  homeElo: number,
  awayElo: number,
  h: number,
  a: number,
): number {
  const base = Math.abs(h - a);
  const total = h + a;
  const eloDiff = homeElo - awayElo;

  let odds = 4.0 + base * 3.5 + total * 1.2;
  if (h > a) odds += (eloDiff > 0 ? -2 : 2);
  if (h < a) odds += (eloDiff < 0 ? -2 : 2);
  if (h === a) odds += 1.5;

  return Math.round(Math.max(odds, 2.5) * 100) / 100;
}
