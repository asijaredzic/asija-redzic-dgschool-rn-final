// ============================================
// HOMESCREEN.JS - GLAVNI EKRAN APLIKACIJE
// ============================================
// Ovo je glavni ekran koji korisnik vidi nakon prijave.
// Ovdje prikazujem:
// - Balans (koliko novca ima)
// - Dugmadi za slanje, primanje i konvertovanje novca
// - Kontakte za brzi transfer
// - Nedavne transakcije

import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,        // Omogucava skrolovanje ako ima puno sadrzaja
  TouchableOpacity,
  StatusBar,
  Animated,          // Za animacije
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Uvozim komponente koje sam napravila
import {
  BalanceCard,              // Kartica sa balansom
  ActionButton,             // Dugmad za akcije (Send, Receive, Convert)
  TransactionItem,          // Jedna transakcija u listi
  ContactItem,              // Jedan kontakt za transfer
  SectionHeader,            // Naslov sekcije sa "See More" dugmetom
  SendModal,                // Popup za slanje novca
  ReceiveModal,             // Popup za primanje novca
  ConvertModal,             // Popup za konverziju valuta
  TransactionDetailModal,   // Popup sa detaljima transakcije
} from '../components';

// Uzimam podatke o prijavljenom korisniku
import { useAuth } from '../context/AuthContext';

// Ucitavam podatke iz JSON fajlova
import rawTransactions from '../data/transactions.json';  // Lista transakcija
import contactsData from '../data/contacts.json';         // Lista kontakata


