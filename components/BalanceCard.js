// BalanceCard.js - Komponenta za prikaz ukupnog balansa
// Prikazuje glavni balans korisnika sa prihodima i rashodima
// Koristi LinearGradient za lijepu pozadinu

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Komponenta prima balance, income i outcome kao props
// Props su kao "argumenti" koje saljemo komponenti kada je koristimo
const BalanceCard = ({ balance, income, outcome }) => {
  
  // Funkcija za formatiranje novca (dodaje $ i zareze)
  // Npr: 17298.92 postaje "$17,298.92"
  const formatMoney = (amount) => {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    // LinearGradient pravi lijepi prelaz boja u pozadini
    <LinearGradient
      colors={['#2D2D5A', '#1E1E3A']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Naslov "Total Balance" */}
      <Text style={styles.label}>Total Balance</Text>
      
      {/* Glavni iznos balansa - najveci tekst */}
      <Text style={styles.balance}>{formatMoney(balance)}</Text>
      
      {/* Red sa prihodima i rashodima */}
      <View style={styles.statsRow}>
        {/* Lijeva strana - prihodi (Income) */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>{formatMoney(income)}</Text>
        </View>
        
        {/* Desna strana - rashodi (Outcome) */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Outcome</Text>
          <Text style={styles.statValue}>{formatMoney(outcome)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// Stilovi za komponentu
const styles = StyleSheet.create({
  // Glavni kontejner sa zaobljenim uglovima
  container: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  // Stil za "Total Balance" tekst
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 5,
  },
  // Stil za glavni iznos - veliki i boldovan
  balance: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  // Red koji drzi Income i Outcome
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Pojedinacni stat item
  statItem: {
    flex: 1,
  },
  // Labela za stat (Income/Outcome)
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
    marginBottom: 2,
  },
  // Vrijednost stata
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default BalanceCard;
