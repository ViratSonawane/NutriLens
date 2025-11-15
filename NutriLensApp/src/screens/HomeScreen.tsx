import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Star, Target, Droplets, Activity, Apple, ChevronRight, Search, Plus, Eye, Utensils, TrendingUp, Award, Leaf, Coffee, Zap, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Import all your custom components
import Header from '../components/Header';
import DailyProgressCard from '../components/DailyProgressCard';
import InsightsCard from '../components/InsightsCard';
import NutritionCard from '../components/NutritionCard';
import TodaysMeals from '../components/TodaysMeals';
import QuickActions from '../components/QuickActions';
import AIInsights from '../components/AIInsights';
import AnalysisModal from '../components/AnalysisModal';
import StreakCard from '../components/StreakCard';
import { useAuth } from '../context/UserContext';

// This is the "shape" of the data the modal will send back
interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const HomeScreen = () => {
  // --- GET VALUES FROM CONTEXT ---
  const { targetNutrition, currentNutrition, addNutrition, getCurrentDay, updateDailyActivity, logout } = useAuth();
 const navigation = useNavigation<any>(); // <-- FIX: Add <any>

  // --- STATE VARIABLES ---
  const [isModalVisible, setModalVisible] = useState(false);

  // Update daily activity when component mounts
  useEffect(() => {
    updateDailyActivity();
  }, []);
  
  // Calculate personalized recommendations based on actual nutrition data
  const getPersonalRecommendations = () => {
    const recommendations = [];
    
    // Protein recommendation
    const proteinRemaining = targetNutrition.protein - currentNutrition.protein;
    const proteinPercentage = Math.round((currentNutrition.protein / targetNutrition.protein) * 100);
    if (proteinRemaining > 0) {
      recommendations.push({
        title: proteinPercentage >= 80 ? "Protein Target Almost Reached" : "Boost Your Protein",
        subtitle: `Add ${Math.round(proteinRemaining)}g more`,
        icon: Target,
        urgent: proteinRemaining > 20,
      });
    } else if (proteinPercentage >= 100) {
      recommendations.push({
        title: "Protein Goal Achieved!",
        subtitle: "Great job on meeting your target",
        icon: Target,
        urgent: false,
      });
    }
    
    // Water recommendation
    const waterRemaining = targetNutrition.water - currentNutrition.water;
    const waterPercentage = Math.round((currentNutrition.water / targetNutrition.water) * 100);
    if (waterRemaining > 0) {
      recommendations.push({
        title: waterPercentage >= 75 ? "Excellent Hydration Progress" : "Stay Hydrated",
        subtitle: `${waterPercentage}% complete - ${waterRemaining} glasses left`,
        icon: Droplets,
        urgent: waterRemaining > 3,
      });
    } else {
      recommendations.push({
        title: "Hydration Goal Achieved!",
        subtitle: "You've met your water intake target",
        icon: Droplets,
        urgent: false,
      });
    }
    
    // Calories recommendation
    const caloriesRemaining = targetNutrition.calories - currentNutrition.calories;
    const caloriesPercentage = Math.round((currentNutrition.calories / targetNutrition.calories) * 100);
    if (Math.abs(caloriesRemaining) > 100) {
      if (caloriesRemaining > 0) {
        recommendations.push({
          title: "Calories Remaining",
          subtitle: `${Math.round(caloriesRemaining)} kcal left to reach your goal`,
          icon: Activity,
          urgent: caloriesRemaining > 500,
        });
      } else {
        recommendations.push({
          title: "Calorie Goal Exceeded",
          subtitle: `You're ${Math.abs(Math.round(caloriesRemaining))} kcal over your target`,
          icon: Activity,
          urgent: true,
        });
      }
    }
    
    return recommendations.slice(0, 2); // Return top 2 recommendations
  };
  
  const personalRecommendations = getPersonalRecommendations();
  const todaysMeals = [{ name: 'Masala Chai', time: '8:30 AM', calories: 320, emoji: '☕' }, { name: 'Rajma Rice Bowl', time: '1:15 PM', calories: 485, emoji: '🍚' }, { name: 'Add your snack', time: '5:00 PM', calories: 0, pending: true, emoji: '🥨' }];
  const quickActions = [{ icon: Search, label: 'Food Search', subtitle: 'Find nutrition data', color: '#475569' }, { icon: Plus, label: 'Manual Entry', subtitle: 'Quick add meals', color: '#4f46e5' }, { icon: Eye, label: 'Barcode Scan', subtitle: 'Packaged items', color: '#7c3aed' }, { icon: Utensils, label: 'Meal Planner', subtitle: 'Smart suggestions', color: '#059669' }];
  const insights = [{ text: "You're 180 kcal ahead of yesterday", icon: TrendingUp, color: '#ecfdf5', iconColor: '#059669' }, { text: "Protein intake improved by 15%", icon: Award, color: '#eff6ff', iconColor: '#2563eb' }, { text: "Consider adding leafy greens", icon: Leaf, color: '#f5f3ff', iconColor: '#7c3aed' }];

  // --- HANDLER FUNCTIONS ---
  
  // This function is passed to the modal
  // The modal will call this function when analysis is complete
  const handleAnalysisComplete = async (mealData: { foods: string[], nutrition: NutritionData }) => {
    try {
      // Pass the full meal object (foods list + nutrition object)
      await addNutrition(mealData.nutrition); 

      // Update activity after adding nutrition
      await updateDailyActivity();

      setModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Failed to add meal:", error);
      Alert.alert("Error", "Could not save your meal. Please try again.");
      setModalVisible(false);
    }
  };

  // The camera button now just opens the modal
  const handleChoosePhoto = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView with the sticky progress card */}
      <ScrollView style={{flex: 1}} stickyHeaderIndices={[1]} overScrollMode="never">
        
        {/* Item 0: The header that scrolls away */}
        <Header onPressCameraButton={handleChoosePhoto} />
        
        {/* Item 1: The DailyProgressCard that sticks */}
        <DailyProgressCard
          current={currentNutrition.calories}
          target={targetNutrition.calories}
          unit="kcal"
          day={getCurrentDay()}
        />

        {/* This View holds all the other content */}
        <View style={styles.mainContent}>
          {/* Streak Card */}
          <View style={styles.section}>
            <StreakCard />
          </View>

          {/* Nutrition Overview Section */}
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Nutrition Overview</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </View>
            <View style={styles.grid}>
              <View style={styles.gridItem}><NutritionCard label="Protein" current={currentNutrition.protein} target={targetNutrition.protein} unit="g" icon={Activity} color={{ bg: '#eff6ff', icon: '#2563eb', ring: '#3b82f6' }} /></View>
              <View style={styles.gridItem}><NutritionCard label="Carbs" current={currentNutrition.carbs} target={targetNutrition.carbs} unit="g" icon={Apple} color={{ bg: '#f5f3ff', icon: '#7c3aed', ring: '#8b5cf6' }} /></View>
              <View style={styles.gridItem}><NutritionCard label="Fats" current={currentNutrition.fats} target={targetNutrition.fats} unit="g" icon={Droplets} color={{ bg: '#ecfdf5', icon: '#059669', ring: '#10b981' }} /></View>
              <View style={styles.gridItem}><NutritionCard label="Water" current={currentNutrition.water} target={targetNutrition.water} unit=" glasses" icon={Droplets} color={{ bg: '#ecfeff', icon: '#0891b2', ring: '#06b6d4' }} /></View>
            </View>
          </View>

           {/* Personalized Insights Section */}
           <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Star size={20} color="#4f46e5" />
                <Text style={styles.sectionTitle}>Personalized Insights</Text>
              </View>
            </View>
            {personalRecommendations.map((item, index) => ( <InsightsCard key={index} insight={item} /> ))}
          </View>

          {/* Today's Meals Section */}
          <View style={styles.section}>
            <TodaysMeals meals={todaysMeals} />
          </View>

          {/* Quick Actions Section */}
          <View style={styles.section}>
            <QuickActions actions={quickActions} />
          </View>

          {/* AI Insights Section */}
          <View style={styles.section}>
            <AIInsights insights={insights} />
          </View>

          {/* --- My Profile Button --- */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile' as any)}
          style={{
            backgroundColor: "#4f46e5", // Indigo color from your header
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            marginBottom: 24,
            shadowColor: "#4f46e5",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            My Profile
          </Text>
        </TouchableOpacity>
        {/* --- End of Profile Button --- */}
        </View>
      </ScrollView>

      {/* The Modal is rendered here, but is invisible */}
      <AnalysisModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        onAnalysisComplete={handleAnalysisComplete} // Pass the handler function
      />
    </SafeAreaView>
  );
};

// --- FINAL STYLESHEET ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#4f46e5' // Dark background for sticky header
  },
  mainContent: { 
    padding: 24, 
    backgroundColor: '#f1f5f9' 
  },
  section: { 
    marginBottom: 16 
  },
  sectionTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginLeft: 8 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  gridItem: { 
    width: '48%', 
    marginBottom: 16 
  },
});

export default HomeScreen;

