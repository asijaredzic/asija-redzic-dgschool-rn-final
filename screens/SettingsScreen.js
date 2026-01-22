// SettingsScreen.js - Ekran za postavke aplikacije
// Prikazuje korisnicke informacije, toggle opcije i logout
// Ima lijepe animacije i organizovane sekcije

import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  StatusBar,
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Uvoz hook-a za autentifikaciju
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
  
  // Dohvatamo korisnika i logout funkciju iz AuthContext-a
  const { user, logout } = useAuth();
  
  // State za toggle opcije
  const [notifications, setNotifications] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [biometricPayment, setBiometricPayment] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  
  // Animacije
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Funkcija za logout sa potvrdom
  const handleLogout = () => {
    Alert.alert(
      'Odjava',
      'Da li ste sigurni da zelite da se odjavite?',
      [
        { text: 'Odustani', style: 'cancel' },
        { 
          text: 'Odjavi se', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  // Komponenta za jednu opciju u settings-u
  const SettingsItem = ({ icon, iconColor, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity 
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingsIconContainer, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color="#A0A0C0" />
      )}
    </TouchableOpacity>
  );

  // Komponenta za toggle opciju
  const SettingsToggle = ({ icon, iconColor, title, value, onValueChange }) => (
    <View style={styles.settingsItem}>
      <View style={[styles.settingsIconContainer, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3D3D6B', true: '#8B5CF6' }}
        thumbColor={value ? '#FFFFFF' : '#A0A0C0'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* ZAGLAVLJE */}
          <Text style={styles.headerTitle}>Settings</Text>

          {/* KORISNICKE INFORMACIJE */}
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {user?.name?.charAt(0) || 'S'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Student'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'student@email.com'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={18} color="#8B5CF6" />
            </TouchableOpacity>
          </View>

          {/* SEKCIJA - RACUN */}
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsSection}>
            <SettingsItem 
              icon="person"
              iconColor="#8B5CF6"
              title="Personal Information"
              onPress={() => Alert.alert('Info', 'Osobne informacije')}
            />
            <SettingsItem 
              icon="card"
              iconColor="#10B981"
              title="Payment Methods"
              onPress={() => Alert.alert('Info', 'Metode placanja')}
            />
            <SettingsItem 
              icon="shield-checkmark"
              iconColor="#3B82F6"
              title="Security"
              onPress={() => Alert.alert('Info', 'Sigurnosne postavke')}
            />
          </View>

          {/* SEKCIJA - PREFERENCIJE */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsSection}>
            <SettingsToggle 
              icon="notifications"
              iconColor="#F59E0B"
              title="Push Notifications"
              value={notifications}
              onValueChange={setNotifications}
            />
            <SettingsToggle 
              icon="scan"
              iconColor="#8B5CF6"
              title="Face ID Login"
              value={faceId}
              onValueChange={setFaceId}
            />
            <SettingsToggle 
              icon="moon"
              iconColor="#6366F1"
              title="Dark Mode"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <SettingsToggle 
              icon="finger-print"
              iconColor="#10B981"
              title="Biometric Payments"
              value={biometricPayment}
              onValueChange={setBiometricPayment}
            />
            <SettingsToggle 
              icon="alert-circle"
              iconColor="#EF4444"
              title="Transaction Alerts"
              value={transactionAlerts}
              onValueChange={setTransactionAlerts}
            />
          </View>

          {/* SEKCIJA - PODRSKA */}
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsSection}>
            <SettingsItem 
              icon="help-circle"
              iconColor="#F59E0B"
              title="Help Center"
              onPress={() => Alert.alert('Info', 'Centar za pomoc')}
            />
            <SettingsItem 
              icon="chatbubble"
              iconColor="#3B82F6"
              title="Contact Us"
              onPress={() => Alert.alert('Info', 'Kontaktirajte nas')}
            />
            <SettingsItem 
              icon="document-text"
              iconColor="#6B7280"
              title="Terms & Privacy"
              onPress={() => Alert.alert('Info', 'Uslovi i privatnost')}
            />
          </View>

          {/* LOGOUT DUGME */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* VERZIJA APLIKACIJE */}
          <Text style={styles.versionText}>Student Finance App v1.0.0</Text>

          {/* Prazan prostor za tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Zaglavlje
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 25,
  },
  // Korisnicka sekcija
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E3A',
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitial: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#A0A0C0',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2D2D5A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Sekcije
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#A0A0C0',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingsSection: {
    backgroundColor: '#1E1E3A',
    borderRadius: 16,
    marginBottom: 25,
    overflow: 'hidden',
  },
  // Settings item
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D5A',
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  settingsSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
    marginTop: 2,
  },
  // Logout dugme
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF444420',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 10,
  },
  // Verzija
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#A0A0C0',
    textAlign: 'center',
  },
});

export default SettingsScreen;
