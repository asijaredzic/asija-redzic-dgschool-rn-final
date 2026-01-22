// SectionHeader.js - Komponenta za zaglavlje sekcije
// Prikazuje naslov sekcije i "See More" dugme
// Koristi se za naslove kao "Recent Transaction", "Quick Money Transfer", itd.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Props: title (naslov), onSeeMore (funkcija za "See More" dugme), showSeeMore (da li prikazati dugme)
const SectionHeader = ({ title, onSeeMore, showSeeMore = true }) => {
  return (
    <View style={styles.container}>
      {/* Naslov sekcije */}
      <Text style={styles.title}>{title}</Text>
      
      {/* "See More" dugme - prikazuje se samo ako je showSeeMore true */}
      {showSeeMore && (
        <TouchableOpacity onPress={onSeeMore} activeOpacity={0.7}>
          <Text style={styles.seeMore}>See More &gt;</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Glavni kontejner - horizontalni layout sa space-between
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  // Naslov sekcije
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  // "See More" tekst
  seeMore: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
  },
});

export default SectionHeader;
