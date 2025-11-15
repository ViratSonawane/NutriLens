// src/components/NutritionCard.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressRing from './ProgressRing';

const NutritionCard = ({ label, current, target, unit, icon: Icon, color }) => {
  const percentage = Math.round((current / target) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: color.bg }]}>
          <Icon size={18} color={color.icon} />
        </View>
        <View style={styles.ringContainer}>
          <ProgressRing
            current={current}
            target={target}
            size={44}
            strokeWidth={4.5}
            color={color.ring}
          />
          <Text style={[styles.ringText, { color: color.ring }]}>{percentage}%</Text>
        </View>
      </View>

      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.statsText}>{current}g / {target}g</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { backgroundColor: color.ring, width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  statsText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
});

export default NutritionCard;