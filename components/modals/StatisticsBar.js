// StatisticsBar.js - Komponenta za jedan stupac u grafikonu statistike
// Prikazuje dan, iznos i animirani stupac
// Koristi Animated API za animaciju visine stupca

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

// Props: day (dan), amount (iznos), maxAmount (maksimalni iznos za skaliranje), isSelected (da li je odabran), onPress
const StatisticsBar = ({ day, amount, maxAmount, isSelected = false, onPress }) => {
  
  // Animirana vrijednost za visinu stupca (pocinje od 0)
  const heightAnim = useRef(new Animated.Value(0)).current;
  
  // Animacija za scale pri pritisku
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // useEffect se pokrece kada se komponenta renderuje
  // Animira visinu stupca od 0 do izracunate vrijednosti
  useEffect(() => {
    // Izracunaj procenat visine (maksimalna visina je 100)
    const heightPercent = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
    
    // Pokreni animaciju sa malim kasnjenjem za ljepsi efekat
    Animated.timing(heightAnim, {
      toValue: heightPercent,
      duration: 800,
      useNativeDriver: false, // Ne moze koristiti native driver za height
    }).start();
  }, [amount, maxAmount]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  // Funkcija za formatiranje iznosa (skraceno)
  const formatShortAmount = (amt) => {
    if (amt >= 1000) {
      return '$' + (amt / 1000).toFixed(1) + 'k';
    }
    return '$' + amt;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.container}
      >
        {/* Tooltip sa iznosom - prikazuje se samo ako je odabran */}
        {isSelected && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{formatShortAmount(amount)}</Text>
            <View style={styles.tooltipArrow} />
          </View>
        )}
        
        {/* Kontejner za stupac */}
        <View style={styles.barContainer}>
          {/* Animirani stupac */}
          <Animated.View 
            style={[
              styles.bar,
              {
                height: heightAnim, // Animirana visina
                backgroundColor: isSelected ? '#8B5CF6' : '#3D3D6B', // Ljubicasta ako je odabran
              }
            ]}
          />
        </View>
        
        {/* Dan ispod stupca */}
        <Text style={[
          styles.day,
          isSelected && styles.daySelected
        ]}>
          {day}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Glavni kontejner
  container: {
    alignItems: 'center',
    flex: 1,
  },
  // Tooltip iznad stupca
  tooltip: {
    backgroundColor: '#1E1E3A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    position: 'relative',
  },
  // Tekst u tooltip-u
  tooltipText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  // Strelica tooltip-a
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1E1E3A',
  },
  // Kontejner za stupac
  barContainer: {
    width: 32,
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  // Stupac
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4, // Minimalna visina da se uvijek vidi
  },
  // Dan
  day: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#A0A0C0',
  },
  // Odabrani dan
  daySelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default StatisticsBar;
