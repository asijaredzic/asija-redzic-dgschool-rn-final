// TransactionItem.js - Komponenta za prikaz jedne transakcije
// Prikazuje ime, datum, ikonu i iznos transakcije
// Animirana komponenta koja reaguje na pritisak

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

// Props: transaction (podaci o transakciji), onPress (funkcija za klik)
const TransactionItem = ({ transaction, onPress }) => {
  
  // Animacija za scale efekat pri pritisku
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Funkcija za formatiranje novca
  // Ako je negativan iznos (trosak), prikazuje crveno
  // Ako je pozitivan (prihod), prikazuje zeleno sa + ispred
  const formatAmount = (amount) => {
    const isNegative = amount < 0;
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return isNegative ? `-$${formatted}` : `+$${formatted}`;
  };

  // Odredjuje boju iznosa na osnovu tipa transakcije
  const getAmountColor = (amount) => {
    return amount < 0 ? '#EF4444' : '#10B981'; // Crvena za minus, zelena za plus
  };

  // Animacija pri pritisku
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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

  // Funkcija za odabir ikone na osnovu kategorije
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'subscription':
        return 'logo-dribbble';
      case 'transfer':
        return 'swap-horizontal';
      case 'food':
        return 'fast-food';
      case 'shopping':
        return 'cart';
      case 'transport':
        return 'car';
      case 'salary':
        return 'wallet';
      case 'freelance':
        return 'laptop';
      default:
        return 'cash';
    }
  };

  // Funkcija za odabir boje ikone na osnovu kategorije
  const getCategoryColor = (category) => {
    switch (category) {
      case 'subscription':
        return '#EC4899'; // Pink
      case 'transfer':
        return '#8B5CF6'; // Purple
      case 'food':
        return '#F59E0B'; // Orange
      case 'shopping':
        return '#3B82F6'; // Blue
      case 'transport':
        return '#10B981'; // Green
      case 'salary':
        return '#10B981'; // Green
      case 'freelance':
        return '#6366F1'; // Indigo
      default:
        return '#6B7280'; // Gray
    }
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
        {/* Lijeva strana - ikona ili slika */}
        <View style={[
          styles.iconContainer, 
          { backgroundColor: getCategoryColor(transaction.category) + '20' }
        ]}>
          {transaction.image ? (
            // Ako transakcija ima sliku, prikazi je
            <Image source={{ uri: transaction.image }} style={styles.image} />
          ) : (
            // Inace prikazi ikonu kategorije
            <Ionicons 
              name={getCategoryIcon(transaction.category)} 
              size={24} 
              color={getCategoryColor(transaction.category)} 
            />
          )}
        </View>

        {/* Sredina - ime i datum */}
        <View style={styles.details}>
          <Text style={styles.name}>{transaction.name}</Text>
          <Text style={styles.date}>{transaction.date}</Text>
        </View>

        {/* Desna strana - iznos */}
        <Text style={[styles.amount, { color: getAmountColor(transaction.amount) }]}>
          {formatAmount(transaction.amount)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Glavni kontejner - horizontalni layout
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  // Kontejner za ikonu
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  // Stil za sliku (ako postoji)
  image: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  // Kontejner za detalje (ime i datum)
  details: {
    flex: 1,
  },
  // Ime transakcije
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  // Datum transakcije
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
  },
  // Iznos transakcije
  amount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});

export default TransactionItem;
