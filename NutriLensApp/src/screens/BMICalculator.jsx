import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Activity, HeartPulse, Ruler, Weight, Sparkles, Calendar, Plus, Minus, Check } from "lucide-react-native";
import { useAuth } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const BMICalculator = () => {
  const navigation = useNavigation();
  const {
    calculateNutritionRequirements,
    updateNutritionRequirements,
    completeSetup,
    targetNutrition,
  } = useAuth();

  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [calculatedNutrition, setCalculatedNutrition] = useState(null);
  const [showAdjustments, setShowAdjustments] = useState(false);

  const calculateBMI = () => {
    if (!age || !height || !weight) {
      Alert.alert("Missing information", "Please enter your age, height, and weight.");
      return;
    }

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    if (isNaN(h) || isNaN(w) || isNaN(a) || h <= 0 || w <= 0 || a <= 0) {
      Alert.alert("Invalid input", "Please enter valid positive numbers.");
      return;
    }

    const hMeters = h / 100;
    const bmiValue = w / (hMeters * hMeters);
    setBmi(bmiValue.toFixed(1));

    if (bmiValue < 18.5) {
      setStatus("Underweight");
      setStatusColor("#3b82f6");
    } else if (bmiValue < 25) {
      setStatus("Normal");
      setStatusColor("#10b981");
    } else if (bmiValue < 30) {
      setStatus("Overweight");
      setStatusColor("#f59e0b");
    } else {
      setStatus("Obese");
      setStatusColor("#ef4444");
    }

    // Calculate nutrition requirements
    const nutrition = calculateNutritionRequirements(a, w, h);
    setCalculatedNutrition(nutrition);
    setShowAdjustments(true);
  };

  const adjustNutrition = (type, delta) => {
    if (!calculatedNutrition) return;

    const current = calculatedNutrition[type];
    const newValue = Math.max(0, current + delta);

    setCalculatedNutrition({
      ...calculatedNutrition,
      [type]: newValue,
    });

    // Recalculate calories if adjusting macros
    if (type === "protein" || type === "carbs" || type === "fats") {
      const proteinCal = calculatedNutrition.protein * 4;
      const carbCal = calculatedNutrition.carbs * 4;
      const fatCal = calculatedNutrition.fats * 9;

      let newCalories;
      if (type === "protein") {
        newCalories = (newValue * 4) + (calculatedNutrition.carbs * 4) + (calculatedNutrition.fats * 9);
      } else if (type === "carbs") {
        newCalories = (calculatedNutrition.protein * 4) + (newValue * 4) + (calculatedNutrition.fats * 9);
      } else {
        newCalories = (calculatedNutrition.protein * 4) + (calculatedNutrition.carbs * 4) + (newValue * 9);
      }

      setCalculatedNutrition({
        ...calculatedNutrition,
        [type]: newValue,
        calories: Math.round(newCalories),
      });
    } else {
      setCalculatedNutrition({
        ...calculatedNutrition,
        [type]: newValue,
      });
    }
  };

  const handleComplete = async () => {
  if (!age || !height || !weight || !calculatedNutrition) {
    Alert.alert("Incomplete", "Please calculate your BMI first.");
    return;
  }

  try {
    // 1) Save target nutrition
    await updateNutritionRequirements(calculatedNutrition);

    // 2) Mark setup complete in user profile (merge-safe)
    await completeSetup(parseFloat(age), parseFloat(weight), parseFloat(height));

    Alert.alert("Setup Complete!", "Your nutrition plan has been created. Welcome to NutriLens!");

    // Optional fail-safe: if context hasn't flipped yet within a tick, push Home.
    setTimeout(() => {
      // @ts-ignore
      if (typeof navigation?.navigate === 'function') navigation.navigate("Home");
    }, 300);
  } catch (error) {
    Alert.alert("Error", error?.message || "Failed to complete setup. Please try again.");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <HeartPulse size={28} color="white" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>BMI Calculator</Text>
                <Text style={styles.headerSubtitle}>Set up your nutrition plan</Text>
              </View>
            </View>
          </View>

          {/* Input Card */}
          <View style={styles.card}>
            <View style={styles.inputSection}>
              {/* Age Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Age</Text>
                <View style={styles.inputWrapper}>
                  <Calendar size={20} color="#4f46e5" style={styles.inputIcon} />
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 25"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              {/* Height Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <View style={styles.inputWrapper}>
                  <Ruler size={20} color="#4f46e5" style={styles.inputIcon} />
                  <TextInput
                    value={height}
                    onChangeText={setHeight}
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 175"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              {/* Weight Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <View style={styles.inputWrapper}>
                  <Weight size={20} color="#4f46e5" style={styles.inputIcon} />
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 70"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>

              {/* Calculate Button */}
              <TouchableOpacity
                onPress={calculateBMI}
                style={styles.calculateButton}
                activeOpacity={0.8}
              >
                <Text style={styles.calculateButtonText}>Calculate BMI & Nutrition</Text>
              </TouchableOpacity>
            </View>

            {/* BMI Results */}
            {bmi && (
              <View style={styles.bmiResult}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{status}</Text>
                </View>
                <Text style={styles.bmiValue}>{bmi}</Text>
                <Text style={styles.bmiLabel}>Body Mass Index (kg/m²)</Text>
              </View>
            )}

            {/* Nutrition Requirements */}
            {calculatedNutrition && (
              <View style={styles.nutritionSection}>
                <Text style={styles.nutritionTitle}>Your Daily Nutrition Plan</Text>
                <Text style={styles.nutritionSubtitle}>
                  Adjust these values based on your goals
                </Text>

                {/* Calories */}
                <View style={styles.nutritionItem}>
                  <View style={styles.nutritionItemHeader}>
                    <Text style={styles.nutritionItemLabel}>Calories</Text>
                    <Text style={styles.nutritionItemValue}>
                      {calculatedNutrition.calories} kcal
                    </Text>
                  </View>
                  <View style={styles.adjustmentButtons}>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("calories", -50)}
                      style={styles.adjustButton}
                    >
                      <Minus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("calories", 50)}
                      style={styles.adjustButton}
                    >
                      <Plus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Protein */}
                <View style={styles.nutritionItem}>
                  <View style={styles.nutritionItemHeader}>
                    <Text style={styles.nutritionItemLabel}>Protein</Text>
                    <Text style={styles.nutritionItemValue}>
                      {calculatedNutrition.protein} g
                    </Text>
                  </View>
                  <View style={styles.adjustmentButtons}>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("protein", -5)}
                      style={styles.adjustButton}
                    >
                      <Minus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("protein", 5)}
                      style={styles.adjustButton}
                    >
                      <Plus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Carbs */}
                <View style={styles.nutritionItem}>
                  <View style={styles.nutritionItemHeader}>
                    <Text style={styles.nutritionItemLabel}>Carbs</Text>
                    <Text style={styles.nutritionItemValue}>
                      {calculatedNutrition.carbs} g
                    </Text>
                  </View>
                  <View style={styles.adjustmentButtons}>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("carbs", -10)}
                      style={styles.adjustButton}
                    >
                      <Minus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("carbs", 10)}
                      style={styles.adjustButton}
                    >
                      <Plus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Fats */}
                <View style={styles.nutritionItem}>
                  <View style={styles.nutritionItemHeader}>
                    <Text style={styles.nutritionItemLabel}>Fats</Text>
                    <Text style={styles.nutritionItemValue}>
                      {calculatedNutrition.fats} g
                    </Text>
                  </View>
                  <View style={styles.adjustmentButtons}>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("fats", -5)}
                      style={styles.adjustButton}
                    >
                      <Minus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("fats", 5)}
                      style={styles.adjustButton}
                    >
                      <Plus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Water */}
                <View style={styles.nutritionItem}>
                  <View style={styles.nutritionItemHeader}>
                    <Text style={styles.nutritionItemLabel}>Water</Text>
                    <Text style={styles.nutritionItemValue}>
                      {calculatedNutrition.water} glasses
                    </Text>
                  </View>
                  <View style={styles.adjustmentButtons}>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("water", -1)}
                      style={styles.adjustButton}
                    >
                      <Minus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => adjustNutrition("water", 1)}
                      style={styles.adjustButton}
                    >
                      <Plus size={16} color="#4f46e5" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Complete Button */}
                <TouchableOpacity
                  onPress={handleComplete}
                  style={styles.completeButton}
                  activeOpacity={0.8}
                >
                  <Check size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.completeButtonText}>Complete Setup</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Activity size={24} color="#2563eb" />
              <Text style={styles.infoText}>
                The Body Mass Index (BMI) helps assess your health. Ideal BMI:{" "}
                <Text style={styles.infoBold}>18.5 - 24.9</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#4f46e5",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#cbd5e1",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    paddingVertical: 0,
  },
  calculateButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  calculateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  bmiResult: {
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  bmiLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  nutritionSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  nutritionItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  nutritionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nutritionItemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  nutritionItemValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  adjustmentButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  adjustButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  completeButton: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 24,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
    marginLeft: 12,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: "600",
    color: "#2563eb",
  },
});

export default BMICalculator;
