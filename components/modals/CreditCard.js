// CreditCard.js - Komponenta za prikaz kreditne/debitne kartice
// Lijepa kartica sa gradijentom, brojem kartice i wifi ikonom
// Koristi se u CardsScreen i OverviewScreen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Props: card (podaci o kartici), style (dodatni stilovi)
const CreditCard = ({ card, style }) => {
  
  // Funkcija za formatiranje broja kartice
  // Prikazuje samo zadnje 4 cifre, ostalo su zvjezdice
  const formatCardNumber = (number) => {
    // Uzmi zadnje 4 cifre
    const lastFour = number.slice(-4);
    return `****${lastFour}`;
  };

  // Funkcija za formatiranje balansa
  const formatBalance = (balance) => {
    return '$' + balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Odabir boja gradijenta na osnovu tipa kartice
  const getGradientColors = (type) => {
    switch (type) {
      case 'visa':
        return ['#1E3A5F', '#0D1B2A']; // Tamno plava
      case 'mastercard':
        return ['#2D2D5A', '#1E1E3A']; // Ljubicasta
      default:
        return ['#2D2D5A', '#1E1E3A'];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors(card.type)}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Gornji red - labela i broj kartice */}
      <View style={styles.topRow}>
        <Text style={styles.label}>CARD BALANCE</Text>
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>{formatCardNumber(card.number)}</Text>
          {/* Wifi/NFC ikona */}
          <Ionicons name="wifi" size={20} color="#A0A0C0" style={styles.wifiIcon} />
        </View>
      </View>

      {/* Balans kartice */}
      <Text style={styles.balance}>{formatBalance(card.balance)}</Text>

      {/* Indikator na dnu (tacke) */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Glavni kontejner kartice
  container: {
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
  },
  // Gornji red
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
    letterSpacing: 1,
  },
  // Kontejner za broj kartice
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Broj kartice
  cardNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#A0A0C0',
  },
  // Wifi ikona
  wifiIcon: {
    marginLeft: 8,
    transform: [{ rotate: '90deg' }], // Rotiramo da izgleda kao NFC
  },
  // Balans
  balance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  // Kontejner za tacke
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // Pojedinacna tacka
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3D3D6B',
    marginHorizontal: 4,
  },
  // Aktivna tacka
  dotActive: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
});

export default CreditCard;
