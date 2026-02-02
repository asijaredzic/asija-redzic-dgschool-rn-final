// ============================================
// CARDSSCREEN.JS - EKRAN SA MOJIM KARTICAMA
// ============================================
// Ovdje prikazujem sve kartice koje korisnik ima.
// Kartice se mogu listati horizontalno (carousel).
// Ispod kartica imam brze akcije i transakcije.

import React, { useState, useRef, useEffect } from 'react';

import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,      // Za dimenzije ekrana
  FlatList,        // Za carousel kartica
  StatusBar,
  Animated,
  Alert            // Za popup poruke
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Ucitavam podatke
import cardsData from '../data/cards.json';
import transactionsData from '../data/transactions.json';

// Moje komponente
import { TransactionItem, SectionHeader, TransactionDetailModal } from '../components';


// ============================================
// DIMENZIJE EKRANA
// ============================================
// Uzimam sirinu ekrana da znam koliko je velika kartica
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;  // Kartica je malo manja od ekrana


const CardsScreen = () => {

  // ============================================
  // STATE VARIJABLE
  // ============================================
  
  // Koja kartica je trenutno vidljiva (indeks u listi)
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // Da li je modal za detalje otvoren
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Koja transakcija je odabrana
  const [selectedTransaction, setSelectedTransaction] = useState(null);


  // ============================================
  // ANIMACIJE
  // ============================================
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  // ============================================
  // POMOCNE FUNKCIJE ZA FORMATIRANJE
  // ============================================
  
  // Formatira broj kartice - stavlja razmake svakih 4 cifre
  // "1234567890123456" postaje "1234 5678 9012 3456" kao sto e na pravim karticama
  const formatCardNumber = (number = '') => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };
// Regex uzme svaka 4 broja
// Doda razmak iza svake grupe
// Skine zadnji razmak

