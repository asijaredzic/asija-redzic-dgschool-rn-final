// TransactionDetailModal.js - Modal za detalje transakcije
// Prikazuje sve informacije o odabranoj transakciji
// Otvara se kada korisnik klikne na neku transakciju

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseModal from './BaseModal';

// Props: visible, onClose, transaction (podaci o transakciji)
const TransactionDetailModal = ({ visible, onClose, transaction }) => {
  
  // Ako nema transakcije, ne prikazuj nista
  if (!transaction) return null;

  // Funkcija za formatiranje novca
  const formatMoney = (amount) => {
    const isNegative = amount < 0;
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return isNegative ? `-$${formatted}` : `+$${formatted}`;
  };

  // Funkcija za odabir ikone kategorije
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'subscription': return 'logo-dribbble';
      case 'transfer': return 'swap-horizontal';
      case 'food': return 'fast-food';
      case 'shopping': return 'cart';
      case 'transport': return 'car';
      case 'salary': return 'wallet';
      case 'freelance': return 'laptop';
      default: return 'cash';
    }
  };

  // Funkcija za odabir boje kategorije
  const getCategoryColor = (category) => {
    switch (category) {
      case 'subscription': return '#EC4899';
      case 'transfer': return '#8B5CF6';
      case 'food': return '#F59E0B';
      case 'shopping': return '#3B82F6';
      case 'transport': return '#10B981';
      case 'salary': return '#10B981';
      case 'freelance': return '#6366F1';
      default: return '#6B7280';
    }
  };

  // Funkcija za ime kategorije
  const getCategoryName = (category) => {
    switch (category) {
      case 'subscription': return 'Pretplata';
      case 'transfer': return 'Transfer';
      case 'food': return 'Hrana';
      case 'shopping': return 'Kupovina';
      case 'transport': return 'Prevoz';
      case 'salary': return 'Plata';
      case 'freelance': return 'Freelance';
      default: return 'Ostalo';
    }
  };

  const isExpense = transaction.amount < 0;

  return (
    <BaseModal visible={visible} onClose={onClose} title="Transaction Details">
      {/* Gornji dio sa ikonom/slikom */}
      <View style={styles.header}>
        {transaction.image ? (
          <Image source={{ uri: transaction.image }} style={styles.headerImage} />
        ) : (
          <View style={[
            styles.headerIcon,
            { backgroundColor: getCategoryColor(transaction.category) + '20' }
          ]}>
            <Ionicons 
              name={getCategoryIcon(transaction.category)} 
              size={40} 
              color={getCategoryColor(transaction.category)} 
            />
          </View>
        )}
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={[
          styles.transactionAmount,
          { color: isExpense ? '#EF4444' : '#10B981' }
        ]}>
          {formatMoney(transaction.amount)}
        </Text>
      </View>

      {/* Detalji transakcije */}
      <View style={styles.detailsContainer}>
        {/* Status */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Zavrseno</Text>
          </View>
        </View>

        {/* Datum */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Datum</Text>
          <Text style={styles.detailValue}>{transaction.date}</Text>
        </View>

        {/* Kategorija */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Kategorija</Text>
          <View style={styles.categoryBadge}>
            <Ionicons 
              name={getCategoryIcon(transaction.category)} 
              size={14} 
              color={getCategoryColor(transaction.category)} 
            />
            <Text style={[
              styles.categoryText,
              { color: getCategoryColor(transaction.category) }
            ]}>
              {getCategoryName(transaction.category)}
            </Text>
          </View>
        </View>

        {/* Tip transakcije */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tip</Text>
          <Text style={styles.detailValue}>
            {isExpense ? 'Rashod' : 'Prihod'}
          </Text>
        </View>

        {/* ID transakcije */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID Transakcije</Text>
          <Text style={styles.detailValueSmall}>
            TXN-{transaction.id}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Napomena na dnu */}
      <View style={styles.noteContainer}>
        <Ionicons name="information-circle" size={16} color="#A0A0C0" />
        <Text style={styles.noteText}>
          Ovo je demo transakcija za prikaz. U pravoj aplikaciji ovdje bi bili stvarni podaci.
        </Text>
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  // Zaglavlje
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  transactionAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
  },
  // Detalji
  detailsContainer: {
    backgroundColor: '#2D2D5A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3D3D6B',
  },
  detailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A0A0C0',
  },
  detailValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailValueSmall: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  // Status badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#10B981',
  },
  // Category badge
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 6,
  },
  // Napomena
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2D2D5A50',
    borderRadius: 12,
    padding: 12,
  },
  noteText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#A0A0C0',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

export default TransactionDetailModal;
