import React, { createContext, useContext, useMemo, useState, useEffect, useRef } from 'react';
import { authService, userService, nutritionService, streakService, mealService } from '../services/firebaseService';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type TargetNutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
};

type CurrentNutrition = TargetNutrition;

type UserProfile = {
  name: string;
  email: string;
  age: number;
  height: number; // cm
  weight: number; // kg
} | null;

type StreakData = {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  activityHistory: number[]; // Array of activity levels (0-4) for last 60 days
  startDate: string; // ISO date string when user started
};

type AuthContextType = {
  isAuthenticated: boolean;
  isNewUser: boolean;
  hasCompletedSetup: boolean;
  userProfile: UserProfile;
  targetNutrition: TargetNutrition;
  currentNutrition: CurrentNutrition;
  streakData: StreakData;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addNutrition: (nutritionData: Partial<CurrentNutrition>) => Promise<void>;
  calculateNutritionRequirements: (age: number, weight: number, height: number, activityLevel?: string) => TargetNutrition;
  updateNutritionRequirements: (nutritionData: Partial<TargetNutrition>) => Promise<void>;
  completeSetup: (age: number, weight: number, height: number) => Promise<void>;
  updateDailyActivity: () => Promise<void>;
  getCurrentDay: () => number;
  loading: boolean;
};

