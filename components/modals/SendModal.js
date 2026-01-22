// SendModal.js - Modal za slanje novca
// Prikazuje formu za odabir kontakta i unos iznosa
// Simulira slanje novca (ne salje stvarno jer je ovo demo)

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

// Uvozimo kontakte iz JSON fajla
import contacts from '../../data/contacts.json';

// Props: visible (da li je vidljiv), onClose (funkcija za zatvaranje)
const SendModal = ({ visible, onClose }) => {
  
  // State za odabrani kontakt
  const [selectedContact, setSelectedContact] = useState(null);
  
  // State za uneseni iznos
  const [amount, setAmount] = useState('');
  
  // State za poruku (opciono)
  const [message, setMessage] = useState('');

  // Funkcija za slanje novca
  const handleSend = () => {
    // Provjera da li je sve uneseno
    if (!selectedContact) {
      Alert.alert('Greska', 'Molimo odaberite kontakt');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Greska', 'Molimo unesite validan iznos');
      return;
    }

    // Simuliramo uspjesno slanje
    Alert.alert(
      'Uspjesno!', 
      `Poslali ste $${amount} korisniku ${selectedContact.name}`,
      [{ text: 'OK', onPress: () => {
        // Resetujemo formu i zatvaramo modal
        setSelectedContact(null);
        setAmount('');
        setMessage('');
        onClose();
      }}]
    );
  };

  // Renderovanje jednog kontakta u listi
  const renderContact = ({ item }) => {
    const isSelected = selectedContact?.id === item.id;
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedContact(item)}
        style={[styles.contactItem, isSelected && styles.contactItemSelected]}
      >
        <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
        <Text style={styles.contactName}>{item.name}</Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Send Money">
      {/* Lista kontakata */}
      <Text style={styles.label}>Select Contact</Text>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.contactsList}
      />

      {/* Polje za unos iznosa */}
      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#A0A0C0"
        />
      </View>

      {/* Quick amount dugmad */}
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

      {/* Polje za poruku */}
      <Text style={styles.label}>Message (Optional)</Text>
      <TextInput
        style={styles.messageInput}
        value={message}
        onChangeText={setMessage}
        placeholder="Add a note..."
        placeholderTextColor="#A0A0C0"
        multiline
      />

      {/* Dugme za slanje */}
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
  // Pojedinacni kontakt
  contactItem: {
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#2D2D5A',
    minWidth: 80,
  },
  // Odabrani kontakt
  contactItemSelected: {
    backgroundColor: '#3D3D6B',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  // Avatar kontakta
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  // Ime kontakta
  contactName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Kontejner za iznos
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  // Simbol valute
  currencySymbol: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginRight: 5,
  },
  // Input za iznos
  amountInput: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    paddingVertical: 10,
  },
  // Kontejner za quick amounts
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  // Quick amount dugme
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#2D2D5A',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  // Tekst quick amount
  quickAmountText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  // Input za poruku
  messageInput: {
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    padding: 15,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    minHeight: 60,
    textAlignVertical: 'top',
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
  // Tekst dugmeta
  sendButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default SendModal;
