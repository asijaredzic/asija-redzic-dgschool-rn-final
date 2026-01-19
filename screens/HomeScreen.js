// HomeScreen.js - Glavni ekran sa prikazom potrosnje i transakcija

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Uvozimo podatke iz JSON fajlova
import transactions from '../data/transactions.json';

// KOMPONENTA ZA KRUG POTROSNJE
// Ovo je jednostavan krug koji prikazuje koliko smo potrosili
function SpendingCircle({ totalSpent }) {
  return (
    <View style={styles.circleContainer}>
      {/* Vanjski krug - crvena boja */}
      <View style={styles.outerCircle}>
        {/* Srednji krug - zuta boja */}
        <View style={styles.middleCircle}>
          {/* Unutrasnji krug - zelena boja */}
          <View style={styles.innerCircle}>
            {/* Centar sa tekstom */}
            <View style={styles.centerCircle}>
              <Text style={styles.spentLabel}>Spent this month</Text>
              <Text style={styles.spentAmount}>${totalSpent}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// KOMPONENTA ZA JEDNU TRANSAKCIJU
// Prikazuje ime, opis, iznos i vrijeme transakcije
function TransactionItem({ item }) {
  // Provjeravamo da li je transakcija prihod (income) ili trosak (expense)
  const isIncome = item.type === 'income';

  return (
    <View style={styles.transactionItem}>
      {/* Ikona transakcije */}
      <View style={[styles.transactionIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      
      {/* Informacije o transakciji */}
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.transactionDesc}>{item.description}</Text>
      </View>
      
      {/* Iznos i vrijeme */}
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, isIncome && styles.incomeText]}>
          {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
      </View>
    </View>
  );
}

// GLAVNA KOMPONENTA
export default function HomeScreen() {
  // State za odabrani period (Day, Week, Month, Year)
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  // Lista perioda za filter
  const periods = ['Day', 'Week', 'Month', 'Year'];

  // Ukupna potrosnja (hardkodirana za primjer)
  const totalSpent = '1,244.02';

  // HEADER KOMPONENTA za FlatList
  // Ovo se prikazuje iznad liste transakcija
  const ListHeader = () => (
    <View>
      {/* Navigacija na vrhu */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <Text style={styles.headerDate}>Oct 2023</Text>
      </View>

      {/* Krug potrosnje */}
      <SpendingCircle totalSpent={totalSpent} />

      {/* Period filter (Day, Week, Month, Year) */}
      <View style={styles.periodContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Naslov za transakcije */}
      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Transactions</Text>
        <Text style={styles.transactionsDate}>Today</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FlatList prikazuje listu transakcija */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem item={item} />}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// STILOVI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D12',
  },
  listContent: {
    paddingBottom: 100, // Prostor za bottom tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Stilovi za krug potrosnje
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    borderColor: '#EF4444', // Crvena
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 12,
    borderColor: '#FBBF24', // Zuta
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: '#4ADE80', // Zelena
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCircle: {
    alignItems: 'center',
  },
  spentLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  spentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  // Stilovi za period filter
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  periodButtonActive: {
    backgroundColor: '#1A1A24',
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Stilovi za transakcije
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  transactionsDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  incomeText: {
    color: '#4ADE80', // Zelena za prihode
  },
  transactionTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
