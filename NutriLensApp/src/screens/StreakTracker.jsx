import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Flame, CalendarDays, Sparkles } from 'lucide-react-native';
import { useAuth } from '../context/UserContext';

const StreakTracker = () => {
  const { streakData, updateDailyActivity } = useAuth();

  useEffect(() => {
    updateDailyActivity();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconContainer}>
                  <CalendarDays size={24} color="white" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Tracking Streak</Text>
                  <Text style={styles.headerSubtitle}>Keep your consistency high</Text>
                </View>
              </View>

            </View>

            <View style={styles.body}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{streakData.currentStreak}</Text>
                  <Text style={styles.statLabel}>Day streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{streakData.totalDays}</Text>
                  <Text style={styles.statLabel}>Active days</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{streakData.longestStreak}</Text>
                  <Text style={styles.statLabel}>Best streak</Text>
                </View>
              </View>

              <View style={styles.calendarGrid}>
                {streakData.activityHistory.map((level, i) => (
                  <View
                    key={i}
                    style={[
                      styles.daySquare,
                      { backgroundColor: getColor(level) },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSquare, { backgroundColor: '#e2e8f0' }]} />
                  <Text style={styles.legendText}>None</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSquare, { backgroundColor: '#bfdbfe' }]} />
                  <Text style={styles.legendText}>Low</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSquare, { backgroundColor: '#93c5fd' }]} />
                  <Text style={styles.legendText}>Medium</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSquare, { backgroundColor: '#60a5fa' }]} />
                  <Text style={styles.legendText}>Good</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendSquare, { backgroundColor: '#3b82f6' }]} />
                  <Text style={styles.legendText}>Great</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  body: {
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 24,
  },
  daySquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSquare: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default StreakTracker;
