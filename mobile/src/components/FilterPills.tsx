import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Pill {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  pills: Pill[];
  activeKey: string;
  onSelect: (key: string) => void;
  activeColor?: string;
}

export default function FilterPills({ pills, activeKey, onSelect, activeColor = '#1677ff' }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ paddingRight: 12 }}
    >
      {pills.map((pill) => {
        const active = activeKey === pill.key;
        return (
          <TouchableOpacity
            key={pill.key}
            onPress={() => onSelect(pill.key)}
            style={[
              styles.pill,
              { backgroundColor: active ? activeColor : '#f0f2f5' },
            ]}
          >
            <Text style={[styles.pillText, { color: active ? '#fff' : '#666' }]}>
              {pill.label}
              {pill.count !== undefined ? ` ${pill.count}` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 0, marginBottom: 12 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 8,
  },
  pillText: { fontSize: 13, fontWeight: '500' },
});
