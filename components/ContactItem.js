// ContactItem.js - Komponenta za prikaz kontakta za brzi transfer
// Prikazuje avatar i ime kontakta
// Animirana sa scale efektom pri pritisku

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

// Props: contact (podaci o kontaktu), onPress (funkcija za klik), isAddButton (da li je dugme za dodavanje)
const ContactItem = ({ contact, onPress, isAddButton = false }) => {
  
  // Animacija za scale efekat
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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

  // Ako je ovo dugme za dodavanje novog kontakta
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
          {/* Krug sa + ikonom */}
          <View style={styles.addButton}>
            <Ionicons name="add" size={28} color="#8B5CF6" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Normalni kontakt item
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.container}
      >
        {/* Avatar kontakta */}
        <Image 
          source={{ uri: contact.avatar }} 
          style={styles.avatar}
        />
        {/* Ime kontakta (samo prvo ime) */}
        <Text style={styles.name} numberOfLines={1}>
          {contact.name.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Glavni kontejner
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  // Dugme za dodavanje
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  // Avatar slika
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
