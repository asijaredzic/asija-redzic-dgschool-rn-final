// CategoryFilter.js - Komponenta za filtriranje po kategorijama
// Horizontalna lista dugmadi za odabir kategorije
// Koristi se u OverviewScreen za filtriranje transakcija

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Props: categories (lista kategorija), selectedCategory (odabrana kategorija), onSelectCategory (funkcija za odabir)
const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Mapiramo kroz sve kategorije i prikazujemo dugme za svaku */}
      {categories.map((category) => {
        // Provjeravamo da li je ova kategorija odabrana
        const isSelected = selectedCategory === category.id;
        
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            activeOpacity={0.8}
            style={[
              styles.categoryButton,
              isSelected && styles.categoryButtonSelected
            ]}
          >
            <Text style={[
              styles.categoryText,
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

const styles = StyleSheet.create({
  // Kontejner - horizontalni sa razmakom
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  // Dugme kategorije - neodabrano
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2D2D5A',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#3D3D6B',
  },
  // Dugme kategorije - odabrano
  categoryButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  // Tekst kategorije - neodabran
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#A0A0C0',
  },
  // Tekst kategorije - odabran
  categoryTextSelected: {
    color: '#FFFFFF',
  },
});

export default CategoryFilter;
