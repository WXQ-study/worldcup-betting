import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  homeTeam: string;
  awayTeam: string;
  homeProb: number;
  drawProb: number;
  awayProb: number;
}

export default function ProbabilityBar({ homeTeam, awayTeam, homeProb, drawProb, awayProb }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.segment, { flex: homeProb, backgroundColor: '#1677ff' }]}>
        {homeProb > 8 && <Text style={styles.text}>{homeTeam} {homeProb}%</Text>}
      </View>
      <View style={[styles.segment, { flex: drawProb, backgroundColor: '#d9d9d9' }]}>
        {drawProb > 8 && <Text style={[styles.text, { color: '#666' }]}>平 {drawProb}%</Text>}
      </View>
      <View style={[styles.segment, { flex: awayProb, backgroundColor: '#ff4d4f' }]}>
        {awayProb > 8 && <Text style={styles.text}>{awayTeam} {awayProb}%</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', height: 22, borderRadius: 6, overflow: 'hidden' },
  segment: { alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 10, fontWeight: '500' },
});
