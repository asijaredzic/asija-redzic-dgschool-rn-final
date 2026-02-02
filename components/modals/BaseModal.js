// ============================================
// BASEMODAL.JS - OSNOVNI MODAL (POPUP)
// ============================================
// Ova komponenta je "temelj" za sve popup prozore u aplikaciji.
// Ima:
// - Tamnu pozadinu koja se fade-uje
// - Bijeli prozor koji klizi odozdo
// - Naslov i dugme za zatvaranje (X)
// 
// Drugi modali (SendModal, ReceiveModal, itd.) koriste ovu komponentu
// i samo dodaju svoj sadrzaj unutar nje.

import React, { useEffect, useRef } from 'react';

import { 
  View, 
  Text, 
  StyleSheet, 
  Modal,                     // React Native modal
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback   // Za klik na pozadinu
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';


// Uzimam visinu ekrana za animaciju
const { height } = Dimensions.get('window');


// Komponenta prima:
// - visible: da li je modal vidljiv
// - onClose: funkcija za zatvaranje
// - title: naslov modala
// - children: sadrzaj koji dolazi unutar modala
const BaseModal = ({ visible, onClose, title, children }) => {
  
  // ============================================
  // ANIMACIJE
  // ============================================
  
  // Animacija za klizanje modala odozdo (pocinje van ekrana)
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  // Animacija za fade pozadine (0 = nevidljivo, 1 = vidljivo)
  const fadeAnim = useRef(new Animated.Value(0)).current;


  // ============================================
  // POKRECEM ANIMACIJE KADA SE MODAL OTVORI/ZATVORI
  // ============================================
  useEffect(() => {
    if (visible) {
      // OTVARANJE MODALA
      Animated.parallel([
        // Pozadina se polako pojavljuje
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Modal klizi odozdo prema gore
        Animated.spring(slideAnim, {
          toValue: 0,        // Dolazi na poziciju 0 (vidljiv)
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // ZATVARANJE MODALA
      Animated.parallel([
        // Pozadina nestaje
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        // Modal klizi prema dolje (van ekrana)
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);


  // ============================================
  // CRTAM MODAL
  // ============================================
  return (
    <Modal
      visible={visible}
      transparent={true}        // Vidim kroz modal (za pozadinu)
      animationType="none"      // Ne koristim default animaciju
      onRequestClose={onClose}  // Android back dugme
    >
      {/* ============ TAMNA POZADINA ============ */}
      {/* Kada kliknem na pozadinu, zatvaramo modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>
      
      {/* ============ SADRZAJ MODALA ============ */}
      <Animated.View 
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] }  // Animacija klizanja
        ]}
      >
        {/* Rucka na vrhu - samo dekoracija */}
        <View style={styles.handle} />
        
        {/* Zaglavlje sa naslovom i X dugmetom */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#A0A0C0" />
          </TouchableOpacity>
        </View>
        
        {/* Sadrzaj - ovo je ono sto dolazi iz drugih modala */}
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Tamna pozadina - prekriva cijeli ekran
  overlay: {
    ...StyleSheet.absoluteFillObject,  // Zauzima cijeli ekran
    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Crna sa 70% prozirnosti
  },
  
  // Kontejner modala - bijeli prozor na dnu
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
    maxHeight: height * 0.85,  // Maksimalno 85% visine ekrana
  },
  
  // Rucka na vrhu - mala siva linija
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#3D3D6B',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  
  // Zaglavlje sa naslovom i X
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
