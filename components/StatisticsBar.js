// ============================================
// STATISTICSBAR.JS - STUPAC U GRAFIKONU
// ============================================
// Ova komponenta prikazuje jedan stupac u grafikonu statistike.
// Visina stupca ovisi o iznosu - veci iznos = visi stupac.
// Prikazuje:
// - Animirani stupac
// - Dan (Mon, Tue, itd.)
// - Tooltip sa iznosom kada je odabran

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';


// Komponenta prima:
// - day: ime dana ("Mon", "Tue", itd.)
// - amount: iznos za taj dan
// - maxAmount: najveci iznos (za skaliranje)
// - isSelected: da li je ovaj dan odabran
// - onPress: funkcija za klik
const StatisticsBar = ({ day, amount, maxAmount, isSelected = false, onPress }) => {
  
  // ============================================
  // ANIMACIJE
  // ============================================
  
  // Animacija za visinu stupca (pocinje od 0)
  const heightAnim = useRef(new Animated.Value(0)).current;
  
  // Animacija za scale pri pritisku
  const scaleAnim = useRef(new Animated.Value(1)).current;


  // ============================================
  // ANIMACIJA VISINE STUPCA
  // ============================================
  // Kada se komponenta prvi put prikaze ili kada se promijeni iznos,
  // stupac animirano raste od 0 do potrebne visine
  useEffect(() => {
    // Racunam procenat visine (maksimum je 100)
    // Ako je maxAmount 1000 i amount 500, visina je 50%
    const heightPercent = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
    
    // Pokrecem animaciju
    Animated.timing(heightAnim, {
      toValue: heightPercent,
      duration: 800,          // Traje 800ms
      useNativeDriver: false, // Moram koristiti false jer animiram height
    }).start();
  }, [amount, maxAmount]);


  // ============================================
  // ANIMACIJE ZA PRITISAK
  // ============================================
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


  // ============================================
  // FUNKCIJA ZA SKRACENO FORMATIRANJE IZNOSA
  // ============================================
  // 1500 postaje "$1.5k" umjesto "$1,500"
  const formatShortAmount = (amt) => {
    if (amt >= 1000) {
      return '$' + (amt / 1000).toFixed(1) + 'k';
    }
    return '$' + amt;
  };
// amt - amount
// ≥ 1000 --> dijeli sa 1000 i dodaje k
// < 1000 --> samo prikaže broj
// sve se formatira kao tekst za prikaz

  // ============================================
  // CRTAM KOMPONENTU
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
        {/* ============ TOOLTIP ============ */}
        {/* Prikazujem samo ako je ovaj stupac odabran */}
        {isSelected && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{formatShortAmount(amount)}</Text>
            {/* Strelica koja pokazuje prema stupcu */}
            <View style={styles.tooltipArrow} />
          </View>
        )}
        
        {/* ============ STUPAC ============ */}
        <View style={styles.barContainer}>
          <Animated.View 
            style={[
              styles.bar,
              {
                height: heightAnim,  // Animirana visina
                // Ljubicasta ako je odabran, siva ako nije
                backgroundColor: isSelected ? '#8B5CF6' : '#3D3D6B',
              }
            ]}
          />
        </View>
        
        {/* ============ DAN ============ */}
        <Text style={[
          styles.day,
          isSelected && styles.daySelected  // Drugaciji stil ako je odabran
        ]}>
          {day}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner
  container: {
    alignItems: 'center',
    flex: 1,  // Svi stupci zauzimaju jednak prostor
  },
  
  // Tooltip - mala "oblacica" sa iznosom
  tooltip: {
    backgroundColor: '#1E1E3A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    position: 'relative',
  },
  tooltipText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  // Strelica tooltip-a (trokut koji pokazuje dolje)
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    // Pravim trokut koristeci bordere
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
    height: 100,           // Maksimalna visina
    justifyContent: 'flex-end', // Stupac raste odozdo
    marginBottom: 8,
  },
  
  // Stupac
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,  // Minimalna visina da se uvijek vidi
  },
  
  // Tekst dana
  day: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#A0A0C0',
  },
  // Odabrani dan - bijeli i deblji
  daySelected: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default StatisticsBar;
