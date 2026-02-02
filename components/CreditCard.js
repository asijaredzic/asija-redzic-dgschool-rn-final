// ============================================
// CREDITCARD.JS - MALA KARTICA SA BALANSOM
// ============================================
// Ova komponenta prikazuje manju verziju kreditne kartice.
// Koristi se na Overview ekranu.
// Prikazuje:
// - Balans kartice
// - Zadnje 4 cifre broja kartice
// - Wifi ikonu (za beskontaktno placanje)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


// Komponenta prima:
// - card: objekt sa podacima o kartici
// - style: dodatni stilovi (opciono)
const CreditCard = ({ card = {}, style }) => {

  // ============================================
  // FUNKCIJA ZA FORMATIRANJE BROJA KARTICE
  // ============================================
  // Prikazujem samo zadnje 4 cifre, ostalo zamijenim zvjezdicama
  // "1234567890123456" postaje "****3456"
  const formatCardNumber = (number) => {
    // Ako nije string, vracam placeholder
    if (typeof number !== 'string') {
      return '****----';
    }
    // Uzimam zadnja 4 znaka
    const lastFour = number.slice(-4);
    return `****${lastFour}`;
  };


  // ============================================
  // FUNKCIJA ZA FORMATIRANJE BALANSA
  // ============================================
  const formatBalance = (balance) => {
    // Ako nije broj, koristim 0
    const safeBalance = typeof balance === 'number' ? balance : 0;
    return '$' + safeBalance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  // ============================================
  // FUNKCIJA ZA BOJE GRADIJENTA
  // ============================================
  // Razlicite boje za razlicite tipove kartica
  const getGradientColors = (type) => {
    switch (type) {
      case 'visa':
        return ['#1E3A5F', '#0D1B2A'];  // Tamno plava
      case 'mastercard':
        return ['#2D2D5A', '#1E1E3A'];  // Ljubicasta
      default:
        return ['#2D2D5A', '#1E1E3A'];
    }
  };


  // ============================================
  // CRTAM KOMPONENTU
  // ============================================
  return (
    <LinearGradient
      colors={getGradientColors(card?.type)}
      style={[styles.container, style]}  // Kombinujem moje stilove sa dodatnim
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* ============ GORNJI RED ============ */}
      <View style={styles.topRow}>
        {/* Labela "CARD BALANCE" */}
        <Text style={styles.label}>CARD BALANCE</Text>

        {/* Broj kartice i wifi ikona */}
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>
            {formatCardNumber(card?.number)}
          </Text>
          <Ionicons
            name="wifi"
            size={20}
            color="#A0A0C0"
            style={styles.wifiIcon}
          />
        </View>
      </View>

      {/* ============ BALANS ============ */}
      <Text style={styles.balance}>
        {formatBalance(card?.balance)}
      </Text>

      {/* ============ INDIKATORI (TACKICE) ============ */}
      {/* Pokazuju da ima vise kartica */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </LinearGradient>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner
  container: {
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
  },
  
  // Gornji red - horizontalni raspored
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  
  // Labela "CARD BALANCE"
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#A0A0C0',
    letterSpacing: 1,  // Razmak izmedju slova
  },
  
  // Broj kartice i wifi
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#A0A0C0',
  },
  wifiIcon: {
    marginLeft: 8,
    transform: [{ rotate: '90deg' }],  // Rotiram za 90 stepeni
  },
  
  // Balans - veliki tekst
  balance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  
  // Tackice na dnu
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3D3D6B',
    marginHorizontal: 4,
  },
  // Aktivna tackica - ljubicasta i sira
  dotActive: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
});

export default CreditCard;
