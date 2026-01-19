// WalletScreen.js - Ekran sa karticama i wallet funkcijama

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Uvozimo podatke iz JSON fajlova
import cards from '../data/cards.json';

// Uzimamo sirinu ekrana za racunanje velicine kartice
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;

// KOMPONENTA ZA KARTICU
// Prikazuje jednu bankovnu karticu
function CardItem({ card }) {
  return (
    <View style={[styles.card, { backgroundColor: card.backgroundColor }]}>
      {/* Gornji dio kartice - naslov i + dugme */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Wallet</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Balans */}
      <Text style={styles.cardBalance}>${card.balance.toLocaleString()}</Text>
      
      {/* Broj racuna */}
      <Text style={styles.cardAccount}>Account **{card.lastFourDigits}</Text>

      {/* Male tackice za indikaciju drugih kartica */}
      <View style={styles.cardDots}>
        <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
        <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
      </View>
    </View>
  );
}

// KOMPONENTA ZA BRZU AKCIJU
// Prikazuje ikonu i tekst za brze akcije
function QuickAction({ icon, label }) {
  return (
    <TouchableOpacity style={styles.quickAction}>
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// KOMPONENTA ZA CASHBACK IKONU
function CashbackIcon({ color, icon }) {
  return (
    <View style={[styles.cashbackIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={16} color="#FFFFFF" />
    </View>
  );
}

// GLAVNA KOMPONENTA
export default function WalletScreen() {
  // State za pracenje aktivne kartice u carousel-u
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER - search bar i ikone */}
      <View style={styles.header}>
        {/* Profilna ikona */}
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person" size={20} color="#4ADE80" />
        </TouchableOpacity>
        
        {/* Search bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <Text style={styles.searchText}>Search</Text>
        </View>
        
        {/* Notifikacije i profil */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CAROUSEL SA KARTICAMA */}
      {/* FlatList sa horizontal={true} pravi horizontalni scroll */}
      <FlatList
        data={cards}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.cardsContainer}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CardItem card={item} />}
        onMomentumScrollEnd={(event) => {
          // Racunamo koji index kartice je prikazan
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (CARD_WIDTH + 16)
          );
          setActiveIndex(index);
        }}
      />

      {/* TRANSACTIONS I CASHBACK SEKCIJA */}
      <View style={styles.infoRow}>
        {/* Transactions box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Transactions</Text>
          <Text style={styles.infoSubtitle}>Spent in october</Text>
          <View style={styles.transactionDots}>
            <View style={[styles.smallDot, { backgroundColor: '#3B82F6' }]} />
            <View style={[styles.smallDot, { backgroundColor: '#FBBF24' }]} />
            <View style={[styles.smallDot, { backgroundColor: '#4ADE80' }]} />
            <View style={[styles.smallDot, { backgroundColor: '#A78BFA' }]} />
          </View>
        </View>

        {/* Cashback box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Cashback</Text>
          <View style={styles.cashbackIcons}>
            <CashbackIcon color="#3B82F6" icon="cart" />
            <CashbackIcon color="#EF4444" icon="fast-food" />
            <CashbackIcon color="#F97316" icon="logo-amazon" />
            <CashbackIcon color="#22C55E" icon="musical-notes" />
          </View>
        </View>
      </View>

      {/* BRZE AKCIJE */}
      <View style={styles.quickActionsRow}>
        <QuickAction icon="add" label="Tips and training" />
        <QuickAction icon="grid" label="All services" />
      </View>

      {/* REFER AND EARN SEKCIJA */}
      <View style={styles.referBox}>
        <View style={styles.referContent}>
          <Text style={styles.referTitle}>Refer and Earn</Text>
          <Text style={styles.referDesc}>
            Share a referral link to your friend and get rewarded
          </Text>
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn more</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.referImage}>
          <Ionicons name="gift" size={60} color="#6B7280" />
        </View>
      </View>

      {/* Prazan prostor za bottom tab bar */}
      <View style={{ height: 100 }} />
    </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A24',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 12,
  },
  searchText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 8,
  },
  // Kartice stilovi
  cardsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  cardAccount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  cardDots: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  // Info sekcija stilovi
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#1A1A24',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionDots: {
    flexDirection: 'row',
    marginTop: 12,
  },
  smallDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  cashbackIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cashbackIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  // Brze akcije stilovi
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#1A1A24',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2D2D3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Refer and Earn stilovi
  referBox: {
    flexDirection: 'row',
    backgroundColor: '#1A1A24',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
  },
  referContent: {
    flex: 1,
  },
  referTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  referDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 18,
  },
  learnMoreButton: {
    marginTop: 12,
  },
  learnMoreText: {
    fontSize: 13,
    color: '#4ADE80',
    fontWeight: '600',
  },
  referImage: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
