// ============================================================
// CONVERT MODAL - Prozor za mijenjanje valuta
// ============================================================
// Ja sam napravio ovaj prozor da korisnik moze pretvoriti novac
// iz jedne valute u drugu. Na primjer, iz dolara u eure.
// Imam animirano dugme za zamjenu koje se okrece kad kliknes!
// ============================================================

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

// Komponenta za konverziju valuta
const ConvertModal = ({ visible, onClose }) => {
  
  // ========== STANJA (STATE) ==========
  // Ovo su "kutije" gdje pamtim informacije
  
  // Iz koje valute pretvaramo (na pocetku USD - americki dolar)
  const [fromCurrency, setFromCurrency] = useState('USD');
  
  // U koju valutu pretvaramo (na pocetku EUR - euro)
  const [toCurrency, setToCurrency] = useState('EUR');
  
  // Koliko novca korisnik unese
  const [amount, setAmount] = useState('');
  
  // Ovo je za animaciju okretanja dugmeta
  // useRef cuva vrijednost koja ne izaziva ponovno renderovanje
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // ========== KURSEVI VALUTA ==========
  // Ovo su "lazni" kursevi - koliko vrijedi jedna valuta u drugoj
  // U pravoj aplikaciji ovo bi dolazilo sa interneta
  const exchangeRates = {
    USD: { EUR: 0.92, GBP: 0.79, BAM: 1.79 },  // 1 USD = 0.92 EUR
    EUR: { USD: 1.09, GBP: 0.86, BAM: 1.96 },  // 1 EUR = 1.09 USD
    GBP: { USD: 1.27, EUR: 1.17, BAM: 2.27 },  // 1 GBP = 1.27 USD
    BAM: { USD: 0.56, EUR: 0.51, GBP: 0.44 },  // 1 BAM = 0.56 USD
  };

  // Lista valuta koje mogu koristiti
  const currencies = ['USD', 'EUR', 'GBP', 'BAM'];

  // ========== FUNKCIJE ==========
  
  // Ova funkcija racuna koliko dobijam nakon konverzije
  const calculateConversion = () => {
    // Ako nema iznosa ili je 0, vracam 0
    if (!amount || parseFloat(amount) <= 0) return '0.00';
    
    // Ako su obje valute iste, nema konverzije
    if (fromCurrency === toCurrency) return parseFloat(amount).toFixed(2);
    
    // Uzimam kurs iz moje tablice
    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
    
    // Mnozim iznos sa kursom i zaokruzujem na 2 decimale
    return (parseFloat(amount) * rate).toFixed(2);
  };

  // Ova funkcija zamjenjuje valute kad kliknem swap dugme
  const handleSwap = () => {
    // Pokrecem animaciju okretanja
    Animated.sequence([
      // Prvo okrenem do 180 stepeni
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,           // Traje 300 milisekundi
        useNativeDriver: true,   // Koristi nativni driver za brzinu
      }),
      // Onda vratim na 0 (instant)
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Zamjenjujem valute
    const temp = fromCurrency;      // Sacuvam prvu valutu
    setFromCurrency(toCurrency);    // Prva postaje druga
    setToCurrency(temp);            // Druga postaje prva
  };

  // Ovo pretvara broj 0-1 u stepene 0-180
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Kad korisnik klikne Convert dugme
  const handleConvert = () => {
    // Provjeravam da li je iznos validan
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Greska', 'Molimo unesite validan iznos');
      return;
    }

    // Izracunam konverziju
    const convertedAmount = calculateConversion();
    
    // Pokazujem rezultat
    Alert.alert(
      'Konverzija uspjesna!',
      `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`,
      [{ 
        text: 'OK', 
        onPress: () => {
          setAmount('');  // Ocistim polje
          onClose();      // Zatvorim prozor
        }
      }]
    );
  };

  // Ova funkcija pravi dugmice za odabir valute
  // Koristim je dva puta - za "From" i "To"
  const renderCurrencySelector = (currency, setCurrency, label) => (
    <View style={styles.currencySection}>
      <Text style={styles.currencyLabel}>{label}</Text>
      
      <View style={styles.currencyButtons}>
        {/* Prolazim kroz sve valute i pravim dugme za svaku */}
        {currencies.map((curr) => (
          <TouchableOpacity
            key={curr}
            style={[
              styles.currencyButton,
              // Ako je ova valuta odabrana, dodajem aktivni stil
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

  // ========== RENDEROVANJE ==========
  return (
    <BaseModal visible={visible} onClose={onClose} title="Convert Currency">
      
      {/* Dugmici za odabir valute IZ koje pretvaramo */}
      {renderCurrencySelector(fromCurrency, setFromCurrency, 'From')}
      
      {/* Polje za unos iznosa */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>{fromCurrency}</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"  // Samo brojevi i tacka
          placeholder="0.00"
          placeholderTextColor="#A0A0C0"
        />
      </View>

      {/* ========== SWAP DUGME ========== */}
      {/* Ovo je ono kul dugme koje se okrece */}
      <View style={styles.swapContainer}>
        <View style={styles.swapLine} />
        <TouchableOpacity onPress={handleSwap} activeOpacity={0.8}>
          {/* Animated.View omogucava animaciju */}
          <Animated.View style={[
            styles.swapButton, 
            { transform: [{ rotate: spin }] }  // Primjenjujem rotaciju
          ]}>
            <Ionicons name="swap-vertical" size={24} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.swapLine} />
      </View>

      {/* Dugmici za odabir valute U koju pretvaramo */}
      {renderCurrencySelector(toCurrency, setToCurrency, 'To')}
      
      {/* ========== REZULTAT ========== */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Dobijate</Text>
        <Text style={styles.resultAmount}>
          {calculateConversion()} {toCurrency}
        </Text>
        
        {/* Pokazujem kurs samo ako ima iznosa */}
        {amount && parseFloat(amount) > 0 && (
          <Text style={styles.rateText}>
            1 {fromCurrency} = {exchangeRates[fromCurrency]?.[toCurrency]?.toFixed(4) || '1.0000'} {toCurrency}
          </Text>
        )}
      </View>

      {/* ========== DUGME ZA KONVERZIJU ========== */}
      <TouchableOpacity onPress={handleConvert} activeOpacity={0.9}>
        <LinearGradient
          colors={['#F59E0B', '#D97706']}  // Narandzasta boja
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

// ============================================================
// STILOVI
// ============================================================
const styles = StyleSheet.create({
  // ----- SEKCIJA VALUTE -----
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
    flex: 1,                    // Sva dugmad jednake sirine
    backgroundColor: '#2D2D5A',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  currencyButtonActive: {
    backgroundColor: '#8B5CF6', // Ljubicasta kad aktivno
  },
  currencyButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#A0A0C0',
  },
  currencyButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // ----- POLJE ZA IZNOS -----
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
  
  // ----- SWAP DUGME -----
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3D3D6B',  // Linija sa strane
  },
  swapButton: {
    width: 50,
    height: 50,
    borderRadius: 25,            // Krug
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  
  // ----- REZULTAT -----
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
    color: '#10B981',            // Zelena za pozitivan rezultat
  },
  rateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#A0A0C0',
    marginTop: 8,
  },
  
  // ----- DUGME ZA KONVERZIJU -----
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
