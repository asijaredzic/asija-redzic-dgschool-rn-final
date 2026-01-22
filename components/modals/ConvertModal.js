// ConvertModal.js - Modal za konverziju valuta
// Prikazuje kalkulator za pretvaranje izmedju razlicitih valuta
// Ima lijepu animaciju za swap dugme

import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BaseModal from './BaseModal';

// Props: visible, onClose
const ConvertModal = ({ visible, onClose }) => {
  
  // State za valutu "od" koje konvertujemo
  const [fromCurrency, setFromCurrency] = useState('USD');
  
  // State za valutu "u" koju konvertujemo
  const [toCurrency, setToCurrency] = useState('EUR');
  
  // State za iznos
  const [amount, setAmount] = useState('');
  
  // Animacija za rotaciju swap dugmeta
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // "Lazni" kursevi za demo
  // U pravoj aplikaciji, ovo bi doslo sa API-ja
  const exchangeRates = {
    USD: { EUR: 0.92, GBP: 0.79, BAM: 1.79 },
    EUR: { USD: 1.09, GBP: 0.86, BAM: 1.96 },
    GBP: { USD: 1.27, EUR: 1.17, BAM: 2.27 },
    BAM: { USD: 0.56, EUR: 0.51, GBP: 0.44 },
  };

  // Lista dostupnih valuta
  const currencies = ['USD', 'EUR', 'GBP', 'BAM'];

  // Funkcija za izracunavanje konvertovanog iznosa
  const calculateConversion = () => {
    if (!amount || parseFloat(amount) <= 0) return '0.00';
    
    if (fromCurrency === toCurrency) return parseFloat(amount).toFixed(2);
    
    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
    return (parseFloat(amount) * rate).toFixed(2);
  };

  // Funkcija za zamjenu valuta (swap)
  const handleSwap = () => {
    // Animacija rotacije
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Zamijeni valute
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Interpolacija za rotaciju
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Funkcija za konverziju
  const handleConvert = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Greska', 'Molimo unesite validan iznos');
      return;
    }

    const convertedAmount = calculateConversion();
    Alert.alert(
      'Konverzija uspjesna!',
      `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`,
      [{ text: 'OK', onPress: () => {
        setAmount('');
        onClose();
      }}]
    );
  };

  // Renderovanje dugmeta za odabir valute
  const renderCurrencySelector = (currency, setCurrency, label) => (
    <View style={styles.currencySection}>
      <Text style={styles.currencyLabel}>{label}</Text>
      <View style={styles.currencyButtons}>
        {currencies.map((curr) => (
          <TouchableOpacity
            key={curr}
            style={[
              styles.currencyButton,
              currency === curr && styles.currencyButtonActive
            ]}
            onPress={() => setCurrency(curr)}
          >
            <Text style={[
              styles.currencyButtonText,
              currency === curr && styles.currencyButtonTextActive
            ]}>
              {curr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <BaseModal visible={visible} onClose={onClose} title="Convert Currency">
      {/* Sekcija "From" */}
      {renderCurrencySelector(fromCurrency, setFromCurrency, 'From')}
      
      {/* Polje za unos iznosa */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>{fromCurrency}</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#A0A0C0"
        />
      </View>

      {/* Swap dugme */}
      <View style={styles.swapContainer}>
        <View style={styles.swapLine} />
        <TouchableOpacity onPress={handleSwap} activeOpacity={0.8}>
          <Animated.View style={[styles.swapButton, { transform: [{ rotate: spin }] }]}>
            <Ionicons name="swap-vertical" size={24} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.swapLine} />
      </View>

      {/* Sekcija "To" */}
      {renderCurrencySelector(toCurrency, setToCurrency, 'To')}
      
      {/* Prikaz konvertovanog iznosa */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Dobijate</Text>
        <Text style={styles.resultAmount}>
          {calculateConversion()} {toCurrency}
        </Text>
        {amount && parseFloat(amount) > 0 && (
          <Text style={styles.rateText}>
            1 {fromCurrency} = {exchangeRates[fromCurrency]?.[toCurrency]?.toFixed(4) || '1.0000'} {toCurrency}
          </Text>
        )}
      </View>

      {/* Dugme za konverziju */}
      <TouchableOpacity onPress={handleConvert} activeOpacity={0.9}>
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          style={styles.convertButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="repeat" size={20} color="#FFFFFF" />
          <Text style={styles.convertButtonText}>Convert</Text>
        </LinearGradient>
      </TouchableOpacity>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  // Sekcija valute
  currencySection: {
    marginBottom: 15,
  },
  currencyLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 10,
  },
  currencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyButton: {
    flex: 1,
    backgroundColor: '#2D2D5A',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  currencyButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  currencyButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#A0A0C0',
  },
  currencyButtonTextActive: {
    color: '#FFFFFF',
  },
  // Polje za iznos
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
  },
  currencySymbol: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#A0A0C0',
    marginRight: 10,
    minWidth: 45,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    paddingVertical: 10,
  },
  // Swap dugme
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3D3D6B',
  },
  swapButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  // Rezultat
  resultContainer: {
    backgroundColor: '#2D2D5A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  resultLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
    marginBottom: 5,
  },
  resultAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#10B981',
  },
  rateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#A0A0C0',
    marginTop: 8,
  },
  // Dugme za konverziju
  convertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
  },
  convertButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default ConvertModal;
