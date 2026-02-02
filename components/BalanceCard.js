// ============================================
// BALANCECARD.JS - KARTICA SA BALANSOM
// ============================================
// Ova komponenta prikazuje koliko novca imam.
// Pokazuje:
// - Ukupni balans (Total Balance)
// - Koliko sam zaradio (Income)
// - Koliko sam potrosio (Outcome)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


// Komponenta prima tri "propsa" (podatka):
// - balance: ukupno novca
// - income: prihodi
// - outcome: rashodi
const BalanceCard = ({ balance, income, outcome }) => {
  
  // ============================================
  // FUNKCIJA ZA FORMATIRANJE NOVCA
  // ============================================
  // Pretvaram broj u lijepi format sa dolarskim znakom
  // Na primjer: 17298.92 postaje "$17,298.92"
  const formatMoney = (amount) => {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,  // Uvijek 2 decimale
      maximumFractionDigits: 2
    });
  };


  // ============================================
  // CRTAM KOMPONENTU
  // ============================================
  return (
    // LinearGradient pravi lijepi preliv boja (od ljubicaste do tamnije)
    <LinearGradient
      colors={['#2D2D5A', '#1E1E3A']}
      style={styles.container}
      start={{ x: 0, y: 0 }}   // Pocinje gore lijevo
      end={{ x: 1, y: 1 }}     // Zavrsava dolje desno
    >
      {/* Naslov "Total Balance" */}
      <Text style={styles.label}>Total Balance</Text>
      
      {/* Glavni iznos - ovo je najveci tekst na kartici */}
      <Text style={styles.balance}>{formatMoney(balance)}</Text>
      
      {/* Red sa prihodima i rashodima */}
      <View style={styles.statsRow}>
        {/* Lijeva strana - prihodi */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>{formatMoney(income)}</Text>
        </View>
        
        {/* Desna strana - rashodi */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Outcome</Text>
          <Text style={styles.statValue}>{formatMoney(outcome)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner kartice
  container: {
    borderRadius: 20,    // Zaobljeni uglovi
    padding: 20,         // Razmak unutar kartice
    marginBottom: 20,    // Razmak ispod kartice
  },
  
  // Tekst "Total Balance"
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A0A0C0',    // Siva boja
    marginBottom: 5,
  },
  
  // Glavni iznos - veliki i debeli
  balance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#FFFFFF',    // Bijela boja
    marginBottom: 15,
  },
  
  // Red sa Income i Outcome
  statsRow: {
    flexDirection: 'row',           // Poredaj horizontalno
    justifyContent: 'space-between', // Rasporedi sa razmakom
  },
  
  // Jedan stat (Income ili Outcome)
  statItem: {
    flex: 1,  // Zauzmi jednak prostor
  },
  
  // Labela (Income/Outcome)
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
    marginBottom: 2,
  },
  
  // Vrijednost
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default BalanceCard;
