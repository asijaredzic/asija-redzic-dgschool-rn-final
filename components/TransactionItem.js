// ============================================
// TRANSACTIONITEM.JS - PRIKAZ JEDNE TRANSAKCIJE
// ============================================
// Ova komponenta prikazuje jednu transakciju u listi.
// Prikazuje:
// - Ikonu kategorije (ili sliku)
// - Ime transakcije
// - Datum
// - Iznos (zeleno za prihod, crveno za rashod)
// 
// Ima animaciju kada je pritisnem.

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
// - transaction: objekt sa podacima o transakciji
// - onPress: funkcija koja se poziva kada kliknem
const TransactionItem = ({ transaction, onPress }) => {
  
  // Animacija za scale efekat
  const scaleAnim = useRef(new Animated.Value(1)).current;


  // ============================================
  // FUNKCIJA ZA FORMATIRANJE NOVCA
  // ============================================
  // Ako je negativan iznos (trosak), stavlja minus
  // Ako je pozitivan (prihod), stavlja plus
  const formatAmount = (amount) => {
    const isNegative = amount < 0;
    
    // Math.abs pretvara negativan broj u pozitivan
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Vracam formatiran iznos sa + ili -
    return isNegative ? `-$${formatted}` : `+$${formatted}`;
  };


  // ============================================
  // FUNKCIJA ZA BOJU IZNOSA
  // ============================================
  // Crvena za rashode, zelena za dobitke
  const getAmountColor = (amount) => {
    return amount < 0 ? '#EF4444' : '#10B981';
  };


  // ============================================
  // ANIMACIJE ZA PRITISAK
  // ============================================
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,  // Malo smanji
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,     // Vrati na normalnu velicinu
      friction: 3,
      useNativeDriver: true,
    }).start();
  };


  // ============================================
  // FUNKCIJA ZA ODABIR IKONE
  // ============================================
  // Za svaku kategoriju biram drugu ikonu
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'subscription':
        return 'logo-dribbble';  // Pretplate
      case 'transfer':
        return 'swap-horizontal'; // Transferi
      case 'food':
        return 'fast-food';       // Hrana
      case 'shopping':
        return 'cart';            // Kupovina
      case 'transport':
        return 'car';             // Prevoz
      case 'salary':
        return 'wallet';          // Plata
      case 'freelance':
        return 'laptop';          // Freelance posao
      default:
        return 'cash';            // Ostalo
    }
  };


  // ============================================
  // FUNKCIJA ZA BOJU IKONE
  // ============================================
  // Za svaku kategoriju biram drugu boju
  const getCategoryColor = (category) => {
    switch (category) {
      case 'subscription':
        return '#EC4899'; // Roza
      case 'transfer':
        return '#8B5CF6'; // Ljubicasta
      case 'food':
        return '#F59E0B'; // Narandzasta
      case 'shopping':
        return '#3B82F6'; // Plava
      case 'transport':
        return '#10B981'; // Zelena
      case 'salary':
        return '#10B981'; // Zelena
      case 'freelance':
        return '#6366F1'; // Indigo
      default:
        return '#6B7280'; // Siva
    }
  };


  // ============================================
  // CRTANJE KOMPONENTE KOMPONENTU
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
        {/* ============ LIJEVA STRANA - IKONA ============ */}
        <View style={[
          styles.iconContainer, 
          { backgroundColor: getCategoryColor(transaction.category) + '20' }
        ]}>
          {transaction.image ? (
            // Ako transakcija ima sliku, prikazujem je
            <Image source={{ uri: transaction.image }} style={styles.image} />
          ) : (
            // Inace prikazujem ikonu kategorije
            <Ionicons 
              name={getCategoryIcon(transaction.category)} 
              size={24} 
              color={getCategoryColor(transaction.category)} 
            />
          )}
        </View>

        {/* ============ SREDINA - IME I DATUM ============ */}
        <View style={styles.details}>
          <Text style={styles.name}>{transaction.name}</Text>
          <Text style={styles.date}>{transaction.date}</Text>
        </View>

        {/* ============ DESNA STRANA - IZNOS ============ */}
        <Text style={[
          styles.amount, 
          { color: getAmountColor(transaction.amount) }
        ]}>
          {formatAmount(transaction.amount)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner - horizontalni raspored
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  
  // Kontejner za ikonu - krug
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  // Slika (ako postoji)
  image: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  
  // Detalji (ime i datum)
  details: {
    flex: 1,  // Zauzmi preostali prostor
  },
  
  // Ime transakcije
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  
  // Datum
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
  },
  
  // Iznos
  amount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});

export default TransactionItem;
