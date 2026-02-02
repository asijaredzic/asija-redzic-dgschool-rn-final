// ============================================
// ACTIONBUTTON.JS - DUGME ZA AKCIJE
// ============================================
// Ovo je dugme koje koristim za akcije kao:
// - Send (posalji novac)
// - Receive (primi novac)
// - Convert (pretvori valutu)
// 
// Ima lijepu animaciju - kada ga pritisnemo, malo se smanji.

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


// Komponenta prima:
// - icon: ime ikonice (npr. "paper-plane")
// - label: tekst ispod (npr. "Send")
// - onPress: funkcija koja se poziva kada kliknem
// - colors: boje za gradijent (npr. ["#8B5CF6", "#7C3AED"])
const ActionButton = ({ icon, label, onPress, colors = ['#8B5CF6', '#7C3AED'] }) => {
  
  // ============================================
  // ANIMACIJA
  // ============================================
  // useRef cuva vrijednost animacije izmedju renderovanja
  // Animated.Value(1) znaci da pocinjemo sa normalnom velicinom
  const scaleAnim = useRef(new Animated.Value(1)).current;


  // Kada korisnik pritisne dugme, smanjim ga na 95%
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,       // Smanji na 95%
      useNativeDriver: true,
    }).start();
  };


  // Kada korisnik pusti dugme, vracam ga na normalnu velicinu
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,          // Vrati na 100%
      friction: 3,         // Mala frikcija = vise "skakanja"
      tension: 40,
      useNativeDriver: true,
    }).start();
  };


  // ============================================
  // CRTAM DUGME
  // ============================================
  return (
    // Animated.View omogucava animaciju
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}              // Sta se desi kada kliknem
        onPressIn={handlePressIn}      // Sta se desi kada pritisnem
        onPressOut={handlePressOut}    // Sta se desi kada pustim
        activeOpacity={0.9}
        style={styles.container}
      >
        {/* Krug sa gradijentom i ikonom */}
        <LinearGradient
          colors={colors}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </LinearGradient>
        
        {/* Tekst ispod ikone */}
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner - sve je centrirano
  container: {
    alignItems: 'center',
    marginHorizontal: 10,  // Razmak sa strane
  },
  
  // Kontejner za ikonu - krug sa gradijentom
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,      // Malo zaobljeni uglovi
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Tekst ispod ikone
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default ActionButton;