// Regex = regularni izraz i to je pravilo za pretraživanje i obradu teksta.

  // Formatira novac - dodaje $ i zareze
  // 1234.56 postaje "$1,234.56"
  const formatBalance = (balance = 0) => {
    return '$' + balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  // ============================================
  // CAROUSEL SCROLL - PRATIM KOJA KARTICA JE VIDLJIVA
  // ============================================
  const handleScroll = (event) => {
    // Uzimam poziciju skrolovanja
    const scrollPosition = event.nativeEvent.contentOffset.x;
    
    // Racunam indeks kartice na osnovu pozicije
    const index = Math.round(scrollPosition / CARD_WIDTH);
    
    // Spremam koji je indeks aktivan
    setActiveCardIndex(index);
  };


  // ============================================
  // FUNKCIJE ZA BRZE AKCIJE
  // ============================================
  
  // Blokiranje kartice
  const handleBlockCard = () => {
    Alert.alert(
      'Blokiranje kartice',
      'Da li ste sigurni da zelite blokirati ovu karticu?',
      [
        { text: 'Odustani', style: 'cancel' },
        { 
          text: 'Blokiraj', 
          style: 'destructive',  // Crveno dugme
          onPress: () => {
            Alert.alert('Uspjesno', 'Kartica je blokirana');
          }
        },
      ]
    );
  };

  // Postavke kartice
  const handleCardSettings = () => {
    Alert.alert('Postavke kartice', 'Ovdje bi bile postavke kartice');
  };

  // Dodavanje nove kartice
  const handleAddCard = () => {
    Alert.alert('Nova kartica', 'Ovdje bi se dodala nova kartica');
  };


  // ============================================
  // RENDEROVANJE JEDNE KARTICE
  // ============================================
  // Ova funkcija crta jednu karticu u carousel-u
  const renderCard = ({ item }) => {
    // Ako nema podataka, ne crtam nista
    if (!item) return null;

    // Odredujem boje na osnovu tipa kartice
    const type = item.type || '';
    const gradientColors = type === 'visa'
      ? ['#1E3A5F', '#0D1B2A']    // Tamno plava za Visa
      : ['#2D2D5A', '#1E1E3A'];   // Ljubicasta za ostale

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* ============ GORNJI RED ============ */}
          <View style={styles.cardTopRow}>
            {/* Chip kartice - zlatni pravougaonik */}
            <View style={styles.cardChip}>
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
            </View>

            {/* Tip kartice i wifi ikona */}
            <View style={styles.cardTypeContainer}>
              <Text style={styles.cardType}>
                {type.toUpperCase()}
              </Text>
              <Ionicons
                name="wifi"
                size={18}
                color="#A0A0C0"
                style={styles.wifiIcon}
              />
            </View>
          </View>

          {/* ============ BROJ KARTICE ============ */}
          <Text style={styles.cardNumber}>
            {formatCardNumber(item.number)}
          </Text>

          {/* ============ DONJI RED ============ */}
          <View style={styles.cardBottomRow}>
            {/* Ime vlasnika */}
            <View>
              <Text style={styles.cardLabel}>Card Holder</Text>
              <Text style={styles.cardHolderName}>
                {item.holder || ''}
              </Text>
            </View>
            
            {/* Datum isteka */}
            <View style={styles.cardExpiry}>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardExpiryDate}>
                {item.expiry || ''}
              </Text>
            </View>
          </View>

          {/* ============ BALANS ============ */}
          <View style={styles.cardBalanceContainer}>
            <Text style={styles.cardBalanceLabel}>Balance</Text>
            <Text style={styles.cardBalance}>
              {formatBalance(item.balance)}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };


  // Uzimam prve 4 transakcije za prikaz
  const cardTransactions = (transactionsData || []).slice(0, 4);


  // ============================================
  // CRTAM EKRAN
  // ============================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ============ ZAGLAVLJE ============ */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cards</Text>
          <TouchableOpacity onPress={handleAddCard} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#8B5CF6" />
          </TouchableOpacity>
        </View>


        {/* ============ CAROUSEL SA KARTICAMA ============ */}
        <FlatList
          data={cardsData || []}
          renderItem={renderCard}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          horizontal                           // Horizontalno skrolovanje
          pagingEnabled                        // Skroluje se kartica po kartica
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}     // Svaka kartica "skace" na mjesto
          decelerationRate="fast"              // Brzo se zaustavlja
          contentContainerStyle={styles.carouselContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />


        {/* ============ INDIKATORI (TACKICE) ============ */}
        {/* Pokazuju koja kartica je trenutno vidljiva */}
        <View style={styles.indicators}>
          {(cardsData || []).map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === activeCardIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>


        {/* ============ BRZE AKCIJE ============ */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            {/* Blokiraj karticu */}
            <TouchableOpacity style={styles.quickActionItem} onPress={handleBlockCard}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#EF444420' }]}>
                <Ionicons name="lock-closed" size={22} color="#EF4444" />
              </View>
              <Text style={styles.quickActionText}>Block Card</Text>
            </TouchableOpacity>

            {/* Postavke */}
            <TouchableOpacity style={styles.quickActionItem} onPress={handleCardSettings}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF620' }]}>
                <Ionicons name="settings" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>

            {/* Limiti */}
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="speedometer" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionText}>Limits</Text>
            </TouchableOpacity>

            {/* Detalji */}
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="document-text" size={22} color="#10B981" />
              </View>
              <Text style={styles.quickActionText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* ============ TRANSAKCIJE KARTICE ============ */}
        <View style={styles.transactionsSection}>
          <SectionHeader title="Card Transactions" showSeeMore={false} />
          
          <View style={styles.transactionsList}>
            {cardTransactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => {
                  setSelectedTransaction(transaction);
                  setDetailModalVisible(true);
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>


      {/* ============ MODAL ZA DETALJE ============ */}
      <TransactionDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        transaction={selectedTransaction}
      />
    </SafeAreaView>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  
  // Zaglavlje
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E1E3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Carousel
  carouselContainer: {
    paddingHorizontal: 20,
  },
  
  // Kontejner jedne kartice
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Sama kartica
  card: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 22,
    height: 230, 
  },
  
  // Gornji red kartice
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  
  // Chip (zlatni pravougaonik)
  cardChip: {
    width: 44,
    height: 32,
    backgroundColor: '#D4AF37',  // Zlatna boja
    borderRadius: 6,
    padding: 6,
    justifyContent: 'space-around',
  },
  chipLine: {
    height: 2,
    backgroundColor: '#B8960C',
    borderRadius: 1,
  },
  
  // Tip kartice
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  wifiIcon: {
    marginLeft: 8,
    transform: [{ rotate: '90deg' }],  // Rotiram ikonu za 90 stepeni
  },
  
  // Broj kartice
  cardNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 3.5,
    marginBottom: 24, 
  },
  
  // Donji red
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#A0A0C0',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardHolderName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  cardExpiry: {
    alignItems: 'flex-end',
  },
  cardExpiryDate: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  
  // Balans na kartici
  cardBalanceContainer: {
    marginTop: 16,
  },
  cardBalanceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#A0A0C0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBalance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  
  // Indikatori (tackice)
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3D3D6B',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#8B5CF6',
    width: 24,  // Aktivni indikator je siri
  },
  
  // Brze akcije
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#A0A0C0',
    textAlign: 'center',
  },
  
  // Transakcije
  transactionsSection: {
    paddingHorizontal: 20,
  },
  transactionsList: {
    marginTop: 5,
  },
});

export default CardsScreen;
