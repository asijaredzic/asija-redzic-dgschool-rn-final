// ============================================
// SENDMODAL.JS - POPUP ZA SLANJE NOVCA
// ============================================
// Ovaj popup se otvara kada korisnik zeli poslati novac.
// Ima:
// - Listu kontakata za odabir
// - Polje za unos iznosa
// - Brza dugmad za iznose ($10, $25, $50, $100)
// - Polje za poruku (opciono)
// - Dugme "Send Money"
// 
// OVO JE DEMO - ne salje stvarni novac!

import React, { useState } from 'react';

import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  Image,
  Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BaseModal from './BaseModal';

// Ucitavam kontakte
import contacts from '../../data/contacts.json';


// Komponenta prima:
// - visible: da li je modal vidljiv
// - onClose: funkcija za zatvaranje
const SendModal = ({ visible, onClose }) => {
  
  // ============================================
  // STATE VARIJABLE
  // ============================================
  
  // Koji kontakt je odabran
  const [selectedContact, setSelectedContact] = useState(null);
  
  // Koliko novca zelim poslati
  const [amount, setAmount] = useState('');
  
  // Poruka uz transfer (opciono)
  const [message, setMessage] = useState('');


  // ============================================
  // FUNKCIJA ZA SLANJE
  // ============================================
  const handleSend = () => {
    // Provjera da li je kontakt odabran
    if (!selectedContact) {
      Alert.alert('Greska', 'Molimo odaberite kontakt');
      return;
    }
    
    // Provjera da li je iznos validan
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Greska', 'Molimo unesite validan iznos');
      return;
    }

    // Uspjesno "slanje" (demo)
    Alert.alert(
      'Uspjesno!', 
      `Poslali ste $${amount} korisniku ${selectedContact.name}`,
      [{ 
        text: 'OK', 
        onPress: () => {
          // Resetujem formu i zatvaram modal
          setSelectedContact(null);
          setAmount('');
          setMessage('');
          onClose();
        }
      }]
    );
  };


  // ============================================
  // FUNKCIJA ZA PRIKAZ JEDNOG KONTAKTA
  // ============================================
  const renderContact = ({ item }) => {
    // Da li je ovaj kontakt odabran
    const isSelected = selectedContact?.id === item.id;
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedContact(item)}
        style={[
          styles.contactItem, 
          isSelected && styles.contactItemSelected
        ]}
      >
        {/* Slika kontakta */}
        <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
        
        {/* Ime kontakta */}
        <Text style={styles.contactName}>{item.name}</Text>
        
        {/* Kvacica ako je odabran */}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
        )}
      </TouchableOpacity>
    );
  };


  // ============================================
  // CRTAM MODAL
  // ============================================
  return (
    <BaseModal visible={visible} onClose={onClose} title="Send Money">
      
      {/* ============ LISTA KONTAKATA ============ */}
      <Text style={styles.label}>Select Contact</Text>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.contactsList}
      />

      {/* ============ POLJE ZA IZNOS ============ */}
      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"  // Pokazuje tastaturu sa brojevima
          placeholder="0.00"
          placeholderTextColor="#A0A0C0"
        />
      </View>

      {/* ============ BRZA DUGMAD ZA IZNOSE ============ */}
      <View style={styles.quickAmounts}>
        {['10', '25', '50', '100'].map((quickAmount) => (
          <TouchableOpacity
            key={quickAmount}
            style={styles.quickAmountButton}
            onPress={() => setAmount(quickAmount)}
          >
            <Text style={styles.quickAmountText}>${quickAmount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ============ POLJE ZA PORUKU ============ */}
      <Text style={styles.label}>Message (Optional)</Text>
      <TextInput
        style={styles.messageInput}
        value={message}
        onChangeText={setMessage}
        placeholder="Add a note..."
        placeholderTextColor="#A0A0C0"
        multiline  // Moze imati vise redova
      />

      {/* ============ DUGME ZA SLANJE ============ */}
      <TouchableOpacity onPress={handleSend} activeOpacity={0.9}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.sendButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="paper-plane" size={20} color="#FFFFFF" />
          <Text style={styles.sendButtonText}>Send Money</Text>
        </LinearGradient>
      </TouchableOpacity>
    </BaseModal>
  );
};


// ============================================
// STILOVI
// ============================================
const styles = StyleSheet.create({
  // Labela za sekcije
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 10,
    marginTop: 15,
  },
  
  // Lista kontakata
  contactsList: {
    maxHeight: 100,
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#2D2D5A',
    minWidth: 80,
  },
  contactItemSelected: {
    backgroundColor: '#3D3D6B',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  contactName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  // Polje za iznos
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  currencySymbol: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    paddingVertical: 10,
  },
  
  // Brza dugmad
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#2D2D5A',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickAmountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  
  // Polje za poruku
  messageInput: {
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    padding: 15,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    minHeight: 60,
    textAlignVertical: 'top',  // Tekst pocinje od vrha
  },
  
  // Dugme za slanje
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 25,
  },
  sendButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default SendModal;
