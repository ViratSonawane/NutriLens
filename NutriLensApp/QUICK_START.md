# Quick Start Guide - Firebase Integration

## 🚀 Quick Setup (5 Minutes)

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Add project"
- Name it "NutriLens"
- Enable Google Analytics (optional)

### 2. Enable Services
- **Authentication**: Enable Email/Password
- **Firestore**: Create database (test mode)
- **Storage**: Enable (test mode)

### 3. Add Android App
- Click Android icon in Firebase Console
- Package name: `com.nutrilensapp`
- Download `google-services.json`
- Place in `android/app/` directory

### 4. Add iOS App (if needed)
- Click iOS icon in Firebase Console
- Bundle ID: `com.nutrilensapp`
- Download `GoogleService-Info.plist`
- Add to `ios/NutriLensApp/` in Xcode

### 5. Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### 6. Set Up Security Rules
Copy rules from `FIREBASE_SETUP.md` to Firebase Console

### 7. Run the App
```bash
npm start
npm run android  # or npm run ios
```

## ✅ That's It!

Your app now has:
- ✅ User authentication
- ✅ Data storage
- ✅ Real-time synchronization
- ✅ Offline support

## 📝 Next Steps

1. Test registration and login
2. Complete BMI calculator setup
3. Add nutrition data
4. Verify data appears in Firebase Console

## 🔥 Your Flask Backend

Your Flask backend for image analysis still works! The app will:
1. Send images to Flask backend for analysis
2. Save results to Firebase
3. Display data in real-time

## 📚 Full Documentation

See `FIREBASE_SETUP.md` for detailed setup instructions.

## 🆘 Need Help?

1. Check `FIREBASE_SETUP.md` for detailed steps
2. Check Firebase Console for errors
3. Verify `google-services.json` is in correct location
4. Check that all services are enabled in Firebase Console

## 🎉 You're Ready!

Your NutriLens app is now powered by Firebase! 🚀

