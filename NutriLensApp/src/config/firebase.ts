// Firebase configuration
// Note: React Native Firebase automatically reads configuration from:
// - Android: google-services.json
// - iOS: GoogleService-Info.plist
// No manual initialization needed!

// Collection names in Firestore
export const COLLECTIONS = {
  USERS: 'users',
  NUTRITION: 'nutrition',
  MEALS: 'meals',
  STREAKS: 'streaks',
} as const;

// Firestore field names
export const USER_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  AGE: 'age',
  HEIGHT: 'height',
  WEIGHT: 'weight',
  HAS_COMPLETED_SETUP: 'hasCompletedSetup',
  TARGET_NUTRITION: 'targetNutrition',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const NUTRITION_FIELDS = {
  TARGET: 'target',
  CURRENT: 'current',
  DATE: 'date',
  USER_ID: 'userId',
} as const;

export const STREAK_FIELDS = {
  USER_ID: 'userId',
  CURRENT_STREAK: 'currentStreak',
  LONGEST_STREAK: 'longestStreak',
  TOTAL_DAYS: 'totalDays',
  ACTIVITY_HISTORY: 'activityHistory',
  START_DATE: 'startDate',
  LAST_UPDATE: 'lastUpdate',
} as const;

export const MEAL_FIELDS = {
  USER_ID: 'userId',
  DATE: 'date',
  FOODS: 'foods',
  NUTRITION: 'nutrition',
  IMAGE_URL: 'imageUrl',
  CREATED_AT: 'createdAt',
} as const;