const HomeScreen = ({ navigation }) => {
  
  // Uzimam podatke o korisniku
  const { user } = useAuth();


  // ============================================
  // STATE VARIJABLE - STA PAMTIM
  // ============================================
  
  // Kontrolisem da li su modali (popup prozori) vidljivi
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [transactionDetailVisible, setTransactionDetailVisible] = useState(false);
  
  // Ovdje pamtim koju transakciju je korisnik kliknuo
  const [selectedTransaction, setSelectedTransaction] = useState(null);


  // ============================================
  // ANIMACIJE
  // ============================================
  // Pravim animaciju za pojavljivanje sadrzaja
  
  // fadeAnim kontrolise prozirnost (0 = nevidljivo, 1 = vidljivo)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // slideAnim kontrolise pomjeranje (30 = pomjereno dolje, 0 = normalna pozicija)
  const slideAnim = useRef(new Animated.Value(30)).current;


  // ============================================
  // POKRECEM ANIMACIJE KAD SE EKRAN OTVORI
  // ============================================
  useEffect(() => {
    // Pokrecem obje animacije istovremeno
    Animated.parallel([
      // Sadrzaj se polako pojavljuje
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Sadrzaj klizi prema gore
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  // ============================================
  // SIGURNOSNA PROVJERA PODATAKA
  // ============================================
  // Provjeravam da li su transakcije ispravna lista
  // Ako nisu, koristim praznu listu da aplikacija ne pukne
  const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];


  // ============================================
  // RACUNAM FINANSIJE (BALANS, PRIHOD, RASHOD)
  // ============================================
  const calculateFinancials = () => {
    let income = 0;   // Ukupni prihodi
    let outcome = 0;  // Ukupni rashodi

    // Prolazim kroz sve transakcije
    transactions.forEach((transaction) => {
      // Uzimam iznos i pretavam u broj (Number)
      // Ako nije broj, koristim 0
      const amt = Number(transaction?.amount) || 0;
      
      // Ako je iznos pozitivan, to je prihod
      if (amt > 0) {
        income += amt;
      } else {
        // Ako je negativan, to je rashod
        // Math.abs pretvara negativan broj u pozitivan
        outcome += Math.abs(amt);
      }
    });

    // Vracam objekat sa svim podacima
    return {
      balance: user?.balance || 17298.92,  // Balans korisnika (ili default)
      income,
      outcome,
    };
  };

  // Pozivam funkciju i spremam rezultat
  const financials = calculateFinancials();


  // ============================================
  // FUNKCIJE ZA RUKOVANJE KLIKOVIMA
  // ============================================
  
  // Kad korisnik klikne na transakciju, otvaram detalje
  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);      // Spremam koju je kliknuo
    setTransactionDetailVisible(true);        // Otvaram modal
  };

  // Kad korisnik klikne "See More", idem na Overview ekran
  const handleSeeMoreTransactions = () => {
    navigation.navigate('Overview');
  };

  // Uzimam samo prvih 5 transakcija za prikaz
  const recentTransactions = transactions.slice(0, 5);


  // ============================================
  // CRTAM EKRAN
  // ============================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />

      {/* Animirani kontejner za sav sadrzaj */}
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,                        // Animacija prozirnosti
            transform: [{ translateY: slideAnim }]   // Animacija pomjeranja
          }
        ]}
      > 
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ============ ZAGLAVLJE ============ */}
          <View style={styles.header}>
            {/* Lijeva strana - avatar i ime korisnika */}
            <TouchableOpacity style={styles.userInfo}>
              {/* Krug sa prvim slovom imena */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'S'}
                </Text>
              </View>
              {/* Ime korisnika */}
              <Text style={styles.userName}>{user?.name || 'Student'}</Text>
              <Ionicons name="chevron-forward" size={16} color="#A0A0C0" />
            </TouchableOpacity>

            {/* Desna strana - ikone za pretragu i notifikacije */}
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="search" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                {/* Crvena tackica za notifikacije */}
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>


          {/* ============ KARTICA SA BALANSOM ============ */}
          {/* Prikazujem ukupni balans, prihod i rashod */}
          <BalanceCard 
            balance={financials.balance} 
            income={financials.income} 
            outcome={financials.outcome} 
          />


          {/* ============ AKCIJSKA DUGMAD ============ */}
          {/* Tri dugmeta: Send (posalji), Receive (primi), Convert (konvertuj) */}
          <View style={styles.actionsContainer}>
            <ActionButton 
              icon="paper-plane" 
              label="Send" 
              onPress={() => setSendModalVisible(true)}    // Otvaram Send modal
              colors={["#8B5CF6", "#7C3AED"]}              // Ljubicasta
            />
            <ActionButton 
              icon="download" 
              label="Receive" 
              onPress={() => setReceiveModalVisible(true)} // Otvaram Receive modal
              colors={["#10B981", "#059669"]}              // Zelena
            />
            <ActionButton 
              icon="repeat" 
              label="Convert" 
              onPress={() => setConvertModalVisible(true)} // Otvaram Convert modal
              colors={["#F59E0B", "#D97706"]}              // Narandzasta
            />
          </View>


          {/* ============ BRZI TRANSFER - KONTAKTI ============ */}
          <SectionHeader title="Quick Money Transfer" onSeeMore={() => {}} />
          
          {/* Horizontalna lista kontakata */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.contactsScroll}
          >
            {/* Dugme za dodavanje novog kontakta */}
            <ContactItem isAddButton={true} onPress={() => {}} />
            
            {/* Prolazim kroz sve kontakte i prikazujem ih */}
            {contactsData.map(contact => (
              <ContactItem 
                key={contact.id} 
                contact={contact} 
                onPress={() => { 
                  setSelectedTransaction(null); 
                  setSendModalVisible(true);  // Otvaram Send modal kad kliknem kontakt
                }} 
              />
            ))}
          </ScrollView>


          {/* ============ NEDAVNE TRANSAKCIJE ============ */}
          <SectionHeader 
            title="Recent Transaction" 
            onSeeMore={handleSeeMoreTransactions} 
          />
          
          {/* Lista transakcija */}
          <View style={styles.transactionsList}>
            {recentTransactions.map(transaction => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                onPress={() => handleTransactionPress(transaction)} 
              />
            ))}
          </View>

          {/* Prazan prostor na dnu za donji meni */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>


      {/* ============ MODALI (POPUP PROZORI) ============ */}
      {/* Ovi se prikazuju kada korisnik klikne na odgovarajuce dugme */}
      
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


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner
  container: { 
    flex: 1, 
    backgroundColor: '#0F0F1E' 
  },
  
  // Sadrzaj sa paddingom
  content: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  
  // Zaglavlje - horizontalni raspored
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25, 
    marginTop: 10 
  },
  
  // Info o korisniku - avatar i ime
  userInfo: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  // Avatar - krug sa slovom
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#8B5CF6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  avatarText: { 
    fontFamily: 'Poppins-Bold', 
    fontSize: 16, 
    color: '#FFFFFF' 
  },
  
  // Ime korisnika
  userName: { 
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 16, 
    color: '#FFFFFF', 
    marginRight: 5 
  },
  
  // Ikone u zaglavlju
  headerIcons: { 
    flexDirection: 'row' 
  },
  iconButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: '#1E1E3A', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10, 
    position: 'relative' 
  },
  
  // Crvena tackica za notifikacije
  notificationDot: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#EF4444' 
  },
  
  // Kontejner za akcijska dugmad
  actionsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 25 
  },
  
  // Horizontalni scroll za kontakte
  contactsScroll: { 
    marginBottom: 10 
  },
  
  // Lista transakcija
  transactionsList: { 
    marginBottom: 20 
  },
});

export default HomeScreen;
