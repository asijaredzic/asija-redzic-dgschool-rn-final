// ============================================
// OVERVIEWSCREEN.JS - EKRAN SA STATISTIKOM
// ============================================
// Ovaj ekran prikazuje detaljniju statistiku o novcu.
// Ima:
// - Pretragu transakcija
// - Grafikon potrosnje po danima
// - Filter po kategorijama
// - Sve transakcije

import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,      // Polje za pretragu
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Moje komponente
import {
  CreditCard,               // Kartica sa balansom
  StatisticsBar,            // Stupac u grafikonu
  CategoryFilter,           // Dugmad za filtriranje
  SectionHeader,            // Naslov sekcije
  TransactionItem,          // Jedna transakcija
  TransactionDetailModal,   // Popup sa detaljima
} from '../components';

// Ucitavam podatke
import rawTransactions from '../data/transactions.json';
import rawCards from '../data/cards.json';
import rawCategories from '../data/categories.json';
import rawBalanceHistory from '../data/balanceHistory.json';


// ============================================
// POMOCNE STVARI ZA RAD SA DATUMIMA
// ============================================
// Ovo mi pomaze da pretvorim tekst "June 28" u pravi datum

// Lista mjeseci i njihovi brojevi (0-11)
const MONTHS = {
  January: 0, February: 1, March: 2, April: 3,
  May: 4, June: 5, July: 6, August: 7,
  September: 8, October: 9, November: 10, December: 11,
};

// Funkcija koja pretvara tekst u datum
// Na primjer: "June 28" postaje Date objekt
const parseTransactionDate = (dateString) => {
  // Ako nema datuma ili nije tekst, vracam null
  if (!dateString || typeof dateString !== 'string') return null;
  
  // Cistim tekst - uklonim zareze i razmake
  const cleaned = dateString.replace(',', '').trim();
  const parts = cleaned.split(' ');
  
  // Trebam bar mjesec i dan
  if (parts.length < 2) return null;
  
  const monthPart = parts[0];  // "June"
  const dayPart = parts[1];    // "28"
  
  // Trazim koji je to mjesec
  const monthFull = Object.keys(MONTHS).find(
    m => m.toLowerCase().startsWith(monthPart.toLowerCase())
  );
  const monthIndex = typeof monthFull === 'string' ? MONTHS[monthFull] : undefined;
  
  if (monthIndex === undefined) return null;
  
  // Pretavam dan u broj
  const day = parseInt(dayPart, 10);
  if (Number.isNaN(day)) return null;
  
  // Vracam datum (koristim 2025 jer nemam godinu u podacima)
  return new Date(2025, monthIndex, day);
};


