// App.js - Glavni fajl aplikacije
// Ovdje se pokrece cijela aplikacija i postavlja navigacija
// Ucitavamo fontove, postavljamo AuthProvider i definisemo navigaciju

import React from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Uvozimo fontove - Poppins font sa razlicitim tezinama
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

// Uvozimo AuthProvider i useAuth hook za autentifikaciju
import { AuthProvider, useAuth } from './context/AuthContext';

// Uvozimo sve ekrane aplikacije
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import OverviewScreen from './screens/OverviewScreen';
import CardsScreen from './screens/CardsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Kreiramo navigatore
// Stack navigator - za prijavu/odjavu (linearna navigacija)
const Stack = createNativeStackNavigator();
// Tab navigator - za donji meni (klikanje izmedju ekrana)
const Tab = createBottomTabNavigator();

// BottomTabs komponenta - donji meni sa tabovima
// Prikazuje se samo kada je korisnik prijavljen
const BottomTabs = () => {
  return (
    <Tab.Navigator
      // Opcije za sve tabove
      screenOptions={({ route }) => ({
        // Ikona za svaki tab - razlicita ikona za svaki ekran
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Odredjujemo ikonu na osnovu imena rute
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Overview') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Stilovi za tab bar
        tabBarActiveTintColor: '#8B5CF6', // Ljubicasta boja kada je aktivan
        tabBarInactiveTintColor: '#6B7280', // Siva boja kada nije aktivan
        tabBarStyle: {
          backgroundColor: '#1A1A2E', // Tamna pozadina
          borderTopWidth: 0, // Bez gornje linije
          height: 70, // Visina tab bara
          paddingBottom: 10,
          paddingTop: 10,
          position: 'absolute', // Fiksiran na dnu
          borderTopLeftRadius: 20, // Zaobljeni uglovi
          borderTopRightRadius: 20,
          elevation: 0, // Bez sjene na Androidu
          shadowOpacity: 0, // Bez sjene na iOS-u
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 11,
        },
        headerShown: false, // Ne prikazuj header
      })}
    >
      {/* Definisemo sve tabove */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// AppNavigator komponenta - odlucuje koji ekran prikazati
// Ako je korisnik prijavljen, prikazuje BottomTabs
// Ako nije prijavljen, prikazuje LoginScreen
const AppNavigator = () => {
  // Dohvatamo korisnika iz AuthContext-a
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Korisnik JE prijavljen - prikazujemo glavne ekrane
        <Stack.Screen name="Main" component={BottomTabs} />
      ) : (
        // Korisnik NIJE prijavljen - prikazujemo login ekran
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

// Glavna App komponenta - ulazna tacka aplikacije
export default function App() {
  // Ucitavamo Poppins fontove sa razlicitim tezinama
  // useFonts hook vraca [fontsLoaded] - true kada su fontovi ucitani
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  // Dok se fontovi ucitavaju, prikazujemo loading spinner
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // Kada su fontovi ucitani, prikazujemo aplikaciju
  return (
    // SafeAreaProvider osigurava da sadrzaj ne ide ispod notch-a ili status bara
    <SafeAreaProvider>
      {/* AuthProvider omata cijelu aplikaciju da bi svi ekrani imali pristup auth podacima */}
      <AuthProvider>
        {/* StatusBar podesava izgled status bara (vrijeme, baterija, itd.) */}
        <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
        {/* NavigationContainer omogucava navigaciju izmedju ekrana */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Stilovi za loading ekran
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1E',
  },
});
