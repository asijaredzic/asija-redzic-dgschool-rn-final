// ActionButton.js - Komponenta za akcijska dugmad (Send, Receive, Convert)
// Animirano dugme koje reaguje na pritisak
// Koristi Animated API za smooth animacije

import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated,
  View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Komponenta prima: icon (ime ikone), label (tekst), onPress (funkcija), i colors (boje gradijenta)
const ActionButton = ({ icon, label, onPress, colors = ['#8B5CF6', '#7C3AED'] }) => {
  
  // useRef cuva vrijednost animacije koja se ne resetuje pri renderovanju
  // Animated.Value(1) znaci da pocinjemo sa punom velicinom (scale = 1)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Funkcija koja se poziva kada korisnik pritisne dugme
  const handlePressIn = () => {
    // Animiramo smanjenje dugmeta na 95% velicine
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true, // Koristi native driver za bolje performanse
    }).start();
  };

  // Funkcija koja se poziva kada korisnik pusti dugme
  const handlePressOut = () => {
    // Vracamo dugme na normalnu velicinu
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3, // Manja frikcija = vise "bouncy" animacija
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    // Animated.View omogucava animacije na View komponenti
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.container}
      >
        {/* Gradijent pozadina za dugme */}
        <LinearGradient
          colors={colors}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Ikona unutar dugmeta */}
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </LinearGradient>
        
        {/* Tekst ispod ikone */}
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Glavni kontejner - centrira sadrzaj
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  // Kontejner za ikonu sa gradijentom
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  // Tekst labele ispod ikone
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default ActionButton;
