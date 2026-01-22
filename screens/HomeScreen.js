// HomeScreen.js - Glavni ekran aplikacije
// Prikazuje balans, akcijska dugmad, kontakte i transakcije
// Koristi komponente iz components foldera za cist i organizovan kod

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Animated,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Uvoz komponenti iz components foldera
import { 
  BalanceCard, 
  ActionButton, 
  TransactionItem, 
  ContactItem,
  SectionHeader,
  SendModal,
  ReceiveModal,
  ConvertModal,
  TransactionDetailModal
} from '../components';

// Uvoz hook-a za autentifikaciju
import { useAuth } from '../context/AuthContext';

// Uvoz podataka iz JSON fajlova
import transactionsData from '../data/transactions.json';
import contactsData from '../data/contacts.json';

const HomeScreen = ({ navigation }) => {
  
  // Dohvatamo podatke o korisniku iz AuthContext-a
  const { user } = useAuth();
  
  // State za pracenje vidljivosti modala
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [transactionDetailVisible, setTransactionDetailVisible] = useState(false);
  
  // State za odabranu transakciju (za prikaz detalja)
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Animacija za fade-in efekat pri ucitavanju
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Animacija za slide-in efekat
  const slideAnim = useRef(new Animated.Value(30)).current;

  // useEffect se pokrece kada se komponenta montira
  // Pokrece animacije za lijep ulazak na ekran
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Izracunavanje ukupnog balansa, prihoda i rashoda
  // reduce() prolazi kroz sve transakcije i sabira ih
  const calculateFinancials = () => {
    let income = 0;
    let outcome = 0;
    
    transactionsData.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        outcome += Math.abs(transaction.amount);
      }
    });
    
    return {
      balance: user?.balance || 17298.92,
      income,
      outcome
    };
  };

  const financials = calculateFinancials();

  // Funkcija za otvaranje detalja transakcije
  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailVisible(true);
  };

  // Funkcija za navigaciju na Overview ekran
  const handleSeeMoreTransactions = () => {
    navigation.navigate('Overview');
  };

  // Uzimamo samo prvih 5 transakcija za prikaz
  const recentTransactions = transactionsData.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      {/* Postavljamo tamni status bar */}
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
      
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* ZAGLAVLJE - Ime korisnika, pretraga i notifikacije */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.userInfo}>
              {/* Avatar korisnika */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'S'}
                </Text>
              </View>
              {/* Ime korisnika */}
              <Text style={styles.userName}>{user?.name || 'Student'}</Text>
              <Ionicons name="chevron-forward" size={16} color="#A0A0C0" />
            </TouchableOpacity>
            
            {/* Ikone za pretragu i notifikacije */}
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="search" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                {/* Crvena tackica za notifikaciju */}
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* BALANCE CARD - Komponenta za prikaz balansa */}
          <BalanceCard 
            balance={financials.balance}
            income={financials.income}
            outcome={financials.outcome}
          />

          {/* AKCIJSKA DUGMAD - Send, Receive, Convert */}
          <View style={styles.actionsContainer}>
            <ActionButton 
              icon="paper-plane" 
              label="Send" 
              onPress={() => setSendModalVisible(true)}
              colors={['#8B5CF6', '#7C3AED']}
            />
            <ActionButton 
              icon="download" 
              label="Receive" 
              onPress={() => setReceiveModalVisible(true)}
              colors={['#10B981', '#059669']}
            />
            <ActionButton 
              icon="repeat" 
              label="Convert" 
              onPress={() => setConvertModalVisible(true)}
              colors={['#F59E0B', '#D97706']}
            />
          </View>

          {/* QUICK MONEY TRANSFER - Lista kontakata */}
          <SectionHeader 
            title="Quick Money Transfer" 
            onSeeMore={() => {}}
          />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.contactsScroll}
          >
            {/* Dugme za dodavanje novog kontakta */}
            <ContactItem 
              isAddButton={true} 
              onPress={() => {}}
            />
            {/* Lista kontakata */}
            {contactsData.map((contact) => (
              <ContactItem 
                key={contact.id}
                contact={contact}
                onPress={() => {
                  setSelectedTransaction(null);
                  setSendModalVisible(true);
                }}
              />
            ))}
          </ScrollView>

          {/* RECENT TRANSACTIONS - Lista transakcija */}
          <SectionHeader 
            title="Recent Transaction" 
            onSeeMore={handleSeeMoreTransactions}
          />
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
            ))}
          </View>

          {/* Prazan prostor za donji tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

      {/* MODALI - Popup prozori za akcije */}
      <SendModal 
        visible={sendModalVisible} 
        onClose={() => setSendModalVisible(false)} 
      />
      <ReceiveModal 
        visible={receiveModalVisible} 
        onClose={() => setReceiveModalVisible(false)}
        userName={user?.name || 'Student'}
      />
      <ConvertModal 
        visible={convertModalVisible} 
        onClose={() => setConvertModalVisible(false)} 
      />
      <TransactionDetailModal 
        visible={transactionDetailVisible}
        onClose={() => setTransactionDetailVisible(false)}
        transaction={selectedTransaction}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Glavni kontejner - tamna pozadina
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  // Sadrzaj sa padding-om
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Zaglavlje
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  // Korisnicke informacije
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Ime korisnika
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 5,
  },
  // Ikone u zaglavlju
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E1E3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    position: 'relative',
  },
  // Crvena tackica za notifikacije
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  // Kontejner za akcijska dugmad
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  // Scroll za kontakte
  contactsScroll: {
    marginBottom: 10,
  },
  // Lista transakcija
  transactionsList: {
    marginBottom: 20,
  },
});

export default HomeScreen;