// undefined default lets us detect missing provider
const UserContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [loading, setLoading] = useState(true);

  const [targetNutrition, setTargetNutrition] = useState<TargetNutrition>({
    calories: 2200,
    protein: 80,
    carbs: 275,
    fats: 73,
    water: 8,
  });

  const [currentNutrition, setCurrentNutrition] = useState<CurrentNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    water: 0,
  });

  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    activityHistory: Array(60).fill(0),
    startDate: new Date().toISOString(),
  });

  // Ref to store nutrition unsubscribe function
  const nutritionUnsubscribeRef = useRef<(() => void) | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      // Clean up previous nutrition subscription
      if (nutritionUnsubscribeRef.current) {
        nutritionUnsubscribeRef.current();
        nutritionUnsubscribeRef.current = null;
      }

      if (user) {
        setIsAuthenticated(true);
        const unsubscribeNutrition = await loadUserData(user.uid);
        nutritionUnsubscribeRef.current = unsubscribeNutrition;
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
        setCurrentNutrition({ calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 });
        setStreakData({
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          activityHistory: Array(60).fill(0),
          startDate: new Date().toISOString(),
        });
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (nutritionUnsubscribeRef.current) {
        nutritionUnsubscribeRef.current();
      }
    };
  }, []);

  // Load user data from Firestore
  const loadUserData = async (userId: string): Promise<(() => void) | null> => {
    try {
      setLoading(true);
      
      // Load user profile
      const profile = await userService.getUserProfile(userId);
      setUserProfile({
        name: profile.name,
        email: profile.email,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
      });
      setHasCompletedSetup(profile.hasCompletedSetup);
      setIsNewUser(!profile.hasCompletedSetup);
      setTargetNutrition(profile.targetNutrition);

      // Load today's nutrition
      const todayNutrition = await nutritionService.getTodayNutrition(userId);
      setCurrentNutrition(todayNutrition);

      // Load streak data
      const streak = await streakService.getStreakData(userId);
      setStreakData(streak);

      // Subscribe to real-time nutrition updates
      const unsubscribeNutrition = nutritionService.subscribeToNutrition(userId, (nutrition) => {
        setCurrentNutrition(nutrition);
      });

      setLoading(false);
      return unsubscribeNutrition;
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
      return null;
    }
  };

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const calculateBMR = (age: number, weight: number, height: number, isMale: boolean = true): number => {
    if (isMale) {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure) based on activity level
  const calculateTDEE = (bmr: number, activityLevel: string = 'moderate'): number => {
    const multipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    return Math.round(bmr * (multipliers[activityLevel] || multipliers.moderate));
  };

  // Calculate nutrition requirements based on age, weight, height
  const calculateNutritionRequirements = (
    age: number,
    weight: number,
    height: number,
    activityLevel: string = 'moderate'
  ): TargetNutrition => {
    const bmr = calculateBMR(age, weight, height);
    const tdee = calculateTDEE(bmr, activityLevel);

    const protein = Math.round(weight * 1.8);
    const fatCalories = Math.round(tdee * 0.275);
    const fats = Math.round(fatCalories / 9);
    const proteinCalories = protein * 4;
    const carbCalories = tdee - proteinCalories - fatCalories;
    const carbs = Math.round(carbCalories / 4);
    const water = Math.max(8, Math.round((weight * 35) / 250));

    return {
      calories: tdee,
      protein,
      carbs,
      fats,
      water,
    };
  };

  // Get current day count
  const getCurrentDay = (): number => {
    if (!streakData.startDate) return 1;
    const start = new Date(streakData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays + 1);
  };

  // Update daily activity
const updateDailyActivity = async () => {
  try {
    const user = authService.getCurrentUser();
    if (!user) return;

    await streakService.updateStreakIfNeeded(user.uid);
    
    // Reload streak data to update UI
    const updatedStreak = await streakService.getStreakData(user.uid);
    setStreakData(updatedStreak);
  } catch (error) {
    console.error('Error updating daily activity:', error);
  }
};

  const login = async (email: string, password: string) => {
    try {
      const { uid } = await authService.login(email, password);
      await loadUserData(uid);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { uid } = await authService.register(email, password, name);
      setIsNewUser(true);
      setHasCompletedSetup(false);
      await streakService.initializeStreak(uid);
      await loadUserData(uid);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const updateNutritionRequirements = async (nutritionData: Partial<TargetNutrition>) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const updated = { ...targetNutrition, ...nutritionData };
      setTargetNutrition(updated);
      await nutritionService.updateTargetNutrition(user.uid, updated);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update nutrition requirements');
    }
  };

  const completeSetup = async (age: number, weight: number, height: number) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const userId = user.uid;
      const nutrition = calculateNutritionRequirements(age, weight, height);
      
      await userService.completeSetup(userId, age, weight, height, nutrition);
      setTargetNutrition(nutrition);
      setHasCompletedSetup(true);
      setIsNewUser(false);
      
      // Update user profile state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          age,
          weight,
          height,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete setup');
    }
  };

  const addNutrition = async (nutritionData: Partial<CurrentNutrition>) => {
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // 1. Add the nutrition to the daily total (This is what you want)
      await nutritionService.addNutrition(user.uid, nutritionData);
      
      // 2. We've removed the 'mealService.addMeal' call that was failing

      // 3. Update local state for immediate UI feedback
      setCurrentNutrition(prev => ({
        calories: prev.calories + (nutritionData.calories ?? 0),
        protein: prev.protein + (nutritionData.protein ?? 0),
        carbs: prev.carbs + (nutritionData.carbs ?? 0),
        fats: prev.fats + (nutritionData.fats ?? 0),
        water: prev.water + (nutritionData.water ?? 0),
      }));
      
      // 4. Update activity when nutrition is added
      await updateDailyActivity();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add nutrition');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setIsNewUser(false);
      setHasCompletedSetup(false);
      setUserProfile(null);
      setCurrentNutrition({ calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 });
      setStreakData({
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        activityHistory: Array(60).fill(0),
        startDate: new Date().toISOString(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      isNewUser,
      hasCompletedSetup,
      userProfile,
      targetNutrition,
      currentNutrition,
      streakData,
      login,
      register,
      logout,
      addNutrition,
      calculateNutritionRequirements,
      updateNutritionRequirements,
      completeSetup,
      updateDailyActivity,
      getCurrentDay,
      loading,
    }),
    [isAuthenticated, isNewUser, hasCompletedSetup, userProfile, targetNutrition, currentNutrition, streakData, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useAuth must be used within a UserProvider');
  return ctx;
};
