// LoginScreen.js - Ekran za prijavu korisnika

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Uvozimo useAuth hook za pristup login funkciji
import { useAuth } from '../context/AuthContext';

// GLAVNA KOMPONENTA
export default function LoginScreen() {
  
  // STATE VARIJABLE
  // useState čuva vrijednosti koje se mogu mijenjati
  const [email, setEmail] = useState('');           // Čuva email koji korisnik unese
  const [password, setPassword] = useState('');     // Čuva lozinku koju korisnik unese
  const [showPassword, setShowPassword] = useState(false); // Da li da prikažemo lozinku

  // Uzimamo login funkciju iz AuthContext-a
  const { login } = useAuth();

  // FUNKCIJA KOJA SE POZIVA KAD KORISNIK PRITISNE DUGME "PRIJAVI SE"
  const handleLogin = () => {
    
    // Prvo provjeravamo da li su polja prazna
    if (!email || !password) {
      // Alert prikazuje popup poruku
      Alert.alert('Greska', 'Molimo unesite email i lozinku!');
      return; // return zaustavlja funkciju
    }

    // Pozivamo login funkciju sa unesenim podacima
    const result = login(email, password);

    // Ako login nije uspio, prikazujemo grešku
    if (!result.success) {
      Alert.alert('Greska', result.message);
    }
    // Ako je uspio, AuthContext će automatski promijeniti isLoggedIn
    // i App.js će prikazati glavne ekrane
  };

  // RENDEROVANJE (ono što se prikazuje na ekranu)
  return (
    <View style={styles.container}>
      
      {/* LOGO I NASLOV */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Ionicons name="wallet" size={50} color="#4ADE80" />
        </View>
        <Text style={styles.title}>Finance App</Text>
        <Text style={styles.subtitle}>Upravljaj svojim finansijama</Text>
      </View>

      {/* FORMA ZA UNOS */}
      <View style={styles.form}>
        
        {/* EMAIL INPUT */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Email adresa"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* PASSWORD INPUT */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Lozinka"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          {/* Dugme za prikazivanje/sakrivanje lozinke */}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* DUGME ZA PRIJAVU */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Prijavi se</Text>
        </TouchableOpacity>

        {/* DEMO PODACI ZA TESTIRANJE */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo podaci za testiranje:</Text>
          <Text style={styles.demoText}>Email: asija@email.com</Text>
          <Text style={styles.demoText}>Lozinka: asija123</Text>
        </View>
      </View>
    </View>
  );
}

// STILOVI
const styles = StyleSheet.create({
  container: {
    flex: 1,                    // Zauzima cijeli ekran
    backgroundColor: '#0D0D12', // Tamna pozadina
    justifyContent: 'center',   // Centrira vertikalno
    paddingHorizontal: 24,      // Padding sa strane
  },
  header: {
    alignItems: 'center',       // Centrira horizontalno
    marginBottom: 48,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 50,           // Pravi krug
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputBox: {
    flexDirection: 'row',       // Elementi u redu (horizontalno)
    alignItems: 'center',
    backgroundColor: '#1A1A24',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,                    // Zauzima preostali prostor
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  loginButton: {
    backgroundColor: '#4ADE80', // Zelena boja
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#0D0D12',           // Tamna boja teksta
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoBox: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#1A1A24',
    borderRadius: 16,
  },
  demoTitle: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    color: '#6B7280',
    fontSize: 13,
  },
});
