// OverviewScreen.js - Ekran sa pregledom statistike
// Prikazuje grafikon, karticu, i filtrirane transakcije
// Koristi komponente za cist kod

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Uvoz komponenti
import { 
  CreditCard, 
  StatisticsBar, 
  CategoryFilter,
  SectionHeader,
  TransactionItem,
  TransactionDetailModal
} from '../components';

// Uvoz podataka
import transactionsData from '../data/transactions.json';
import cardsData from '../data/cards.json';
import categoriesData from '../data/categories.json';
import balanceHistoryData from '../data/balanceHistory.json';

const OverviewScreen = ({ navigation }) => {

  // State
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Animacije
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // SIGURNO DOHVATANJE PODATAKA
  const card = cardsData?.[0] || null;

  const weeklyStats = balanceHistoryData?.weeklyStats || [];

  const maxAmount =
    weeklyStats.length > 0
      ? Math.max(...weeklyStats.map(stat => stat.amount))
      : 0;

  const filteredTransactions =
    selectedCategory === 'all'
      ? transactionsData || []
      : (transactionsData || []).filter(t => {
          if (selectedCategory === 'expenses') return t.amount < 0;
          if (selectedCategory === 'income') return t.amount > 0;
          if (selectedCategory === 'transfers') return t.category === 'transfer';
          return true;
        });

  // Handleri
  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  const currentMonth = 'Jun 2025';
  const currentDate = '28 June 2025';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* ZAGLAVLJE */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Overview</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* MJESEC I BALANS */}
          <View style={styles.monthSection}>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <Text style={styles.balanceAmount}>$1,924.30</Text>
            <Text style={styles.balanceChange}>-$433.35</Text>
          </View>

          {/* KARTICA */}
          {card && <CreditCard card={card} style={styles.cardSection} />}

          {/* STATISTIKA */}
          <SectionHeader title="Statistics" onSeeMore={() => {}} />

          <View style={styles.statisticsContainer}>
            {weeklyStats.map((stat, index) => (
              <StatisticsBar
                key={stat?.day || index}
                day={stat?.day}
                amount={stat?.amount || 0}
                maxAmount={maxAmount}
                isSelected={selectedDay === index}
                onPress={() =>
                  setSelectedDay(selectedDay === index ? null : index)
                }
              />
            ))}
          </View>

          {/* DATUM I FILTER */}
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* KATEGORIJE FILTER */}
          <CategoryFilter
            categories={[
              { id: 'all', name: 'All' },
              ...(categoriesData || []).filter(c => c?.name),
            ]}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* LISTA TRANSAKCIJA */}
          <View style={styles.transactionsList}>
            {filteredTransactions.slice(0, 8).map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E1E3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E1E3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 5,
  },
  balanceAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  balanceChange: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#EF4444',
    marginTop: 2,
  },
  cardSection: {
    marginBottom: 20,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E3A',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  seeMoreText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
  },
  transactionsList: {
    marginTop: 10,
  },
});

export default OverviewScreen;
