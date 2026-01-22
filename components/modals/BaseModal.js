// BaseModal.js - Osnovna modal komponenta koju koriste svi modali
// Ovo je "template" za sve popup prozore u aplikaciji
// Ima animaciju za otvaranje/zatvaranje i tamnu pozadinu

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Uzimamo dimenzije ekrana
const { height } = Dimensions.get('window');

// Props: visible (da li je modal vidljiv), onClose (funkcija za zatvaranje), title (naslov), children (sadrzaj)
const BaseModal = ({ visible, onClose, title, children }) => {
  
  // Animirana vrijednost za slide-up efekat
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  // Animirana vrijednost za fade efekat pozadine
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // useEffect prati promjene visible prop-a
  // Kada se modal otvori ili zatvori, pokrece odgovarajucu animaciju
  useEffect(() => {
    if (visible) {
      // Animacija otvaranja - modal klizi odozdo prema gore
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animacija zatvaranja - modal klizi prema dolje
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none" // Koristimo nasu custom animaciju
      onRequestClose={onClose}
    >
      {/* Tamna pozadina koja se fade-uje */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>
      
      {/* Modal sadrzaj koji klizi */}
      <Animated.View 
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Rucka za povlacenje (dekoracija) */}
        <View style={styles.handle} />
        
        {/* Zaglavlje sa naslovom i X dugmetom */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#A0A0C0" />
          </TouchableOpacity>
        </View>
        
        {/* Sadrzaj modala (children) */}
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Tamna pozadina
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  // Kontejner modala
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: height * 0.85, // Maksimalno 85% visine ekrana
  },
  // Rucka na vrhu modala
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#3D3D6B',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  // Zaglavlje
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Naslov
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  // Dugme za zatvaranje
  closeButton: {
    padding: 5,
  },
  // Sadrzaj
  content: {
    flex: 1,
  },
});

export default BaseModal;
