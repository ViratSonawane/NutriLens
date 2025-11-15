// src/components/AIInsights.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';

const AIInsights = ({ insights }) => (
  <View style={styles.card}>
    <View style={styles.sectionTitleContainer}>
      <Sparkles size={20} color="#475569" />
      <Text style={styles.sectionTitle}>AI Insights</Text>
    </View>
    {insights.map((insight, index) => (
      <View key={index} style={[styles.insightRow, { backgroundColor: insight.color }]}>
        <insight.icon size={16} color={insight.iconColor} style={{ marginRight: 8 }} />
        <Text style={styles.insightText}>{insight.text}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e2d3b', marginLeft: 8 },
  insightRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8 },
  insightText: { color: '#334155', fontWeight: '500' },
});

export default AIInsights;