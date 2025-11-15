import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { ANALYSIS_API_URL } from '../config/env';

// A single function to handle all necessary permissions
const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissionsToRequest = [PermissionsAndroid.PERMISSIONS.CAMERA];
      if (Platform.Version >= 33) {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
      } else {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }
      const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);
      const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      const storageGranted =
        Platform.Version >= 33
          ? granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === 'granted'
          : granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === 'granted';

      if (cameraGranted && storageGranted) return true;
      
      Alert.alert(
        'Permission Denied',
        "NutriLens needs Camera and Gallery access. Please grant them in your phone's settings.",
      );
      return false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const AnalysisModal = ({ visible, onClose, onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  
  // State for the editable list of foods
  const [detections, setDetections] = useState([]);
  // State for the nutrition total (this will not change)
  const [nutritionData, setNutritionData] = useState(null);
  // State for the new food input
  const [newFoodName, setNewFoodName] = useState('');
  // State for error messages
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (visible) {
      // Reset state every time modal opens
      setDetections([]);
      setAnnotatedImage(null);
      setNutritionData(null);
      setLoading(false);
      setErrorMessage('');
      setNewFoodName('');
      handleChoosePhoto();
    }
  }, [visible]);

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      onClose();
    } else if (response.errorCode) {
      Alert.alert('Error', 'Could not get image: ' + response.errorMessage);
      onClose();
    } else if (response.assets && response.assets.length > 0) {
      sendImageToBackend(response.assets[0]);
    } else {
      onClose();
    }
  };

  const sendImageToBackend = (selectedImage) => {
    setLoading(true);
    setErrorMessage('');
    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage.uri,
      type: selectedImage.type,
      name: selectedImage.fileName,
    });

    const backendUrl = ANALYSIS_API_URL;

    axios
      .post(backendUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 })
      .then((res) => {
        // Log the full response to the console
        console.log('--- API SUCCESS RESPONSE ---');
        console.log(JSON.stringify(res.data, null, 2));
        console.log('------------------------------');

        if (res.data.total_nutrition) {
          setNutritionData(res.data.total_nutrition);
        }
        
        if (res.data.detections && res.data.detections.length > 0) {
          setDetections(res.data.detections);
        } else {
          setDetections(['No items detected. Add manually.']);
        }

        if (res.data.annotated_image) {
          setAnnotatedImage(`data:image/jpeg;base64,${res.data.annotated_image}`);
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Axios Error:', error);
        setErrorMessage('Error: Analysis failed. Check server and try again.');
        setLoading(false);
      });
  };

  const handleChoosePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      onClose();
      return;
    }

    Alert.alert('Scan a Meal', 'Choose how you want to add your food.', [
      { text: 'Take Photo', onPress: () => launchCamera({ mediaType: 'photo', saveToPhotos: false, quality: 0.85, maxWidth: 1600, maxHeight: 1600 }, handleImageResponse) },
      { text: 'Choose from Gallery', onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 0.85, maxWidth: 1600, maxHeight: 1600 }, handleImageResponse) },
      { text: 'Cancel', style: 'cancel', onPress: onClose },
    ]);
  };

  // --- Functions to edit the food list ---
  const handleAddNewFood = () => {
    if (newFoodName.trim() === '') return;
    setDetections([...detections, newFoodName.trim()]);
    setNewFoodName('');
  };

  const handleDeleteFood = (indexToRemove) => {
    setDetections(detections.filter((_, index) => index !== indexToRemove));
  };

  // --- Function to send all data to HomeScreen ---
  const handleAddLog = () => {
    if (!nutritionData) {
      Alert.alert("Error", "No nutrition data to add. Did the analysis fail?", [
        { text: "OK", onPress: onClose }
      ]);
      return;
    }

    // Pass an object with both the food list and the nutrition total
    onAnalysisComplete({
      foods: detections,
      nutrition: nutritionData,
    });
    
    onClose(); // Close after adding
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {loading ? (
            // --- Loading State ---
            <View>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.placeholderText}>Analyzing your meal...</Text>
            </View>
          ) : errorMessage ? (
            // --- Error State ---
            <View>
              <Text style={styles.placeholderText}>{errorMessage}</Text>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // --- Success/Edit State ---
            <>
              {annotatedImage && (
                <Image source={{ uri: annotatedImage }} style={styles.image} />
              )}
              
              <Text style={styles.listTitle}>Detected Foods (Edit as needed)</Text>
              
              <ScrollView style={styles.listContainer}>
                {detections.map((food, index) => (
                  <View key={index} style={styles.foodItemRow}>
                    <Text style={styles.foodItemText}>{food}</Text>
                    <TouchableOpacity onPress={() => handleDeleteFood(index)}>
                      <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Add missing food..."
                  placeholderTextColor="#94a3b8"
                  value={newFoodName}
                  onChangeText={setNewFoodName}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddNewFood}>
                  <Plus size={20} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.logButton]} onPress={handleAddLog}>
                  <Text style={[styles.buttonText, styles.logButtonText]}>Add to Log</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 24, padding: 24, maxHeight: '90%' },
  image: { width: '100%', height: 250, resizeMode: 'contain', borderRadius: 12, marginBottom: 16 },
  placeholderText: { fontSize: 16, color: '#64748b', textAlign: 'center', marginVertical: 40, padding: 20 },
  
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  listContainer: {
    width: '100%',
    maxHeight: 150,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 8,
    marginBottom: 16,
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  foodItemText: {
    fontSize: 14,
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logButton: {
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#334155',
  },
  logButtonText: {
    color: 'white',
  },
});

export default AnalysisModal;