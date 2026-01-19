// App.js - Glavna datoteka koja pokrece cijelu aplikaciju

import React from 'react';
import { StatusBar } from 'react-native';

// Uvozimo NavigationContainer koji omogucava navigaciju
import { NavigationContainer } from '@react-navigation/native';

// Uvozimo createBottomTabNavigator za donji tab meni
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Uvozimo ikone
import { Ionicons } from '@expo/vector-icons';

// Uvozimo AuthProvider i useAuth hook iz naseg AuthContext-a
import { AuthProvider, useAuth } from './context/AuthContext';

// Uvozimo sve ekrane
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import WalletScreen from './screens/WalletScreen';
import CardsScreen from './screens/CardsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Kreiramo Tab Navigator
// Tab Navigator je navigacija sa tabovima na dnu ekrana
const Tab = createBottomTabNavigator();

// KOMPONENTA GLAVNE APLIKACIJE SA NAVIGACIJOM
function MainApp() {
  // Uzimamo isLoggedIn iz AuthContext-a
  // isLoggedIn je true ako je korisnik ulogovan, false ako nije
  const { isLoggedIn } = useAuth();

  // Ako korisnik NIJE ulogovan, prikazujemo LoginScreen
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // Ako JE ulogovan, prikazujemo Tab Navigator sa 5 ekrana
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Ova funkcija odredjuje koju ikonu prikazati za svaki tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Biramo ikonu na osnovu imena rute
          if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // Vracamo Ionicons komponentu sa odabranom ikonom
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Boja aktivnog taba (zelena)
        tabBarActiveTintColor: '#4ADE80',
        // Boja neaktivnog taba (siva)
        tabBarInactiveTintColor: '#6B7280',
        // Stilovi za tab bar
        tabBarStyle: {
          backgroundColor: '#1A1A24',  // Tamna pozadina
          borderTopWidth: 0,           // Bez gornje linije
          height: 80,                  // Visina tab bara
          paddingBottom: 20,
          paddingTop: 10,
          position: 'absolute',        // Fiksirana pozicija
          borderTopLeftRadius: 24,     // Zaobljeni uglovi
          borderTopRightRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        // Sakrivamo header jer imamo svoj custom header u svakom ekranu
        headerShown: false,
      })}
    >
      {/* Definisemo sve ekrane u Tab Navigator-u */}
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Stats" component={HomeScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// GLAVNA APP KOMPONENTA
// Ovo je komponenta koju React Native ucitava na pocetku
export default function App() {
  return (
    // AuthProvider "obavija" cijelu aplikaciju
    // Tako sve komponente unutar mogu pristupiti podacima o korisniku
    <AuthProvider>
      {/* NavigationContainer omogucava navigaciju izmedju ekrana */}
      <NavigationContainer>
        {/* StatusBar podesava izgled gornje trake na telefonu */}
        <StatusBar barStyle="light-content" backgroundColor="#0D0D12" />
        {/* MainApp je nasa glavna aplikacija */}
        <MainApp />
      </NavigationContainer>
    </AuthProvider>
  );
}
