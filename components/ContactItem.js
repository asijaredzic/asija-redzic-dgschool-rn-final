// ============================================
// CONTACTITEM.JS - PRIKAZ JEDNOG KONTAKTA
// ============================================
// Ova komponenta prikazuje jedan kontakt u horizontalnoj listi.
// Koristi se za brzi transfer novca prijateljima.
// Prikazuje:
// - Sliku (avatar) kontakta
// - Ime kontakta
// 
// Moze biti i dugme za dodavanje novog kontakta (sa + ikonom).

import React, { useRef } from 'react';

import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Image 
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';


// Komponenta prima:
// - contact: objekt sa podacima o kontaktu
// - onPress: funkcija za klik
// - isAddButton: ako je true, prikazujem dugme za dodavanje
const ContactItem = ({ contact, onPress, isAddButton = false }) => {
  
  // Animacija za scale efekat
  const scaleAnim = useRef(new Animated.Value(1)).current;


  // ============================================
  // ANIMACIJE ZA PRITISAK
  // ============================================
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,  // Smanji vise nego transakcija
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };


  // ============================================
  // AKO JE DUGME ZA DODAVANJE
  // ============================================
  // Prikazujem krug sa + ikonom umjesto kontakta
  if (isAddButton) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={styles.container}
        >
          {/* Krug sa isprekidanom linijom i + ikonom */}
          <View style={styles.addButton}>
            <Ionicons name="add" size={28} color="#8B5CF6" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }


  // ============================================
  // NORMALNI KONTAKT
  // ============================================
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.container}
      >
        {/* Slika kontakta */}
        <Image 
          source={{ uri: contact.avatar }} 
          style={styles.avatar}
        />
        
        {/* Ime kontakta - samo prvo ime */}
        {/* split(' ')[0] uzima samo prvi dio imena */}
        <Text style={styles.name} numberOfLines={1}>
          {contact.name.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner - mali i centriran
  container: {
    alignItems: 'center',
    marginRight: 16,  // Razmak izmedju kontakata
    width: 60,        // Fiksna sirina
  },
  
  // Dugme za dodavanje - isprekidana linija
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,         // Krug
    borderWidth: 2,
    borderColor: '#8B5CF6',   // Ljubicasta boja
    borderStyle: 'dashed',    // Isprekidana linija
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  // Slika kontakta - krug
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
  },
  
  // Ime kontakta
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ContactItem;
