// CardsScreen.js - Ekran za pregled kartica
// Prikazuje carousel sa karticama i quick actions
// Ima animacije za lijepi prikaz

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Uvoz podataka
import cardsData from '../data/cards.json';
import transactionsData from '../data/transactions.json';

// Uvoz komponenti
import { TransactionItem, SectionHeader, TransactionDetailModal } from '../components';

// Dimenzije ekrana za carousel
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;

const CardsScreen = () => {
  
  // State za trenutni indeks kartice u carousel-u
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // State za modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Animacije
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

  // Formatiranje broja kartice
  const formatCardNumber = (number) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  // Formatiranje balansa
  const formatBalance = (balance) => {
    return '$' + balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Funkcija koja se poziva kada korisnik skroluje carousel
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveCardIndex(index);
  };

  // Quick actions funkcije
  const handleBlockCard = () => {
    Alert.alert(
      'Blokiranje kartice',
      'Da li ste sigurni da zelite blokirati ovu karticu?',
      [
        { text: 'Odustani', style: 'cancel' },
        { text: 'Blokiraj', style: 'destructive', onPress: () => {
          Alert.alert('Uspjesno', 'Kartica je blokirana');
        }}
      ]
    );
  };

  const handleCardSettings = () => {
    Alert.alert('Postavke kartice', 'Ovdje bi bile postavke kartice');
  };

  const handleAddCard = () => {
    Alert.alert('Nova kartica', 'Ovdje bi se dodala nova kartica');
  };

  // Renderovanje jedne kartice u carousel-u
  const renderCard = ({ item, index }) => {
    // Odredjujemo boje gradijenta na osnovu tipa kartice
    const gradientColors = item.type === 'visa' 
      ? ['#1E3A5F', '#0D1B2A'] 
      : ['#2D2D5A', '#1E1E3A'];

    return (
      <Animated.View 
        style={[
          styles.cardContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Gornji red - logo i chip */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardChip}>
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
            </View>
            <View style={styles.cardTypeContainer}>
              <Text style={styles.cardType}>{item.type.toUpperCase()}</Text>
              <Ionicons 
                name="wifi" 
                size={18} 
                color="#A0A0C0" 
                style={styles.wifiIcon}
              />
            </View>
          </View>

          {/* Broj kartice */}
          <Text style={styles.cardNumber}>{formatCardNumber(item.number)}</Text>

          {/* Donji red - ime i datum */}
          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardLabel}>Card Holder</Text>
              <Text style={styles.cardHolderName}>{item.holder}</Text>
            </View>
            <View style={styles.cardExpiry}>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardExpiryDate}>{item.expiry}</Text>
            </View>
          </View>

          {/* Balans */}
          <View style={styles.cardBalanceContainer}>
            <Text style={styles.cardBalanceLabel}>Balance</Text>
            <Text style={styles.cardBalance}>{formatBalance(item.balance)}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  // Dohvatamo transakcije za trenutnu karticu
  const cardTransactions = transactionsData.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ZAGLAVLJE */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cards</Text>
          <TouchableOpacity onPress={handleAddCard} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        {/* CAROUSEL SA KARTICAMA */}
        <FlatList
          data={cardsData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        {/* INDIKATORI */}
        <View style={styles.indicators}>
          {cardsData.map((_, index) => (
            <View 
              key={index}
              style={[
                styles.indicator,
                index === activeCardIndex && styles.indicatorActive
              ]}
            />
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {/* Block Card */}
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={handleBlockCard}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#EF444420' }]}>
                <Ionicons name="lock-closed" size={22} color="#EF4444" />
              </View>
              <Text style={styles.quickActionText}>Block Card</Text>
            </TouchableOpacity>

            {/* Card Settings */}
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={handleCardSettings}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF620' }]}>
                <Ionicons name="settings" size={22} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>

            {/* Card Limits */}
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="speedometer" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionText}>Limits</Text>
            </TouchableOpacity>

            {/* Card Details */}
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="document-text" size={22} color="#10B981" />
              </View>
              <Text style={styles.quickActionText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TRANSAKCIJE KARTICE */}
        <View style={styles.transactionsSection}>
          <SectionHeader title="Card Transactions" showSeeMore={false} />
          <View style={styles.transactionsList}>
            {cardTransactions.map((transaction) => (
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

        {/* Prazan prostor za tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* MODAL */}
      <TransactionDetailModal 
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        transaction={selectedTransaction}
      />
    </SafeAreaView>
  );
};

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
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    height: 200,
  },
  // Kartica elementi
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardChip: {
    width: 40,
    height: 30,
    backgroundColor: '#D4AF37',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'space-around',
  },
  chipLine: {
    height: 2,
    backgroundColor: '#B8960C',
    borderRadius: 1,
  },
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
    transform: [{ rotate: '90deg' }],
  },
  cardNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 15,
  },
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
  cardBalanceContainer: {
    marginTop: 10,
  },
  cardBalanceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#A0A0C0',
    textTransform: 'uppercase',
  },
  cardBalance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  // Indikatori
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
    width: 24,
  },
  // Quick Actions
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
