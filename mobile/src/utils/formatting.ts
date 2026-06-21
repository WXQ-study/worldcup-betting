export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const ROUNDS = ['小组赛第1轮', '小组赛第2轮', '小组赛第3轮'];

export const ROUND_ORDER: Record<string, number> = {
  '小组赛第1轮': 1,
  '小组赛第2轮': 2,
  '小组赛第3轮': 3,
};

export const POSITION_LABELS: Record<string, string> = {
  GK: '门将',
  DEF: '后卫',
  MID: '中场',
  FWD: '前锋',
};

export const POSITION_ICONS = {
  GK: 'shield-account' as const,
  DEF: 'shield' as const,
  MID: 'cog' as const,
  FWD: 'soccer' as const,
};

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const wd = weekdays[d.getDay()];
  return `${month}月${day}日 ${wd}`;
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortTime(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${h}:${m}`;
}

export function formatTimeHHMM(dateStr: string): string {
  const d = new Date(dateStr);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

const GROUP_COLORS = [
  '#1677ff', '#52c41a', '#fa8c16', '#722ed1',
  '#13c2c2', '#eb2f96', '#faad14', '#2f54eb',
  '#a0d911', '#f5222d', '#fa541c', '#1890ff',
];

export function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getGroupColor(group: string): string {
  const idx = GROUPS.indexOf(group.toUpperCase());
  return idx >= 0 ? GROUP_COLORS[idx] : '#999999';
}
