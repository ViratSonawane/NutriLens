// src/components/NutritionGridItem.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NutritionGridItem = ({ icon: Icon, label, value, unit, color }) => {
  return (
    <View style={[styles.card, { backgroundColor: color.bg, borderColor: color.border }]}>
      <Icon size={24} color={color.icon} style={{ marginBottom: 8 }} />
      <Text style={[styles.value, { color: color.text }]}>{value}{unit}</Text>
      <Text style={[styles.label, { color: color.subtext }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%', // Creates a two-column layout
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NutritionGridItem;