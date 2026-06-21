import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  result: string;
  profitLoss: number;
  stake: number;
}

const RESULT_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  win: { bg: '#f6ffed', color: '#52c41a', label: '赢' },
  loss: { bg: '#fff2f0', color: '#ff4d4f', label: '输' },
  half_win: { bg: '#f6ffed', color: '#52c41a', label: '半赢' },
  half_loss: { bg: '#fff2f0', color: '#ff4d4f', label: '半输' },
  void: { bg: '#f5f5f5', color: '#999', label: '走水' },
  pending: { bg: '#fffbe6', color: '#faad14', label: '待结算' },
};

export default function BetResultBadge({ result, profitLoss, stake }: Props) {
  const config = RESULT_CONFIG[result] ?? { bg: '#f5f5f5', color: '#999', label: result };

  const displayText =
    result === 'win'
      ? `+¥${profitLoss.toFixed(2)}`
      : result === 'loss'
      ? `-¥${stake.toFixed(2)}`
      : result === 'half_win'
      ? `+¥${profitLoss.toFixed(2)}`
      : result === 'half_loss'
      ? `-¥${(stake / 2).toFixed(2)}`
      : config.label;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }]}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
