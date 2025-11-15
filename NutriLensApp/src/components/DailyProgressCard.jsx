// src/components/DailyProgressCard.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart3 } from 'lucide-react-native';
import ProgressRing from './ProgressRing';

// 1. We now accept 'current', 'target', 'unit', and 'day' as props
const DailyProgressCard = ({ current, target, unit, day }) => {
  
  // 2. The component calculates its own percentage
  const caloriePercentage = Math.round((current / target) * 100);

  return (
    // 3. The dark background is part of this component
    <View style={styles.stickyContainer}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <BarChart3 size={20} color="#7dd3fc" />
            <Text style={styles.titleText}>Daily Progress</Text>
          </View>
          <Text style={styles.dayChip}>Day {day || 1}</Text>
        </View>
        <View style={styles.contentRow}>
          <View style={styles.statBlock}>
            {/* 4. Use the props directly */}
            <Text style={styles.mainNumber}>{current}</Text>
            <Text style={styles.subText}>of {target} {unit}</Text>
          </View>
          <ProgressRing
            current={current}
            target={target}
            size={70}
            strokeWidth={7}
            color="#ffffff"
          />
          <View style={styles.statBlock}>
            <Text style={styles.mainNumber}>{caloriePercentage}%</Text>
            <Text style={styles.subText}>Complete</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyContainer: {
    backgroundColor: '#1e293b', // The solid dark background
    paddingBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleLeft: { flexDirection: 'row', alignItems: 'center' },
  titleText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  dayChip: { color: '#e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, fontSize: 12, fontWeight: '500' },
  contentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statBlock: { alignItems: 'center' },
  mainNumber: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 2 },
  subText: { color: '#e2e8f0', fontSize: 14 },
});

export default DailyProgressCard;