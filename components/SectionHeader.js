// ============================================
// SECTIONHEADER.JS - NASLOV SEKCIJE
// ============================================
// Ova komponenta prikazuje naslov iznad svake sekcije.
// Ima:
// - Naslov na lijevoj strani
// - "See More >" dugme na desnoj strani (opciono)
//
// Koristim je za naslove kao:
// - "Recent Transaction"
// - "Quick Money Transfer"
// - "Statistics"

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


// Komponenta prima:
// - title: tekst naslova
// - onSeeMore: funkcija kada se klikne "See More"
// - showSeeMore: da li prikazati "See More" (default je true)
const SectionHeader = ({ title, onSeeMore, showSeeMore = true }) => {
  return (
    <View style={styles.container}>
      {/* Naslov na lijevoj strani */}
      <Text style={styles.title}>{title}</Text>
      
      {/* "See More" dugme na desnoj strani */}
      {/* Prikazujem samo ako je showSeeMore true */}
      {showSeeMore && (
        <TouchableOpacity onPress={onSeeMore} activeOpacity={0.7}>
          <Text style={styles.seeMore}>See More &gt;</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Kontejner - horizontalni raspored sa razmakom
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Stavlja razmak izmedju
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  
  // Naslov - bijeli i polu-debeli
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  
  // "See More" tekst - sivi i manji
  seeMore: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
  },
});

export default SectionHeader;
