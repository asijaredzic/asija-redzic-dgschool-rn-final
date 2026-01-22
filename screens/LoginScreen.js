// LoginScreen.js - Ekran za prijavu korisnika
// Ima animacije, validaciju i lijepi dizajn
// Koristi AuthContext za prijavu

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Uvoz hook-a za autentifikaciju
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  
  // Dohvatamo login funkciju i loading state iz AuthContext-a
  const { login, isLoading } = useAuth();
  
  // State za input polja
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State za prikaz/skrivanje lozinke
  const [showPassword, setShowPassword] = useState(false);
  
  // State za greske
  const [error, setError] = useState('');
  
  // Animacije
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  // Animacija pri ucitavanju ekrana
  useEffect(() => {
    Animated.parallel([
      // Logo animacija
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Forma fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      // Forma slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Funkcija za prijavu
  const handleLogin = async () => {
    // Resetuj gresku
    setError('');

    // Validacija - provjera da li su polja prazna
    if (!username.trim()) {
      setError('Molimo unesite korisnicko ime');
      return;
    }
    if (!password.trim()) {
      setError('Molimo unesite lozinku');
      return;
    }

    // Pokusaj prijave
    const success = await login(username, password);
    
    if (!success) {
      setError('Pogresno korisnicko ime ili lozinka');
      // Animacija tresenja za gresku
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* LOGO SEKCIJA */}
        <Animated.View 
          style={[
            styles.logoSection,
            { transform: [{ scale: logoScale }] }
          ]}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.logoContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="wallet" size={50} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.appName}>Student Finance</Text>
          <Text style={styles.appTagline}>Upravljaj svojim novcem pametno</Text>
        </Animated.View>

        {/* FORMA ZA PRIJAVU */}
        <Animated.View 
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.welcomeText}>Dobrodosli nazad!</Text>
          <Text style={styles.instructionText}>Prijavite se da nastavite</Text>

          {/* GRESKA */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* USERNAME INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#A0A0C0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Korisnicko ime"
              placeholderTextColor="#A0A0C0"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* PASSWORD INPUT */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#A0A0C0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Lozinka"
              placeholderTextColor="#A0A0C0"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
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

          {/* FORGOT PASSWORD */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Zaboravili ste lozinku?</Text>
          </TouchableOpacity>

          {/* LOGIN DUGME */}
          <TouchableOpacity 
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.loginButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Prijavi se</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* TEST KREDENCIJALI */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  keyboardView: {
    flex: 1,
  },
  // Logo sekcija
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
  // Greska
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444420',
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
  // Input
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
  // Forgot password
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8B5CF6',
  },
  // Login dugme
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
