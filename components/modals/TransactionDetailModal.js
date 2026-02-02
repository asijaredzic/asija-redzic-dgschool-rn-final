// ============================================================
// TRANSACTION DETAIL MODAL - Prozor sa detaljima transakcije
// ============================================================
// Ja sam napravio ovaj prozor da pokazuje sve informacije
// o jednoj transakciji kad korisnik klikne na nju.
// Pokazuje: ime, iznos, datum, kategoriju, status, itd.
// ============================================================

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseModal from './BaseModal';

// Komponenta prima tri stvari:
// visible = da li je prozor vidljiv
// onClose = funkcija za zatvaranje
// transaction = podaci o transakciji koju prikazujemo
const TransactionDetailModal = ({ visible, onClose, transaction }) => {
  
  // Ako nema transakcije, ne prikazujem nista
  // Ovo je zastita da se aplikacija ne srusi
  if (!transaction) return null;

  // ========== POMOCNE FUNKCIJE ==========
  
  // Ova funkcija formatira novac lijepo
  // Na primjer: -50 postaje "-$50.00", a 100 postaje "+$100.00"
  const formatMoney = (amount) => {
    const isNegative = amount < 0;  // Da li je negativan broj?
    
    // Pravim lijepi format sa zarezima i decimalama
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Dodajem minus ili plus ispred
    return isNegative ? `-$${formatted}` : `+$${formatted}`;
  };

  // Ova funkcija vraca ikonu za svaku kategoriju
  // Svaka kategorija ima svoju ikonu da je lakse prepoznati
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'subscription': return 'logo-dribbble';    // Pretplate
      case 'transfer': return 'swap-horizontal';       // Transferi
      case 'food': return 'fast-food';                 // Hrana
      case 'shopping': return 'cart';                  // Kupovina
      case 'transport': return 'car';                  // Prevoz
      case 'salary': return 'wallet';                  // Plata
      case 'freelance': return 'laptop';               // Freelance posao
      default: return 'cash';                          // Sve ostalo
    }
  };

  // Ova funkcija vraca boju za svaku kategoriju
  // Svaka kategorija ima svoju boju da je lakse prepoznati
  const getCategoryColor = (category) => {
    switch (category) {
      case 'subscription': return '#EC4899';  // Roza
      case 'transfer': return '#8B5CF6';      // Ljubicasta
      case 'food': return '#F59E0B';          // Narandzasta
      case 'shopping': return '#3B82F6';      // Plava
      case 'transport': return '#10B981';     // Zelena
      case 'salary': return '#10B981';        // Zelena
      case 'freelance': return '#6366F1';     // Indigo
      default: return '#6B7280';              // Siva
    }
  };

  // Ova funkcija vraca imena kategorija
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

  // Da li je ovo trosak (negativan iznos)?
  const isExpense = transaction.amount < 0;

  // ========== RENDEROVANJE ==========
  return (
    <BaseModal visible={visible} onClose={onClose} title="Transaction Details">
      
      {/* ========== ZAGLAVLJE ========== */}
      <View style={styles.header}>
        
        {/* Slika ili ikona transakcije */}
        {transaction.image ? (
          // Ako ima sliku, pokazujem sliku
          <Image source={{ uri: transaction.image }} style={styles.headerImage} />
        ) : (
          // Ako nema sliku, pokazujem ikonu kategorije
          <View style={[
            styles.headerIcon,
            // Boja pozadine je boja kategorije + prozirnost
            { backgroundColor: getCategoryColor(transaction.category) + '20' }
          ]}>
            <Ionicons 
              name={getCategoryIcon(transaction.category)} 
              size={40} 
              color={getCategoryColor(transaction.category)} 
            />
          </View>
        )}
        
        {/* Ime transakcije */}
        <Text style={styles.transactionName}>{transaction.name}</Text>
        
        {/* Iznos - crveno ako je trosak, zeleno ako je dobitak */}
        <Text style={[
          styles.transactionAmount,
          { color: isExpense ? '#EF4444' : '#10B981' }
        ]}>
          {formatMoney(transaction.amount)}
        </Text>
      </View>

      {/* ========== DETALJI ========== */}
      <View style={styles.detailsContainer}>
        
        {/* STATUS */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Zavrseno</Text>
          </View>
        </View>

        {/* DATUM */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Datum</Text>
          <Text style={styles.detailValue}>{transaction.date}</Text>
        </View>

        {/* KATEGORIJA */}
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

        {/* TIP - rashod ili prihod */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tip</Text>
          <Text style={styles.detailValue}>
            {isExpense ? 'Rashod' : 'Prihod'}
          </Text>
        </View>

        {/* ID TRANSAKCIJE - svaka transakcija ima jedinstveni broj */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID Transakcije</Text>
          <Text style={styles.detailValueSmall}>
            TXN-{transaction.id}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* ========== NAPOMENA ========== */}
      <View style={styles.noteContainer}>
        <Ionicons name="information-circle" size={16} color="#A0A0C0" />
        <Text style={styles.noteText}>
          Ovo je demo transakcija za prikaz. U pravoj aplikaciji ovdje bi bili stvarni podaci.
        </Text>
      </View>
    </BaseModal>
  );
};

// ============================================================
// STILOVI
// ============================================================
const styles = StyleSheet.create({
  // ----- ZAGLAVLJE -----
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,            // Krug
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
  
  // ----- DETALJI -----
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
  
  // ----- STATUS BADGE -----
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',  // Zelena sa prozirnošcu
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,               // Mala tacka
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#10B981',
  },
  
  // ----- KATEGORIJA BADGE -----
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 6,
  },
  
  // ----- NAPOMENA -----
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
