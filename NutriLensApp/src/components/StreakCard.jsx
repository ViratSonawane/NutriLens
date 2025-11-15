import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame, CalendarDays } from 'lucide-react-native';
import { useAuth } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

const StreakCard = () => {
  const { streakData } = useAuth();
  const navigation = useNavigation();

  const getColor = (level) => {
    switch (level) {
      case 0:
        return '#e2e8f0';
      case 1:
        return '#bfdbfe';
      case 2:
        return '#93c5fd';
      case 3:
        return '#60a5fa';
      case 4:
        return '#3b82f6';
      default:
        return '#e2e8f0';
    }
  };

  // Get last 7 days for compact view
  const recentActivity = streakData.activityHistory.slice(-7);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Streaks')}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Flame size={20} color="#f97316" />
          <Text style={styles.title}>Streak</Text>
        </View>
        <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
      </View>

      <View style={styles.calendarGrid}>
        {recentActivity.map((level, index) => (
          <View
            key={index}
            style={[
              styles.daySquare,
              { backgroundColor: getColor(level) },
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <CalendarDays size={14} color="#64748b" />
        <Text style={styles.footerText}>
          {streakData.totalDays} active days
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 4,
  },
  daySquare: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
  },
});

export default StreakCard;

