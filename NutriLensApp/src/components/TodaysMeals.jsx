// src/components/TodaysMeals.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Coffee, Plus, Clock } from 'lucide-react-native';

const TodaysMeals = ({ meals }) => {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Coffee size={20} color="#475569" />
          <Text style={styles.titleText}>Today's Meals</Text>
        </View>
        <TouchableOpacity>
          <Plus size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {meals.map((meal, index) => (
        <View key={index} style={[styles.mealRow, meal.pending && styles.pendingMealRow]}>
          <View style={styles.mealLeft}>
            <View style={[styles.emojiContainer, meal.pending && styles.pendingEmojiContainer]}>
              <Text style={styles.emoji}>{meal.emoji}</Text>
            </View>
            <View>
              <Text style={[styles.mealName, meal.pending && styles.pendingText]}>
                {meal.pending ? 'Add your snack' : meal.name}
              </Text>
              <View style={styles.timeContainer}>
                <Clock size={12} color="#64748b" />
                <Text style={styles.timeText}>{meal.time}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.calorieBadge, meal.pending && styles.pendingCalorieBadge]}>
            <Text style={[styles.calorieText, meal.pending && styles.pendingText]}>
              {meal.pending ? '+' : `${meal.calories} kcal`}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleLeft: { flexDirection: 'row', alignItems: 'center' },
  titleText: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },
  mealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: '#f8fafc' },
  pendingMealRow: { backgroundColor: '#f1f5f9', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  mealLeft: { flexDirection: 'row', alignItems: 'center' },
  emojiContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0' },
  pendingEmojiContainer: { backgroundColor: '#e2e8f0', borderWidth: 0 },
  emoji: { fontSize: 20 },
  mealName: { fontWeight: '600', color: '#1e293b' },
  timeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  timeText: { fontSize: 12, color: '#64748b', marginLeft: 4 },
  calorieBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0' },
  pendingCalorieBadge: { backgroundColor: '#e2e8f0', borderWidth: 0 },
  calorieText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  pendingText: { color: '#94a3b8' },
});

export default TodaysMeals;