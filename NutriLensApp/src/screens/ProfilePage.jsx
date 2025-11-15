// src/screens/ProfilePage.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet, // <-- Added StyleSheet
} from "react-native";
import { User, Edit3, Calendar, Heart, TrendingUp, LogOut, Ruler, Weight } from "lucide-react-native";
import { useAuth } from "../context/UserContext"; // Import the "Global Brain"

const ProfilePage = () => {
  // Get data and logout function from the global context
  const { userProfile, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Siddhesh Shinde",
    age: 21,
    weight: 68,
    height: 173,
    goal: "Muscle Gain",
  });

  // Load profile data from context when the component mounts
  useEffect(() => {
    if (userProfile) {
      setProfile({
        name: userProfile.name || "Siddhesh Shinde",
        age: userProfile.age || 21,
        weight: userProfile.weight || 68,
        height: userProfile.height || 173,
        goal: "Muscle Gain", // We removed the userProfile.goal bug
      });
    }
  }, [userProfile]);

  // Use this handler for React Native's TextInput
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    // In a real app, you would save this new 'profile' object
    // back to your global context or backend.
    // For now, we just stop editing.
    setEditing(false);
  };

  const calculateBMI = () => {
    if (!profile.height || !profile.weight) return "0";
    const hMeters = profile.height / 100;
    const bmi = profile.weight / (hMeters * hMeters);
    return bmi.toFixed(1);
  };

  const bmi = parseFloat(calculateBMI());

  // --- STYLING FIX ---
  // Updated to return style objects instead of Tailwind class names
  const bmiStatus =
    bmi < 18.5
      ? { label: "Underweight", style: { color: "#3b82f6", backgroundColor: "#eff6ff" } }
      : bmi < 25
      ? { label: "Normal", style: { color: "#059669", backgroundColor: "#ecfdf5" } }
      : bmi < 30
      ? { label: "Overweight", style: { color: "#d97706", backgroundColor: "#fffbeb" } }
      : { label: "Obese", style: { color: "#dc2626", backgroundColor: "#fef2f2" } };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.userIconContainer}>
                  <User width={32} height={32} color="white" />
                </View>
                <View>
                  <Text style={styles.userName}>{profile.name}</Text>
                  <Text style={styles.userGoal}>Goal: {profile.goal}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setEditing(!editing)}
                style={styles.editButton}
              >
                <Edit3 width={16} height={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Basic Info */}
            <View style={styles.infoGrid}>
              <View style={[styles.infoCard, { width: '48%' }]}>
                <Calendar style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{profile.age}</Text>
              </View>
              <View style={[styles.infoCard, { width: '48%' }]}>
                <Ruler style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>{profile.height} cm</Text>
              </View>
              <View style={[styles.infoCard, { width: '48%' }]}>
                <Weight style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{profile.weight} kg</Text>
              </View>
              <View style={[styles.infoCard, { width: '48%' }]}>
                <Heart style={styles.infoIcon} />
                <Text style={styles.infoLabel}>BMI</Text>
                {/* --- STYLING FIX --- */}
                {/* Updated to use array of styles */}
                <Text style={[styles.infoValue, bmiStatus.style, styles.bmiBadge]}>
                  {bmi} ({bmiStatus.label})
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <TrendingUp style={styles.progressIcon} />
                <Text style={styles.progressTitle}>Progress Overview</Text>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>+5 kg</Text>
                  <Text style={styles.progressLabel}>Muscle gain</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>87%</Text>
                  <Text style={styles.progressLabel}>Goal completion</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>24 days</Text>
                  <Text style={styles.progressLabel}>Active streak</Text>
                </View>
              </View>
            </View>

            {/* Edit Mode */}
            {editing && (
              <View style={styles.editForm}>
                {["name", "age", "weight", "height", "goal"].map((field) => (
                  <View key={field}>
                    <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                    <TextInput
                      keyboardType={field === "age" || field === "weight" || field === "height" ? "numeric" : "default"}
                      value={String(profile[field])}
                      onChangeText={(value) => handleChange(field, value)}
                      style={styles.textInput}
                    />
                  </View>
                ))}
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Logout */}
            <TouchableOpacity
              onPress={logout}
              style={styles.logoutButton}
            >
              <LogOut style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLING FIX ---
// Added the complete StyleSheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f5f9', // slate-50
  },
  container: {
    backgroundColor: 'white',
    maxWidth: 448, // max-w-md
    width: '100%',
    borderBottomLeftRadius: 24, // rounded-b-3xl
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0', // border-slate-200
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#4f46e5', // Replaced blue-600 with your app's indigo
    padding: 24,
    position: 'relative',
  },
  headerContent: {
    position: 'relative',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16, // rounded-2xl
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
    color: 'white',
  },
  userGoal: {
    color: '#e0e7ff', // slate-200 (adjusted for indigo)
    fontSize: 14, // text-sm
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 8,
    borderRadius: 12, // rounded-xl
  },
  body: {
    padding: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12, // Adjusted for space-y-5
  },
  infoCard: {
    backgroundColor: '#f8fafc', // slate-50
    padding: 16,
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    borderColor: '#e2e8f0', // border-slate-200
    marginBottom: 16, // w-[48%] mb-4
  },
  infoIcon: {
    width: 16,
    height: 16,
    color: '#64748b', // text-slate-500
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12, // text-xs
    color: '#64748b', // text-slate-500
  },
  infoValue: {
    fontWeight: '600', // font-semibold
    color: '#1e293b', // text-slate-800
  },
  bmiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden', // Fix for background color
    alignSelf: 'flex-start', // Fit content
    fontSize: 12,
  },
  progressCard: {
    backgroundColor: '#f8fafc', // slate-50
    borderRadius: 16, // rounded-2xl
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressIcon: {
    width: 20,
    height: 20,
    color: '#4f46e5', // Replaced blue-600
    marginRight: 8,
  },
  progressTitle: {
    fontSize: 14, // text-sm
    fontWeight: '600',
    color: '#1e293b',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 14,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  editForm: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1', // border-slate-300
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 12,
    paddingVertical: 8, // py-2
    fontSize: 14, // text-sm
    marginBottom: 12, // space-y-3
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#4f46e5', // Replaced gradient
    paddingVertical: 12, // py-2
    borderRadius: 12, // rounded-xl
    marginTop: 4, // mt-3
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500', // font-medium
  },
  logoutButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red', // bg-slate-100
    paddingVertical: 10, // py-2.5
    borderRadius: 12, // rounded-xl
    marginTop: 8, // mt-2
  },
  logoutIcon: {
    width: 16,
    height: 16,
    color: 'white', // text-slate-700
    marginRight: 8, // gap-2
  },
  logoutText: {
    fontWeight: '500',
    color: 'white',
  },
});

export default ProfilePage;