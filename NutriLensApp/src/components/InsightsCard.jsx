// src/components/InsightsCard.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InsightsCard = ({ insight }) => {
  // The 'insight' prop will contain the data for one card
  const { icon: Icon, title, subtitle, urgent } = insight;

  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          <Icon size={18} color="white" />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      {/* Only show the pulsing dot if the insight is urgent */}
      {urgent && <View style={styles.pulseDot} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    marginBottom: 12, // Space between cards
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4f46e5', // Indigo color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b', // slate-800
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b', // slate-600
  },
  pulseDot: {
    width: 8,
    height: 8,
    backgroundColor: '#3b82f6', // blue-500
    borderRadius: 4,
  },
});

export default InsightsCard;