import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { COLLECTIONS, USER_FIELDS, NUTRITION_FIELDS, STREAK_FIELDS, MEAL_FIELDS } from '../config/firebase';

// ==================== AUTHENTICATION ====================

export const authService = {
  // Register a new user
  register: async (email: string, password: string, name: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      await user.updateProfile({ displayName: name });
      
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .set({
          [USER_FIELDS.NAME]: name,
          [USER_FIELDS.EMAIL]: email,
          [USER_FIELDS.AGE]: 0,
          [USER_FIELDS.HEIGHT]: 0,
          [USER_FIELDS.WEIGHT]: 0,
          [USER_FIELDS.HAS_COMPLETED_SETUP]: false,
          [USER_FIELDS.TARGET_NUTRITION]: {
            calories: 2200,
            protein: 80,
            carbs: 275,
            fats: 73,
            water: 8,
          },
          [USER_FIELDS.CREATED_AT]: firestore.FieldValue.serverTimestamp(),
          [USER_FIELDS.UPDATED_AT]: firestore.FieldValue.serverTimestamp(),
        });
      
      return { user, uid: user.uid };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  login: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return { user: userCredential.user, uid: userCredential.user.uid };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  getCurrentUser: () => {
    return auth().currentUser;
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback);
  },
};

// ==================== USER PROFILE ====================

export const userService = {
  getUserProfile: async (userId: string) => {
    try {
      const doc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .get();
      
      if (!doc.exists) {
        throw new Error('User profile not found');
      }
      
      const data = doc.data();
      return { 
        id: doc.id, 
        name: data?.[USER_FIELDS.NAME] || '',
        email: data?.[USER_FIELDS.EMAIL] || '',
        age: data?.[USER_FIELDS.AGE] || 0,
        height: data?.[USER_FIELDS.HEIGHT] || 0,
        weight: data?.[USER_FIELDS.WEIGHT] || 0,
        hasCompletedSetup: data?.[USER_FIELDS.HAS_COMPLETED_SETUP] || false,
        targetNutrition: data?.[USER_FIELDS.TARGET_NUTRITION] || {
          calories: 2200,
          protein: 80,
          carbs: 275,
          fats: 73,
          water: 8,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user profile');
    }
  },

  updateUserProfile: async (userId: string, data: any) => {
    try {
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .set(
          {
            ...data,
            [USER_FIELDS.UPDATED_AT]: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user profile');
    }
  },

  completeSetup: async (userId: string, age: number, weight: number, height: number, targetNutrition: any) => {
    try {
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .set({
          [USER_FIELDS.AGE]: age,
          [USER_FIELDS.WEIGHT]: weight,
          [USER_FIELDS.HEIGHT]: height,
          [USER_FIELDS.TARGET_NUTRITION]: targetNutrition,
          [USER_FIELDS.HAS_COMPLETED_SETUP]: true,
          [USER_FIELDS.UPDATED_AT]: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete setup');
    }
  },
};

// ==================== NUTRITION TRACKING ====================

export const nutritionService = {
  getTodayNutrition: async (userId: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateKey = today.toISOString().split('T')[0];
      
      const doc = await firestore()
        .collection(COLLECTIONS.NUTRITION)
        .doc(`${userId}_${dateKey}`)
        .get();
      
      if (doc.exists()) {
        const data = doc.data();
        return {
          calories: data?.current?.calories || 0,
          protein: data?.current?.protein || 0,
          carbs: data?.current?.carbs || 0,
          fats: data?.current?.fats || 0,
          water: data?.current?.water || 0,
        };
      }
      
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        water: 0,
      };
    } catch (error: any) {
      console.error('Error getting nutrition:', error);
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        water: 0,
      };
    }
  },

  getTargetNutrition: async (userId: string) => {
    try {
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      return userData?.[USER_FIELDS.TARGET_NUTRITION] || {
        calories: 2200,
        protein: 80,
        carbs: 275,
        fats: 73,
        water: 8,
      };
    } catch (error: any) {
      console.error('Error getting target nutrition:', error);
      return {
        calories: 2200,
        protein: 80,
        carbs: 275,
        fats: 73,
        water: 8,
      };
    }
  },

  updateTargetNutrition: async (userId: string, nutrition: any) => {
    try {
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .set(
          {
            [USER_FIELDS.TARGET_NUTRITION]: nutrition,
            [USER_FIELDS.UPDATED_AT]: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update target nutrition');
    }
  },

  addNutrition: async (userId: string, nutrition: any) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateKey = today.toISOString().split('T')[0];
      const docRef = firestore()
        .collection(COLLECTIONS.NUTRITION)
        .doc(`${userId}_${dateKey}`);

      await docRef.set({
        [NUTRITION_FIELDS.USER_ID]: userId,
        [NUTRITION_FIELDS.DATE]: firestore.FieldValue.serverTimestamp(),
        [NUTRITION_FIELDS.CURRENT]: {
          calories: firestore.FieldValue.increment(nutrition.calories || 0),
          protein: firestore.FieldValue.increment(nutrition.protein || 0),
          carbs: firestore.FieldValue.increment(nutrition.carbs || 0),
          fats: firestore.FieldValue.increment(nutrition.fats || 0),
          water: firestore.FieldValue.increment(nutrition.water || 0),
        },
      }, { merge: true });

    } catch (error: any) {
      throw new Error(error.message || 'Failed to add nutrition');
    }
  },

  resetDailyNutrition: async (userId: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateKey = today.toISOString().split('T')[0];
      
      await firestore()
        .collection(COLLECTIONS.NUTRITION)
        .doc(`${userId}_${dateKey}`)
        .set({
          [NUTRITION_FIELDS.USER_ID]: userId,
          [NUTRITION_FIELDS.DATE]: firestore.FieldValue.serverTimestamp(),
          [NUTRITION_FIELDS.CURRENT]: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            water: 0,
          },
        }, { merge: true });
    } catch (error: any) {
      console.error('Error resetting nutrition:', error);
    }
  },

  subscribeToNutrition: (userId: string, callback: (nutrition: any) => void) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateKey = today.toISOString().split('T')[0];
    
    return firestore()
      .collection(COLLECTIONS.NUTRITION)
      .doc(`${userId}_${dateKey}`)
      .onSnapshot(
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            callback({
              calories: data?.current?.calories || 0,
              protein: data?.current?.protein || 0,
              carbs: data?.current?.carbs || 0,
              fats: data?.current?.fats || 0,
              water: data?.current?.water || 0,
            });
          } else {
            callback({
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
              water: 0,
            });
          }
        },
        (error) => {
          console.error("Error in nutrition snapshot listener: ", error);
          callback({
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            water: 0,
          });
        }
      );
  },
};