// ============================================
// GLAVNA KOMPONENTA
// ============================================
const OverviewScreen = ({ navigation }) => {
  
  // ============================================
  // STATE VARIJABLE
  // ============================================
  
  // Koji dan je odabran u grafikonu
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Koja kategorija je odabrana za filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Da li je modal sa detaljima otvoren
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Koja transakcija je odabrana
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Tekst koji korisnik pise u pretragu
  const [searchQuery, setSearchQuery] = useState('');


  // ============================================
  // ANIMACIJA
  // ============================================
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);


  // ============================================
  // SIGURNOSNA PROVJERA PODATAKA
  // ============================================
  // Provjeravam da li su podaci liste (arrays)
  // Ako nisu, koristim prazne liste
  const cards = Array.isArray(rawCards) ? rawCards : [];
  const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  const weeklyStats = Array.isArray(rawBalanceHistory?.weeklyData)
    ? rawBalanceHistory.weeklyData
    : [];

  // Uzimam prvu karticu (ako postoji)
  const card = cards[0] ?? null;

  // Trazim najveci iznos za skaliranje grafikona
  const maxAmount = weeklyStats.length > 0
    ? Math.max(...weeklyStats.map(stat => Number(stat?.amount) || 0))
    : 0;


  // ============================================
  // POREDIM OVAJ MJESEC SA PROSIM
  // ============================================
  
  // Uzimam ime trenutnog mjeseca iz podataka
  const refMonthName = rawBalanceHistory?.currentMonth || null;
  let referenceMonthIndex = null;
  
  // Ako imam ime mjeseca, nalazim njegov broj
  if (refMonthName) {
    const found = Object.keys(MONTHS).find(
      m => m.toLowerCase().startsWith(refMonthName.toLowerCase())
    );
    referenceMonthIndex = typeof found === 'string' ? MONTHS[found] : null;
  }

  // Ako nisam nasla mjesec, uzimam najnoviju transakciju
  if (referenceMonthIndex === null) {
    const dates = transactions
      .map(t => parseTransactionDate(t?.date))
      .filter(Boolean);
    if (dates.length > 0) {
      const latest = dates.reduce((a, b) => (a > b ? a : b));
      referenceMonthIndex = latest.getMonth();
    } else {
      referenceMonthIndex = new Date().getMonth();
    }
  }

  // Racunam ukupno za ovaj mjesec
  const thisMonthTotal = transactions.reduce((sum, t) => {
    const d = parseTransactionDate(t?.date);
    if (!d) return sum;
    if (d.getMonth() === referenceMonthIndex) {
      return sum + Number(t.amount || 0);
    }
    return sum;
  }, 0);

  // Broj proslog mjeseca (ako je januar, prosli je decembar = 11)
  const lastMonthIndex = referenceMonthIndex - 1 < 0 ? 11 : referenceMonthIndex - 1;

  // Racunam ukupno za prosli mjesec
  const lastMonthTotal = transactions.reduce((sum, t) => {
    const d = parseTransactionDate(t?.date);
    if (!d) return sum;
    if (d.getMonth() === lastMonthIndex) {
      return sum + Number(t.amount || 0);
    }
    return sum;
  }, 0);

  // Racunam procenat promjene
  const percentageChange = Math.abs(lastMonthTotal) > 0
    ? ((thisMonthTotal - lastMonthTotal) / Math.abs(lastMonthTotal)) * 100
    : 0;
  
  // Da li je promjena pozitivna
  const isPositive = percentageChange >= 0;


  // ============================================
  // FILTRIRANJE I PRETRAGA TRANSAKCIJA
  // ============================================
  const filteredTransactions = transactions.filter(t => {
    if (!t) return false;

    // Filter po kategoriji
    if (selectedCategory === 'expenses') {
      // Samo rashodi (negativni iznosi ili tip "expense")
      if (t.type && t.type.toLowerCase() !== 'expense' && Number(t.amount) >= 0) {
        return false;
      }
    }
    if (selectedCategory === 'income') {
      // Samo prihodi
      if (t.type && t.type.toLowerCase() !== 'income' && Number(t.amount) <= 0) {
        return false;
      }
    }
    if (selectedCategory === 'transfers') {
      // Samo transferi
      const cat = (t.category || '').toLowerCase();
      if (!cat.includes('transfer')) return false;
    }

    // Pretraga po tekstu
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      
      // Trazim u naslovu
      const matchesTitle = (t.title || t.name || '')
        .toString().toLowerCase().includes(q);
      
      // Trazim u kategoriji
      const matchesCategory = (t.category || '')
        .toString().toLowerCase().includes(q);
      
      // Trazim u iznosu
      const matchesAmount = String(t.amount).toLowerCase().includes(q);
      
      return matchesTitle || matchesCategory || matchesAmount;
    }

    return true;
  });


  // ============================================
  // FUNKCIJE ZA KLIKOVE
  // ============================================
  const handleTransactionPress = transaction => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
  };

  // Ime mjeseca za prikaz
  const displayMonthLabel = rawBalanceHistory?.currentMonth ??
    Object.keys(MONTHS).find(k => MONTHS[k] === referenceMonthIndex) ?? 'Month';


  // ============================================
  // CRTAM EKRAN
  // ============================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* ============ ZAGLAVLJE ============ */}
        <View style={styles.header}>
          {/* Dugme za nazad */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Overview</Text>

          {/* Dugme za meni */}
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>


        {/* ============ PRETRAGA ============ */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#A0A0C0" />
          <TextInput
            placeholder="Search transactions"
            placeholderTextColor="#7E7E9A"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {/* Dugme X za brisanje pretrage */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={18} color="#A0A0C0" />
            </TouchableOpacity>
          )}
        </View>


        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* ============ MJESEC I POREDENJE ============ */}
          <View style={styles.monthSection}>
            <Text style={styles.monthText}>{displayMonthLabel}</Text>
            <Text style={styles.balanceAmount}>${thisMonthTotal.toFixed(2)}</Text>
            <Text style={[
              styles.balanceChange, 
              { color: isPositive ? '#10B981' : '#EF4444' }
            ]}>
              {isPositive ? '▲' : '▼'} {Math.abs(percentageChange).toFixed(1)}% vs last month
            </Text>
          </View>


          {/* ============ KARTICA ============ */}
          {card ? <CreditCard card={card} style={styles.cardSection} /> : null}


          {/* ============ STATISTIKA - GRAFIKON ============ */}
          <SectionHeader title="Statistics" onSeeMore={() => {}} />

          <View style={styles.statisticsContainer}>
            {/* Prikazujem stupac za svaki dan */}
            {weeklyStats.map((stat, index) => (
              <StatisticsBar
                key={stat?.day ?? index}
                day={stat?.day ?? ''}
                amount={Number(stat?.amount) || 0}
                maxAmount={maxAmount}
                isSelected={selectedDay === index}
                onPress={() => setSelectedDay(selectedDay === index ? null : index)}
              />
            ))}
          </View>


          {/* ============ DATUM ============ */}
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>
              {rawBalanceHistory?.currentDate ?? ''}
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More &gt;</Text>
            </TouchableOpacity>
          </View>


          {/* ============ FILTER PO KATEGORIJAMA ============ */}
          <CategoryFilter
            categories={[
              { id: 'all', name: 'All' }, 
              ...categories.filter(c => c?.name)
            ]}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />


          {/* ============ LISTA TRANSAKCIJA ============ */}
          <View style={styles.transactionsList}>
            {/* Prikazujem prvih 8 filtriranih transakcija */}
            {filteredTransactions.slice(0, 8).map(transaction => (
              <TransactionItem
                key={transaction?.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))}

            {/* Ako nema transakcija, prikazujem poruku */}
            {filteredTransactions.length === 0 && (
              <Text style={styles.emptyText}>No transactions found</Text>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>


      {/* ============ MODAL ZA DETALJE ============ */}
      <TransactionDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        transaction={selectedTransaction}
      />
    </SafeAreaView>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Zaglavlje
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E1E3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E1E3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Pretraga
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121226',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  
  // Mjesec sekcija
  monthSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  monthText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 5,
  },
  balanceAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  balanceChange: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginTop: 2,
  },
  
  // Kartica
  cardSection: {
    marginBottom: 20,
  },
  
  // Statistika grafikon
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E3A',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  
  // Datum header
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  seeMoreText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
  },
  
  // Lista transakcija
  transactionsList: {
    marginTop: 10,
  },
  emptyText: {
    color: '#A0A0C0',
    textAlign: 'center',
    marginTop: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default OverviewScreen;
