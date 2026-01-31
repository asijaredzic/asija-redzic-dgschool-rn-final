// HomeScreen.js - Glavni ekran aplikacije
// Minor hardening: defensive access to transactions, safer calculateFinancials

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
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
  TransactionDetailModal,
} from '../components';

// Uvoz hook-a za autentifikaciju
import { useAuth } from '../context/AuthContext';

// Uvoz podataka iz JSON fajlova
import rawTransactions from '../data/transactions.json';
import contactsData from '../data/contacts.json';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [transactionDetailVisible, setTransactionDetailVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  // Defensive transactions array
  const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];

  // Izracunavanje ukupnog balansa, prihoda i rashoda
  const calculateFinancials = () => {
    let income = 0;
    let outcome = 0;

    transactions.forEach((transaction) => {
      const amt = Number(transaction?.amount) || 0;
      if (amt > 0) income += amt;
      else outcome += Math.abs(amt);
    });

    return {
      balance: user?.balance || 17298.92,
      income,
      outcome,
    };
  };

  const financials = calculateFinancials();

  const handleTransactionPress = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailVisible(true);
  };

  const handleSeeMoreTransactions = () => {
    navigation.navigate('Overview');
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'S'}</Text>
              </View>
              <Text style={styles.userName}>{user?.name || 'Student'}</Text>
              <Ionicons name="chevron-forward" size={16} color="#A0A0C0" />
            </TouchableOpacity>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="search" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          <BalanceCard balance={financials.balance} income={financials.income} outcome={financials.outcome} />

          <View style={styles.actionsContainer}>
            <ActionButton icon="paper-plane" label="Send" onPress={() => setSendModalVisible(true)} colors={["#8B5CF6", "#7C3AED"]} />
            <ActionButton icon="download" label="Receive" onPress={() => setReceiveModalVisible(true)} colors={["#10B981", "#059669"]} />
            <ActionButton icon="repeat" label="Convert" onPress={() => setConvertModalVisible(true)} colors={["#F59E0B", "#D97706"]} />
          </View>

          <SectionHeader title="Quick Money Transfer" onSeeMore={() => {}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsScroll}>
            <ContactItem isAddButton={true} onPress={() => {}} />
            {contactsData.map(contact => (
              <ContactItem key={contact.id} contact={contact} onPress={() => { setSelectedTransaction(null); setSendModalVisible(true); }} />
            ))}
          </ScrollView>

          <SectionHeader title="Recent Transaction" onSeeMore={handleSeeMoreTransactions} />
          <View style={styles.transactionsList}>
            {recentTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} onPress={() => handleTransactionPress(transaction)} />
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

      <SendModal visible={sendModalVisible} onClose={() => setSendModalVisible(false)} />
      <ReceiveModal visible={receiveModalVisible} onClose={() => setReceiveModalVisible(false)} userName={user?.name || 'Student'} />
      <ConvertModal visible={convertModalVisible} onClose={() => setConvertModalVisible(false)} />
      <TransactionDetailModal visible={transactionDetailVisible} onClose={() => setTransactionDetailVisible(false)} transaction={selectedTransaction} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1E' },
  content: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontFamily: 'Poppins-Bold', fontSize: 16, color: '#FFFFFF' },
  userName: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#FFFFFF', marginRight: 5 },
  headerIcons: { flexDirection: 'row' },
  iconButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1E1E3A', justifyContent: 'center', alignItems: 'center', marginLeft: 10, position: 'relative' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25 },
  contactsScroll: { marginBottom: 10 },
  transactionsList: { marginBottom: 20 },
});

export default HomeScreen;
