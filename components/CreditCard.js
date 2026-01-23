// CreditCard.js - Komponenta za prikaz kreditne/debitne kartice

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CreditCard = ({ card = {}, style }) => {

  // Formatiranje broja kartice
  const formatCardNumber = (number) => {
    if (typeof number !== 'string') {
      return '****----';
    }
    const lastFour = number.slice(-4);
    return `****${lastFour}`;
  };

  // Formatiranje balansa
  const formatBalance = (balance) => {
    const safeBalance = typeof balance === 'number' ? balance : 0;
    return '$' + safeBalance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Boje
  const getGradientColors = (type) => {
    switch (type) {
      case 'visa':
        return ['#1E3A5F', '#0D1B2A'];
      case 'mastercard':
        return ['#2D2D5A', '#1E1E3A'];
      default:
        return ['#2D2D5A', '#1E1E3A'];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors(card?.type)}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.topRow}>
        <Text style={styles.label}>CARD BALANCE</Text>

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

      <Text style={styles.balance}>
        {formatBalance(card?.balance)}
      </Text>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#A0A0C0',
    letterSpacing: 1,
  },
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
    transform: [{ rotate: '90deg' }],
  },
  balance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 15,
  },
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
  dotActive: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
});

export default CreditCard;
