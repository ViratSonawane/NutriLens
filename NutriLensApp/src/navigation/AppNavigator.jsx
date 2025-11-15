import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/UserContext';

import HomeScreen from '../screens/HomeScreen';
import LoginPage from '../screens/LoginPage';
import RegisterPage from '../screens/RegisterPage';
import ProfilePage from '../screens/ProfilePage';
import BMICalculator from '../screens/BMICalculator';
import StreakTracker from '../screens/StreakTracker';

const Stack = createNativeStackNavigator();

const SetupStack = () => (
  <Stack.Navigator
    initialRouteName="BMI"
    screenOptions={{
      headerStyle: { backgroundColor: '#1e293b' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="BMI"
      component={BMICalculator}
      options={{
        title: 'Set Up Your Profile',
        headerBackVisible: false,
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: { backgroundColor: '#1e293b' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfilePage} options={{ title: 'My Profile' }} />
    <Stack.Screen name="Streaks" component={StreakTracker} options={{ title: 'My Streaks' }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { isAuthenticated, hasCompletedSetup } = useAuth();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : hasCompletedSetup ? (
        // Key forces a remount when setup state changes
        <MainStack key="app" />
      ) : (
        <SetupStack key="setup" />
      )}
    </NavigationContainer>
  );
}
