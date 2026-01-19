// SettingsScreen.js - Ekran za postavke aplikacije

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Uvozimo useAuth za pristup podacima o korisniku i logout funkciji
import { useAuth } from '../context/AuthContext';

// KOMPONENTA ZA JEDNU STAVKU U POSTAVKAMA
function SettingsItem({ icon, label, value, onPress, isSwitch, switchValue, onSwitchChange }) {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={isSwitch} // Ako je switch, ne reaguje na pritisak
    >
      {/* Lijeva strana - ikona i tekst */}
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIcon}>
          <Ionicons name={icon} size={20} color="#4ADE80" />
        </View>
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>

      {/* Desna strana - vrijednost, strelica ili switch */}
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#1A1A24', true: '#4ADE80' }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        )}
      </View>
    </TouchableOpacity>
  );
}

// KOMPONENTA ZA SEKCIJU POSTAVKI
function SettingsSection({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

// GLAVNA KOMPONENTA
export default function SettingsScreen() {
  // Uzimamo podatke o korisniku i logout funkciju iz AuthContext-a
  const { user, logout } = useAuth();

  // State varijable za switch-eve
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  // FUNKCIJA ZA ODJAVU
  const handleLogout = () => {
    // Alert.alert prikazuje popup sa pitanjem
    Alert.alert(
      'Odjava',
      'Da li ste sigurni da zelite da se odjavite?',
      [
        { text: 'Otkazi', style: 'cancel' },
        { text: 'Odjavi se', onPress: logout, style: 'destructive' },
      ]
    );
  };

  // Funkcija za prikaz poruke "Uskoro dostupno"
  const showComingSoon = () => {
    Alert.alert('Info', 'Ova funkcija ce uskoro biti dostupna!');
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFIL KORISNIKA */}
        <TouchableOpacity style={styles.profileBox}>
          {/* Avatar */}
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={32} color="#4ADE80" />
          </View>
          {/* Ime i email */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Korisnik'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* ACCOUNT SEKCIJA */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            label="Personal Information"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="card-outline"
            label="Payment Methods"
            value="3 cards"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label="Security"
            onPress={showComingSoon}
          />
        </SettingsSection>

        {/* PREFERENCES SEKCIJA */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="notifications-outline"
            label="Notifications"
            isSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <SettingsItem
            icon="moon-outline"
            label="Dark Mode"
            isSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingsItem
            icon="finger-print-outline"
            label="Biometrics"
            isSwitch
            switchValue={biometrics}
            onSwitchChange={setBiometrics}
          />
          <SettingsItem
            icon="language-outline"
            label="Language"
            value="English"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="cash-outline"
            label="Currency"
            value="USD ($)"
            onPress={showComingSoon}
          />
        </SettingsSection>

        {/* SUPPORT SEKCIJA */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="chatbubble-outline"
            label="Contact Us"
            onPress={showComingSoon}
          />
          <SettingsItem
            icon="document-text-outline"
            label="Terms & Privacy"
            onPress={showComingSoon}
          />
        </SettingsSection>

        {/* LOGOUT DUGME */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Odjavi se</Text>
        </TouchableOpacity>

        {/* VERZIJA APLIKACIJE */}
        <Text style={styles.versionText}>Version 1.0.0</Text>

        {/* Prazan prostor za bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// STILOVI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D12',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Profil stilovi
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A24',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D2D3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  // Sekcija stilovi
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: '#1A1A24',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  // Settings item stilovi
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D3A',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2D2D3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsLabel: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsValue: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  // Logout stilovi
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
});
