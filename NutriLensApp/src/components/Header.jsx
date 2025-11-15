// src/components/Header.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Bell, Heart } from 'lucide-react-native';
import { useAuth } from '../context/UserContext';

const Header = ({ onPressCameraButton }) => {
  const { userProfile } = useAuth();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  const userName = userProfile?.name ? userProfile.name.split(' ')[0] : 'User';
  const greeting = getGreeting();
  
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Left Side Content */}
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{greeting}, {userName}</Text>
          <View style={styles.subtitleContainer}>
            <Heart size={16} color="#7dd3fc" style={{ marginRight: 8 }} />
            <Text style={styles.subtitle}>Ready to achieve your goals?</Text>
          </View>
        </View>

        {/* 2. Wrapped both icons in a container for better spacing */}
        <View style={styles.rightIconsContainer}>
          {/* The missing Bell button */}
          {/* <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color="white" />
          </TouchableOpacity>
           */}
          {/* The main camera button */}
          <TouchableOpacity
            onPress={onPressCameraButton}
            style={styles.cameraButton}
          >
            <Camera size={24} color="white" />
            <View style={styles.pulseDot} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

// --- This is where we define all the styles ---
const styles = StyleSheet.create({
  headerContainer: {
    headerContainer: {
      backgroundColor: '#1e293b',
      paddingHorizontal: 24,
      paddingTop: 0,
      paddingBottom: 16,
},
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b', // Has its own dark background
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },

  headerLeft: {
    flex: 1, // This tells the left side to take up the available space
    flexShrink: 1, // This tells it to shrink if the text is too long
    marginRight: 16, // This adds a nice gap before the camera button
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 3,
    marginTop:-45,
    paddingTop:20,
    paddingLeft:0,
    marginLeft: -11
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:-10
  },
  subtitle: {
    color: '#cbd5e1', // A light slate color
    fontSize: 14,
  },
  // 3. New container for the right-side icons
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 4. New style for the smaller icon buttons
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Adds space between the bell and camera
  },
  cameraButton: {
    width: 56,
    height: 56,
    backgroundColor: '#4f46e5', // Indigo color
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop:-20
  },
  pulseDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: '#ef4444', // Red color
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
});

export default Header;