// ==================== STREAK TRACKING ====================

export const streakService = {
  getStreakData: async (userId: string) => {
    try {
      const doc = await firestore()
        .collection(COLLECTIONS.STREAKS)
        .doc(userId)
        .get();
      
      if (doc.exists()) {
        const data = doc.data();
        return {
          currentStreak: data?.[STREAK_FIELDS.CURRENT_STREAK] || 0,
          longestStreak: data?.[STREAK_FIELDS.LONGEST_STREAK] || 0,
          totalDays: data?.[STREAK_FIELDS.TOTAL_DAYS] || 0,
          activityHistory: data?.[STREAK_FIELDS.ACTIVITY_HISTORY] || Array(60).fill(0),
          startDate: data?.[STREAK_FIELDS.START_DATE] || new Date().toISOString(),
        };
      }
      
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        activityHistory: Array(60).fill(0),
        startDate: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Error getting streak data:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        activityHistory: Array(60).fill(0),
        startDate: new Date().toISOString(),
      };
    }
  },

  updateStreakData: async (userId: string, streakData: any) => {
    try {
      await firestore()
        .collection(COLLECTIONS.STREAKS)
        .doc(userId)
        .set({
          [STREAK_FIELDS.USER_ID]: userId,
          [STREAK_FIELDS.CURRENT_STREAK]: streakData.currentStreak || 0,
          [STREAK_FIELDS.LONGEST_STREAK]: streakData.longestStreak || 0,
          [STREAK_FIELDS.TOTAL_DAYS]: streakData.totalDays || 0,
          [STREAK_FIELDS.ACTIVITY_HISTORY]: streakData.activityHistory || Array(60).fill(0),
          [STREAK_FIELDS.START_DATE]: streakData.startDate || new Date().toISOString(),
          [STREAK_FIELDS.LAST_UPDATE]: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update streak data');
    }
  },

  initializeStreak: async (userId: string) => {
    try {
      await firestore()
        .collection(COLLECTIONS.STREAKS)
        .doc(userId)
        .set({
          [STREAK_FIELDS.USER_ID]: userId,
          [STREAK_FIELDS.CURRENT_STREAK]: 0,
          [STREAK_FIELDS.LONGEST_STREAK]: 0,
          [STREAK_FIELDS.TOTAL_DAYS]: 0,
          [STREAK_FIELDS.ACTIVITY_HISTORY]: Array(60).fill(0),
          [STREAK_FIELDS.START_DATE]: new Date().toISOString(),
          [STREAK_FIELDS.LAST_UPDATE]: firestore.FieldValue.serverTimestamp(),
          lastStreakUpdate: null,
        });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initialize streak');
    }
  },
  
  // ✅ FIXED VERSION - Uses correct collection structure
  updateStreakIfNeeded: async (userId: string) => {
    try {
      const streakRef = firestore().collection(COLLECTIONS.STREAKS).doc(userId);
      const streakDoc = await streakRef.get();
      
      // Initialize if doesn't exist
      if (!streakDoc.exists) {
        console.log('No streak document found, initializing...');
        await streakService.initializeStreak(userId);
        return;
      }

      const streakData = streakDoc.data();
      const lastUpdateDate = streakData?.lastStreakUpdate || null;
      const today = new Date().toISOString().split('T')[0];

      // Check if already updated today
      if (lastUpdateDate === today) {
        console.log('Streak already updated today');
        return;
      }

      console.log('Updating streak for new day:', today);

      // Get user's target nutrition
      const userDoc = await firestore().collection(COLLECTIONS.USERS).doc(userId).get();
      const userData = userDoc.data();
      const targetCalories = userData?.[USER_FIELDS.TARGET_NUTRITION]?.calories || 2000;

      // ✅ FIX: Get nutrition from correct collection (nutrition/{userId}_{date})
      const nutritionDocId = `${userId}_${today}`;
      const nutritionDoc = await firestore()
        .collection(COLLECTIONS.NUTRITION)
        .doc(nutritionDocId)
        .get();
      
      // ✅ FIX: Safely access nutrition data with proper null checks
      let currentCalories = 0;
      if (nutritionDoc.exists()) {
        const nutritionData = nutritionDoc.data();
        currentCalories = nutritionData?.current?.calories || 0;
      }

      // Calculate activity level
      const progress = targetCalories > 0 ? (currentCalories / targetCalories) * 100 : 0;
      
      let activityLevel = 0;
      if (progress >= 80) activityLevel = 4;
      else if (progress >= 60) activityLevel = 3;
      else if (progress >= 40) activityLevel = 2;
      else if (progress >= 20) activityLevel = 1;

      console.log(`Progress: ${progress.toFixed(1)}%, Activity Level: ${activityLevel}`);

      // Update activity history
      const currentHistory = streakData?.[STREAK_FIELDS.ACTIVITY_HISTORY] || Array(60).fill(0);
      const newHistory = [...currentHistory];

      if (newHistory.length >= 60) {
        newHistory.shift();
      }
      newHistory.push(activityLevel);

      // Calculate streak
      let currentStreak = 0;
      for (let i = newHistory.length - 1; i >= 0; i--) {
        if (newHistory[i] > 0) {
          currentStreak++;
        } else {
          break;
        }
      }

      const longestStreak = Math.max(streakData?.[STREAK_FIELDS.LONGEST_STREAK] || 0, currentStreak);
      const totalDays = newHistory.filter(level => level > 0).length;

      // Update Firestore
      await streakRef.update({
        [STREAK_FIELDS.CURRENT_STREAK]: currentStreak,
        [STREAK_FIELDS.LONGEST_STREAK]: longestStreak,
        [STREAK_FIELDS.TOTAL_DAYS]: totalDays,
        [STREAK_FIELDS.ACTIVITY_HISTORY]: newHistory,
        lastStreakUpdate: today,
        [STREAK_FIELDS.LAST_UPDATE]: firestore.FieldValue.serverTimestamp(),
      });

      console.log('✅ Streak updated:', { currentStreak, longestStreak, totalDays });
    } catch (error: any) {
      console.error('❌ Error updating streak:', error);
    }
  },
};

// ==================== MEAL HISTORY ====================

export const mealService = {
  addMeal: async (userId: string, meal: any) => {
    try {
      const mealRef = await firestore()
        .collection(COLLECTIONS.MEALS)
        .add({
          [MEAL_FIELDS.USER_ID]: userId,
          [MEAL_FIELDS.DATE]: firestore.FieldValue.serverTimestamp(),
          [MEAL_FIELDS.FOODS]: meal.foods || [],
          [MEAL_FIELDS.NUTRITION]: meal.nutrition || {},
          [MEAL_FIELDS.IMAGE_URL]: meal.imageUrl || '',
          [MEAL_FIELDS.CREATED_AT]: firestore.FieldValue.serverTimestamp(),
        });
      
      return mealRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add meal');
    }
  },

  getTodayMeals: async (userId: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const snapshot = await firestore()
        .collection(COLLECTIONS.MEALS)
        .where(MEAL_FIELDS.USER_ID, '==', userId)
        .where(MEAL_FIELDS.DATE, '>=', today)
        .where(MEAL_FIELDS.DATE, '<', tomorrow)
        .orderBy(MEAL_FIELDS.DATE, 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error('Error getting meals:', error);
      return [];
    }
  },

  getMealHistory: async (userId: string, limit: number = 30) => {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.MEALS)
        .where(MEAL_FIELDS.USER_ID, '==', userId)
        .orderBy(MEAL_FIELDS.DATE, 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error('Error getting meal history:', error);
      return [];
    }
  },
};

// ==================== STORAGE ====================

export const storageService = {
  uploadMealImage: async (userId: string, imageUri: string, mealId: string) => {
    try {
      const filename = `meals/${userId}/${mealId}_${Date.now()}.jpg`;
      const reference = storage().ref(filename);
      
      await reference.putFile(imageUri);
      const url = await reference.getDownloadURL();
      
      return url;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload image');
    }
  },

  deleteMealImage: async (imageUrl: string) => {
    try {
      const reference = storage().refFromURL(imageUrl);
      await reference.delete();
    } catch (error: any) {
      console.error('Failed to delete image:', error);
    }
  },
};