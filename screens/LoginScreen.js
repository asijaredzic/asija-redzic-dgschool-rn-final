// ============================================
// LOGINSCREEN.JS - EKRAN ZA PRIJAVU
// ============================================
// Ovo je prvi ekran koji korisnik vidi kada otvori aplikaciju.
// Ovdje upisuje svoje korisnicko ime i lozinku da se prijavi.
// Imam lijepe animacije i provjeru da li je sve upisano kako treba.

import React, { useState, useRef, useEffect } from 'react';

// Uvozim komponente koje mi trebaju iz React Native
import { 
  View,           // Kutija za grupiranje elemenata
  Text,           // Za prikazivanje teksta
  StyleSheet,     // Za stilove (boje, velicine, itd.)
  TextInput,      // Polje gdje korisnik moze pisati
  TouchableOpacity, // Dugme koje reaguje na dodir
  StatusBar,      // Gornja traka sa vremenom
  Animated,       // Za animacije (kretanje, nestajanje)
  ActivityIndicator, // Krug koji se vrti (loading)
  KeyboardAvoidingView, // Pomjera sadrzaj kada se pojavi tastatura
  Platform        // Govori mi da li je Android ili iPhone
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Ikonice
import { LinearGradient } from 'expo-linear-gradient'; // Prelivi boja

// Uzimam funkcije za prijavu iz mog AuthContext-a
import { useAuth } from '../context/AuthContext';


const LoginScreen = () => {
  
  // ============================================
  // UZIMAM FUNKCIJE ZA PRIJAVU
  // ============================================
  // login - funkcija koju zovem kada korisnik pritisne "Prijavi se"
  // isLoading - govori mi da li se trenutno vrsi prijava
  const { login, isLoading } = useAuth();
  
  
  // ============================================
  // STVARAM VARIJABLE ZA PAMCENJE PODATAKA (STATE)
  // ============================================
  // useState mi pomaze da pamtim stvari koje korisnik unese.
  // Kada se promijeni vrijednost, ekran se automatski azurira.
  
  // Ovdje pamtim korisnicko ime koje korisnik upise
  const [username, setUsername] = useState('');
  
  // Ovdje pamtim lozinku
  const [password, setPassword] = useState('');
  
  // Ovo kontrolise da li se lozinka vidi ili su samo tacke
  const [showPassword, setShowPassword] = useState(false);
  
  // Ovdje pamtim poruku o gresci ako nesto nije u redu
  const [error, setError] = useState('');
  
  
  // ============================================
  // ANIMACIJE
  // ============================================
  // useRef cuva vrijednosti koje se ne gube kada se ekran ponovo crta.
  // Animated.Value je kao brojac za animacije.
  
  // Ova animacija kontrolise prozirnost (fade in/out)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Ova animacija kontrolise pomjeranje gore/dolje
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Ova animacija kontrolise velicinu loga
  const logoScale = useRef(new Animated.Value(0.5)).current;


  // ============================================
  // POKRECEM ANIMACIJE KADA SE EKRAN OTVORI
  // ============================================
  // useEffect se pokrece automatski kada se komponenta prvi put prikaze.
  // Ovdje pokrecem sve animacije odjednom.
  useEffect(() => {
    // Animated.parallel pokrece vise animacija u isto vrijeme
    Animated.parallel([
      // Logo skace od male do normalne velicine
      Animated.spring(logoScale, {
        toValue: 1,        // Krajnja velicina (100%)
        tension: 50,       // Koliko "napeto" skace
        friction: 7,       // Koliko brzo se zaustavlja
        useNativeDriver: true,
      }),
      // Forma se polako pojavljuje (fade in)
      Animated.timing(fadeAnim, {
        toValue: 1,        // Potpuno vidljivo
        duration: 800,     // Traje 800 milisekundi
        delay: 300,        // Ceka 300ms prije nego pocne
        useNativeDriver: true,
      }),
      // Forma klizi prema gore
      Animated.timing(slideAnim, {
        toValue: 0,        // Dolazi na normalnu poziciju
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(); // .start() pokrece animacije
  }, []);


  // ============================================
  // FUNKCIJA ZA PRIJAVU
  // ============================================
  // Ova funkcija se poziva kada korisnik pritisne dugme "Prijavi se"
  const handleLogin = async () => {
    // Brisem prethodnu gresku
    setError('');

    // Provjeravam da li je korisnicko ime upisano
    // .trim() brise razmake na pocetku i kraju
    if (!username.trim()) {
      setError('Molimo unesite korisnicko ime');
      return; // Zaustavljam funkciju
    }
    
    // Provjeravam da li je lozinka upisana
    if (!password.trim()) {
      setError('Molimo unesite lozinku');
      return;
    }

    // Pokusavam prijavu koristeci login funkciju
    // "await" ceka da se prijava zavrsi
    const success = await login(username, password);
    
    // Ako prijava nije uspjela, pokazujem gresku i tresem formu
    if (!success) {
      setError('Pogresno korisnicko ime ili lozinka');
      
      // Animacija tresenja - forma se pomjera lijevo-desno
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };


  // ============================================
  // OVDJE CRTAM EKRAN
  // ============================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
      
      {/* KeyboardAvoidingView pomjera sadrzaj kada se pojavi tastatura */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        
        {/* ============ LOGO SEKCIJA ============ */}
        {/* Prikazujem logo aplikacije sa animacijom */}
        <Animated.View 
          style={[
            styles.logoSection,
            { transform: [{ scale: logoScale }] } // Animacija velicine
          ]}
        >
          {/* Kvadrat sa gradijentom i ikonom novcanika */}
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.logoContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="wallet" size={50} color="#FFFFFF" />
          </LinearGradient>
          
          {/* Ime aplikacije */}
          <Text style={styles.appName}>Student Finance</Text>
          
          {/* Slogan */}
          <Text style={styles.appTagline}>Upravljaj svojim novcem pametno</Text>
        </Animated.View>


        {/* ============ FORMA ZA PRIJAVU ============ */}
        {/* Ova sekcija ima animaciju pojavljivanja i klizanja */}
        <Animated.View 
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,                          // Animacija prozirnosti
              transform: [{ translateY: slideAnim }]      // Animacija pomjeranja
            }
          ]}
        >
          <Text style={styles.welcomeText}>Dobrodosli nazad!</Text>
          <Text style={styles.instructionText}>Prijavite se da nastavite</Text>

          
          {/* ============ PRIKAZ GRESKE ============ */}
          {/* Ovo se pokazuje samo ako postoji greska */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          
          {/* ============ POLJE ZA KORISNICKO IME ============ */}
          <View style={styles.inputContainer}>
            {/* Ikona osobe */}
            <Ionicons name="person-outline" size={20} color="#A0A0C0" style={styles.inputIcon} />
            
            {/* Polje za unos */}
            <TextInput
              style={styles.input}
              placeholder="Korisnicko ime"
              placeholderTextColor="#A0A0C0"
              value={username}
              onChangeText={(text) => {
                setUsername(text);   // Spremam ono sto korisnik pise
                setError('');        // Brisem gresku dok pise
              }}
              autoCapitalize="none"  // Ne zelim velika slova automatski
              autoCorrect={false}    // Ne zelim autocorrect
            />
          </View>

          
          {/* ============ POLJE ZA LOZINKU ============ */}
          <View style={styles.inputContainer}>
            {/* Ikona lokota */}
            <Ionicons name="lock-closed-outline" size={20} color="#A0A0C0" style={styles.inputIcon} />
            
            {/* Polje za unos lozinke */}
            <TextInput
              style={styles.input}
              placeholder="Lozinka"
              placeholderTextColor="#A0A0C0"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!showPassword} // Ako showPassword je false, prikazuj tacke
              autoCapitalize="none"
            />
            
            {/* Dugme za prikaz/skrivanje lozinke (ikona oka) */}
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color="#A0A0C0" 
              />
            </TouchableOpacity>
          </View>

          
          {/* ============ ZABORAVLJENA LOZINKA ============ */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Zaboravili ste lozinku?</Text>
          </TouchableOpacity>

          
          {/* ============ DUGME ZA PRIJAVU ============ */}
          <TouchableOpacity 
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={isLoading} // Onemoguceno dok se vrsi prijava
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.loginButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                // Ako se vrsi prijava, pokazujem krug koji se vrti
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                // Inace pokazujem tekst i strelicu
                <>
                  <Text style={styles.loginButtonText}>Prijavi se</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          
          {/* ============ TEST PODACI ============ */}
          {/* Ovo je samo za testiranje - pokazujem koje podatke mogu koristiti */}
          <View style={styles.testCredentials}>
            <Text style={styles.testTitle}>Test kredencijali:</Text>
            <Text style={styles.testText}>student / student</Text>
            <Text style={styles.testText}>demo / demo</Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


// ============================================
// STILOVI - KAKO SVE IZGLEDA
// ============================================
const styles = StyleSheet.create({
  // Glavni kontejner - tamna pozadina
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  keyboardView: {
    flex: 1,
  },
  
  // Logo sekcija na vrhu
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  appTagline: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A0A0C0',
  },
  
  // Forma sekcija
  formSection: {
    flex: 1,
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 25,
  },
  
  // Kontejner za gresku - crvenkasta pozadina
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444420', // Crvena sa prozirnoscu
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#EF4444',
    marginLeft: 8,
  },
  
  // Polje za unos
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E3A',
    borderRadius: 14,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#2D2D5A',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 5,
  },
  
  // Zaboravljena lozinka
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8B5CF6',
  },
  
  // Dugme za prijavu
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
  },
  loginButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 10,
  },
  
  // Test kredencijali
  testCredentials: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1E1E3A',
    borderRadius: 12,
    alignItems: 'center',
  },
  testTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#A0A0C0',
    marginBottom: 5,
  },
  testText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8B5CF6',
  },
});

export default LoginScreen;
