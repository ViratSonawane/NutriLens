# Firebase Setup Guide for NutriLens

This guide will help you set up Firebase for your NutriLens app.

## Prerequisites

- Firebase account (free tier is sufficient)
- React Native development environment set up
- Android Studio / Xcode installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter project name: "NutriLens" (or your preferred name)
4. Enable Google Analytics (optional, recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose a location (select closest to your users)
5. Click **Enable**

### Set up Firestore Security Rules

Go to **Firestore Database** → **Rules** and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Nutrition collection - users can read/write their own data
    match /nutrition/{document=**} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Meals collection - users can read/write their own data
    match /meals/{mealId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Streaks collection - users can read/write their own data
    match /streaks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 4: Enable Storage (for meal images)

1. In Firebase Console, go to **Storage**
2. Click **Get Started**
3. Start in test mode (for development)
4. Choose same location as Firestore
5. Click **Done**

### Set up Storage Security Rules

Go to **Storage** → **Rules** and update with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /meals/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 5: Add Android App to Firebase

1. In Firebase Console, click the Android icon (or **Add app** → **Android**)
2. Register your app:
   - **Android package name**: `com.nutrilensapp` (check your `android/app/build.gradle` for actual package name)
   - **App nickname**: NutriLens Android (optional)
   - **Debug signing certificate SHA-1**: (optional for now)
3. Click **Register app**
4. Download `google-services.json`
5. Place `google-services.json` in `android/app/` directory

### Update Android Build Files

1. **android/build.gradle** - Add to the `dependencies` section:
```gradle
dependencies {
    // ... existing dependencies
    classpath 'com.google.gms:google-services:4.4.0'
}
```

2. **android/app/build.gradle** - Add at the bottom:
```gradle
apply plugin: 'com.google.gms.google-services'
```

## Step 6: Add iOS App to Firebase

1. In Firebase Console, click the iOS icon (or **Add app** → **iOS**)
2. Register your app:
   - **iOS bundle ID**: `com.nutrilensapp` (check your `ios/NutriLensApp.xcodeproj` for actual bundle ID)
   - **App nickname**: NutriLens iOS (optional)
3. Click **Register app**
4. Download `GoogleService-Info.plist`
5. Open Xcode and drag `GoogleService-Info.plist` into your `ios/NutriLensApp/` directory
6. Make sure "Copy items if needed" is checked

### Update iOS Podfile

1. Open `ios/Podfile`
2. Make sure it has:
```ruby
platform :ios, '13.0'
```

3. Run:
```bash
cd ios
pod install
cd ..
```

## Step 7: Install Native Dependencies

For Android, the dependencies are already installed via npm.

For iOS, you need to run:
```bash
cd ios
pod install
cd ..
```

## Step 8: Update App Configuration

The Firebase configuration is automatically read from:
- Android: `google-services.json`
- iOS: `GoogleService-Info.plist`

No code changes needed! The React Native Firebase SDK automatically reads these files.

## Step 9: Test the Setup

1. Start Metro bundler:
```bash
npm start
```

2. Run on Android:
```bash
npm run android
```

3. Run on iOS:
```bash
npm run ios
```

## Step 10: Verify Firebase Connection

1. Try registering a new user in the app
2. Check Firebase Console → Authentication → Users (should see new user)
3. Check Firestore Database → Data (should see user document in `users` collection)

## Troubleshooting

### Android Issues

1. **Build fails with "google-services.json not found"**
   - Make sure `google-services.json` is in `android/app/` directory
   - Clean and rebuild: `cd android && ./gradlew clean && cd ..`

2. **Authentication not working**
   - Check that Email/Password is enabled in Firebase Console
   - Verify `google-services.json` is correctly placed

### iOS Issues

1. **Build fails**
   - Run `cd ios && pod install && cd ..`
   - Clean build folder in Xcode (Product → Clean Build Folder)

2. **Authentication not working**
   - Check that Email/Password is enabled in Firebase Console
   - Verify `GoogleService-Info.plist` is in the project

### General Issues

1. **Firestore permission denied**
   - Check Firestore security rules
   - Make sure user is authenticated

2. **Storage upload fails**
   - Check Storage security rules
   - Verify Storage is enabled in Firebase Console

## Next Steps

1. Set up Firebase Cloud Functions (optional, for image analysis backend)
2. Configure Firebase Analytics (optional)
3. Set up Firebase Crashlytics (optional, for error tracking)
4. Configure production security rules (before releasing to production)

## Production Checklist

Before releasing to production:

- [ ] Update Firestore security rules for production
- [ ] Update Storage security rules for production
- [ ] Enable App Check (for security)
- [ ] Set up Firebase Cloud Functions for image analysis
- [ ] Configure proper indexes in Firestore
- [ ] Set up monitoring and alerts
- [ ] Test authentication flow thoroughly
- [ ] Test data synchronization across devices

## Support

For issues:
1. Check [React Native Firebase Documentation](https://rnfirebase.io/)
2. Check [Firebase Documentation](https://firebase.google.com/docs)
3. Check Firebase Console for error logs

