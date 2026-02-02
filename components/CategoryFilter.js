// ============================================
// CATEGORYFILTER.JS - FILTER PO KATEGORIJAMA
// ============================================
// Ova komponenta prikazuje horizontalnu listu dugmadi.
// Korisnik moze kliknuti na kategoriju da filtrira transakcije.
// Na primjer: "All", "Expenses", "Income", "Transfers"
// 
// Odabrana kategorija ima ljubicastu pozadinu.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


// Komponenta prima:
// - categories: lista kategorija [{ id: 'all', name: 'All' }, ...]
// - selectedCategory: ID trenutno odabrane kategorije
// - onSelectCategory: funkcija koja se poziva kada odaberem kategoriju
const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    // ScrollView omogucava horizontalno skrolovanje ako ima puno kategorija
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Prolazim kroz sve kategorije i pravim dugme za svaku */}
      {categories.map((category) => {
        // Provjeravam da li je ova kategorija trenutno odabrana
        const isSelected = selectedCategory === category.id;
        
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id)}  // Pozivam funkciju sa ID-om
            activeOpacity={0.8}
            style={[
              styles.categoryButton,
              // Ako je odabrana, dodajem dodatne stilove
              isSelected && styles.categoryButtonSelected
            ]}
          >
            <Text style={[
              styles.categoryText,
              // Ako je odabrana, tekst je bijeli
              isSelected && styles.categoryTextSelected
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Kontejner - horizontalni raspored
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  
  // Dugme kategorije - siva pozadina
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,          // Zaobljeno kao pilula
    backgroundColor: '#2D2D5A',
    marginRight: 10,           // Razmak izmedju dugmadi
    borderWidth: 1,
    borderColor: '#3D3D6B',
  },
  
  // Dugme kada je odabrano - ljubicasta pozadina
  categoryButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  
  // Tekst u dugmetu - sivi
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#A0A0C0',
  },
  
  // Tekst kada je odabrano - bijeli
  categoryTextSelected: {
    color: '#FFFFFF',
  },
});

export default CategoryFilter;
