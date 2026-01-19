// CardsScreen.js - Ekran za prikaz svih kartica

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
import cards from '../data/cards.json';
import transactions from '../data/transactions.json';

// KOMPONENTA ZA VELIKU KARTICU
// Prikazuje detalje odabrane kartice
function BigCardItem({ card }) {
  return (
    <View style={[styles.bigCard, { backgroundColor: card.backgroundColor }]}>
      {/* Tip kartice (VISA, MASTERCARD...) */}
      <View style={styles.cardTypeBox}>
        <Text style={styles.cardType}>{card.cardType.toUpperCase()}</Text>
      </View>

      {/* Broj kartice */}
      <Text style={styles.cardNumber}>{card.cardNumber}</Text>

      {/* Donji dio - vlasnik i datum isteka */}
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardLabel}>Card Holder</Text>
          <Text style={styles.cardValue}>{card.cardHolder}</Text>
        </View>
        <View>
          <Text style={styles.cardLabel}>Expires</Text>
          <Text style={styles.cardValue}>{card.expiryDate}</Text>
        </View>
      </View>

      {/* Balans u donjem desnom uglu */}
      <View style={styles.cardBalanceBox}>
        <Text style={styles.cardBalanceLabel}>Balance</Text>
        <Text style={styles.cardBalanceText}>${card.balance.toLocaleString()}</Text>
      </View>
    </View>
  );
}

// KOMPONENTA ZA MALU KARTICU U LISTI
// Prikazuje malu verziju kartice za odabir
function SmallCardItem({ card, isSelected, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.smallCard,
          { backgroundColor: card.backgroundColor },
          isSelected && styles.smallCardSelected,
        ]}
      >
        <Text style={styles.smallCardNumber}>****{card.lastFourDigits}</Text>
        <Text style={styles.smallCardBalance}>${card.balance.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

// KOMPONENTA ZA TRANSAKCIJU
function TransactionItem({ item }) {
  const isIncome = item.type === 'income';

  return (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={18} color={item.color} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.transactionDesc}>{item.description}</Text>
      </View>
      <Text style={[styles.transactionAmount, isIncome && styles.incomeText]}>
        {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
    </View>
  );
}

// GLAVNA KOMPONENTA
export default function CardsScreen() {
  // State za pracenje odabrane kartice
  const [selectedCard, setSelectedCard] = useState(cards[0]);

  // Uzimamo samo prve 4 transakcije za prikaz
  const cardTransactions = transactions.slice(0, 4);

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cards</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#4ADE80" />
        </TouchableOpacity>
      </View>

      {/* LISTA MALIH KARTICA */}
      <View style={styles.smallCardsBox}>
        <FlatList
          data={cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.smallCardsList}
          renderItem={({ item }) => (
            <SmallCardItem
              card={item}
              isSelected={selectedCard.id === item.id}
              onPress={() => setSelectedCard(item)}
            />
          )}
        />
      </View>

      {/* VELIKA KARTICA */}
      <View style={styles.bigCardBox}>
        <BigCardItem card={selectedCard} />
      </View>

      {/* AKCIJE (Send, Receive, Exchange, More) */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionLabel}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionLabel}>Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionLabel}>Exchange</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionLabel}>More</Text>
        </TouchableOpacity>
      </View>

      {/* NEDAVNE TRANSAKCIJE */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={cardTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TransactionItem item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

// STILOVI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D12',
  },
  // Header stilovi
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Male kartice stilovi
  smallCardsBox: {
    marginTop: 8,
  },
  smallCardsList: {
    paddingHorizontal: 20,
  },
  smallCard: {
    width: 100,
    height: 60,
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    justifyContent: 'space-between',
    opacity: 0.7,
  },
  smallCardSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#4ADE80',
  },
  smallCardNumber: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  smallCardBalance: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Velika kartica stilovi
  bigCardBox: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bigCard: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    padding: 20,
  },
  cardTypeBox: {
    alignSelf: 'flex-end',
  },
  cardType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  cardValue: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
    fontWeight: '600',
  },
  cardBalanceBox: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  cardBalanceLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  cardBalanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Akcije stilovi
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  // Transakcije stilovi
  transactionsSection: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  incomeText: {
    color: '#4ADE80',
  },
});
