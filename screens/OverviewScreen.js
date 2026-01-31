// OverviewScreen.js - Ekran sa pregledom statistike
// Prikazuje grafikon, karticu, i filtrirane transakcije
// Dodano: search, monthly comparison, defensive data handling

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Komponente
import {
  CreditCard,
  StatisticsBar,
  CategoryFilter,
  SectionHeader,
  TransactionItem,
  TransactionDetailModal,
} from '../components';

// Podaci
import rawTransactions from '../data/transactions.json';
import rawCards from '../data/cards.json';
import rawCategories from '../data/categories.json';
import rawBalanceHistory from '../data/balanceHistory.json';

// Utils — date parsing for strings like "June 28"
const MONTHS = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const parseTransactionDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  // expected formats: "June 28" or "Jun 28" or "June 28, 2025"
  const cleaned = dateString.replace(',', '').trim();
  const parts = cleaned.split(' ');
  if (parts.length < 2) return null;
  const monthPart = parts[0];
  const dayPart = parts[1];
  const monthFull = Object.keys(MONTHS).find(m => m.toLowerCase().startsWith(monthPart.toLowerCase()));
  const monthIndex = typeof monthFull === 'string' ? MONTHS[monthFull] : undefined;
  if (monthIndex === undefined) return null;
  const day = parseInt(dayPart, 10);
  if (Number.isNaN(day)) return null;
  // We don't have year in transactions.json — assume 2025 (matches your balanceHistory)
  return new Date(2025, monthIndex, day);
};

// =========================
// Component
// =========================
const OverviewScreen = ({ navigation }) => {
  // STATE
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ANIMACIJA
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // =========================
  // 🔒 NORMALIZACIJA PODATAKA
  // =========================
  const cards = Array.isArray(rawCards) ? rawCards : [];
  const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  const weeklyStats = Array.isArray(rawBalanceHistory?.weeklyData)
    ? rawBalanceHistory.weeklyData
    : [];

  const card = cards[0] ?? null;

  const maxAmount =
    weeklyStats.length > 0
      ? Math.max(...weeklyStats.map(stat => Number(stat?.amount) || 0))
      : 0;

  // =========================
  // Monthly comparison (this month vs last month)
  // =========================
  // Determine reference month: prefer balanceHistory.currentMonth, fallback to month of newest transaction
  const refMonthName = rawBalanceHistory?.currentMonth || null;
  let referenceMonthIndex = null;
  if (refMonthName) {
    const found = Object.keys(MONTHS).find(m => m.toLowerCase().startsWith(refMonthName.toLowerCase()));
    referenceMonthIndex = typeof found === 'string' ? MONTHS[found] : null;
  }

  if (referenceMonthIndex === null) {
    // fallback: find latest transaction date
    const dates = transactions
      .map(t => parseTransactionDate(t?.date))
      .filter(Boolean);
    if (dates.length > 0) {
      const latest = dates.reduce((a, b) => (a > b ? a : b));
      referenceMonthIndex = latest.getMonth();
    } else {
      referenceMonthIndex = new Date().getMonth();
    }
  }

  const thisMonthTotal = transactions.reduce((sum, t) => {
    const d = parseTransactionDate(t?.date);
    if (!d) return sum;
    if (d.getMonth() === referenceMonthIndex) return sum + Number(t.amount || 0);
    return sum;
  }, 0);

  const lastMonthIndex = referenceMonthIndex - 1 < 0 ? 11 : referenceMonthIndex - 1;

  const lastMonthTotal = transactions.reduce((sum, t) => {
    const d = parseTransactionDate(t?.date);
    if (!d) return sum;
    if (d.getMonth() === lastMonthIndex) return sum + Number(t.amount || 0);
    return sum;
  }, 0);

  const percentageChange =
    Math.abs(lastMonthTotal) > 0
      ? ((thisMonthTotal - lastMonthTotal) / Math.abs(lastMonthTotal)) * 100
      : 0;
  const isPositive = percentageChange >= 0;

  // =========================
  // FILTER + SEARCH
  // =========================
  const filteredTransactions = transactions.filter(t => {
    if (!t) return false;

    // CATEGORY FILTER
    if (selectedCategory === 'expenses') {
      if (t.type && t.type.toLowerCase() !== 'expense' && Number(t.amount) >= 0) return false;
    }
    if (selectedCategory === 'income') {
      if (t.type && t.type.toLowerCase() !== 'income' && Number(t.amount) <= 0) return false;
    }
    if (selectedCategory === 'transfers') {
      const cat = (t.category || '').toLowerCase();
      if (!cat.includes('transfer')) return false;
    }

    // SEARCH
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = (t.title || t.name || '').toString().toLowerCase().includes(q);
      const matchesCategory = (t.category || '').toString().toLowerCase().includes(q);
      const matchesAmount = String(t.amount).toLowerCase().includes(q);
      return matchesTitle || matchesCategory || matchesAmount;
    }

    return true;
  });

  // HANDLERI
  const handleTransactionPress = transaction => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  // UI helpers
  const displayMonthLabel = rawBalanceHistory?.currentMonth ??
    Object.keys(MONTHS).find(k => MONTHS[k] === referenceMonthIndex) ?? 'Month';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Overview</Text>

          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#A0A0C0" />
          <TextInput
            placeholder="Search transactions"
            placeholderTextColor="#7E7E9A"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={18} color="#A0A0C0" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* MONTH + COMPARISON */}
          <View style={styles.monthSection}>
            <Text style={styles.monthText}>{displayMonthLabel}</Text>
            <Text style={styles.balanceAmount}>${thisMonthTotal.toFixed(2)}</Text>

            <Text style={[styles.balanceChange, { color: isPositive ? '#10B981' : '#EF4444' }]}>
              {isPositive ? '▲' : '▼'} {Math.abs(percentageChange).toFixed(1)}% vs last month
            </Text>
          </View>

          {/* CARD */}
          {card ? <CreditCard card={card} style={styles.cardSection} /> : null}

          {/* STATISTICS */}
          <SectionHeader title="Statistics" onSeeMore={() => {}} />

          <View style={styles.statisticsContainer}>
            {weeklyStats.map((stat, index) => (
              <StatisticsBar
                key={stat?.day ?? index}
                day={stat?.day ?? ''}
                amount={Number(stat?.amount) || 0}
                maxAmount={maxAmount}
                isSelected={selectedDay === index}
                onPress={() => setSelectedDay(selectedDay === index ? null : index)}
              />
            ))}
          </View>

          {/* DATE */}
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{rawBalanceHistory?.currentDate ?? ''}</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* CATEGORY FILTER */}
          <CategoryFilter
            categories={[{ id: 'all', name: 'All' }, ...categories.filter(c => c?.name)]}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* TRANSACTIONS */}
          <View style={styles.transactionsList}>
            {filteredTransactions.slice(0, 8).map(transaction => (
              <TransactionItem
                key={transaction?.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))}

            {filteredTransactions.length === 0 && (
              <Text style={styles.emptyText}>No transactions found</Text>
            )}
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
    marginBottom: 12,
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121226',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  monthSection: {
    alignItems: 'center',
    marginBottom: 12,
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
  emptyText: {
    color: '#A0A0C0',
    textAlign: 'center',
    marginTop: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default OverviewScreen;