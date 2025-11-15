// src/components/QuickActions.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap } from 'lucide-react-native';

const QuickActions = ({ actions }) => (
  <View style={styles.card}>
    <View style={styles.sectionTitleContainer}>
      <Zap size={20} color="#475569" />
      <Text style={styles.sectionTitle}>Quick Actions</Text>
    </View>
    <View style={styles.grid}>
      {actions.map((action, index) => (
        <TouchableOpacity key={index} style={styles.actionCard}>
          <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
            <action.icon size={20} color="white" />
          </View>
          <Text style={styles.actionLabel}>{action.label}</Text>
          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e2d3b', marginLeft: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  actionIconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 14, fontWeight: '600', color: '#1e2d3b' },
  actionSubtitle: { fontSize: 12, color: '#64748b' },
});

export default QuickActions;