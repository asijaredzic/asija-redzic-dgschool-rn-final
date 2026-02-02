// ============================================
// APP.JS - OVO JE GLAVNI FAJL MOJE APLIKACIJE
// ============================================
// Zamislite ovaj fajl kao "ulazna vrata" u moju aplikaciju.
// Kada neko otvori aplikaciju, prvo se pokrece ovaj fajl.
// Ovdje sam postavio sve sto mi treba: fontove, navigaciju i sistem za prijavu.

// Prvo uvozim sve biblioteke koje mi trebaju
import React from 'react';

// Ove komponente dolaze iz React Native - to je kao kutija sa gotovim dijelovima
// StatusBar - to je ona traka na vrhu telefona sa vremenom i baterijom
// View - to je kao kutija u koju stavljam stvari
// ActivityIndicator - to je onaj krug koji se vrti dok nesto cekam
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';

// Ovo mi treba za navigaciju - da mogu prelaziti sa ekrana na ekran
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// SafeAreaProvider mi pomaze da sadrzaj ne ide ispod "notch-a" na novim telefonima
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Ionicons su ikonice koje koristim u aplikaciji (kao mali crtezi)
import { Ionicons } from '@expo/vector-icons';

// Uvozim Poppins font - to je poseban stil slova koji mi se svidja
// Imam razlicite "debljine" slova: Regular (obicna), Medium, SemiBold i Bold (debela)
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

// AuthProvider mi daje sistem za prijavu korisnika
// useAuth mi omogucava da provjerim da li je neko prijavljen
import { AuthProvider, useAuth } from './context/AuthContext';

// Ovo su moji ekrani - svaki ekran je kao jedna stranica u aplikaciji
import LoginScreen from './screens/LoginScreen';       // Ekran za prijavu
import HomeScreen from './screens/HomeScreen';         // Glavni ekran sa balansom
import OverviewScreen from './screens/OverviewScreen'; // Ekran sa statistikom
import CardsScreen from './screens/CardsScreen';       // Ekran sa karticama
import SettingsScreen from './screens/SettingsScreen'; // Ekran sa postavkama


// ============================================
// PRAVIM NAVIGATORE
// ============================================
// Navigator je kao "vodic" koji zna kako da me vodi sa ekrana na ekran.
// Imam dva tipa navigatora:

// 1. Stack Navigator - to je kao kupe karata, jedan ekran ide na drugi
//    Koristim ga za prijavu - kada se prijavim, idem na glavni ekran
const Stack = createNativeStackNavigator();

// 2. Tab Navigator - to je donji meni sa ikonama
//    Koristim ga za glavne ekrane - mogu kliknuti na ikonu i ici na taj ekran
const Tab = createBottomTabNavigator();


// ============================================
// DONJI MENI SA TABOVIMA
// ============================================
// Ova funkcija pravi donji meni koji se vidi kada sam prijavljen.
// Ima 4 dugmeta: Home, Overview, Cards i Settings
const BottomTabs = () => {
  return (
    <Tab.Navigator
      // screenOptions su postavke za sve tabove
      screenOptions={({ route }) => ({
        
        // Ovdje biram ikonu za svaki tab
        // "focused" mi kaze da li je taj tab trenutno aktivan (kliknuo sam na njega)
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Za svaki ekran biram drugu ikonu
          // Ako je "focused", koristim punu ikonu, inace "outline" (samo obris)
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Overview') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Cards') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // Vracam ikonu sa odabranim imenom, velicinom i bojom
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        // Boja kada je tab aktivan - ljubicasta
        tabBarActiveTintColor: '#8B5CF6',
        
        // Boja kada tab nije aktivan - siva
        tabBarInactiveTintColor: '#6B7280',
        
        // Stilovi za cijeli tab bar (donji meni)
        tabBarStyle: {
          backgroundColor: '#1A1A2E',    // Tamno plava pozadina
          borderTopWidth: 0,              // Bez linije na vrhu
          height: 70,                     // Visina menija
          paddingBottom: 10,
          paddingTop: 10,
          position: 'absolute',           // Fiksiran na dnu ekrana
          borderTopLeftRadius: 20,        // Zaobljeni uglovi
          borderTopRightRadius: 20,
          elevation: 0,                   // Bez sjene na Androidu
          shadowOpacity: 0,               // Bez sjene na iPhoneu
        },
        
        // Stil za tekst ispod ikona
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 11,
        },
        
        // Ne zelim header na vrhu svakog ekrana
        headerShown: false,
      })}
    >
      {/* Ovdje dodajem sve ekrane u meni */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};


// ============================================
// NAVIGATOR KOJI ODLUCUJE STA PRIKAZATI
// ============================================
// Ova funkcija provjerava da li je korisnik prijavljen.
// Ako JESTE prijavljen - pokazujem mu glavne ekrane (BottomTabs)
// Ako NIJE prijavljen - pokazujem mu ekran za prijavu (LoginScreen)
const AppNavigator = () => {
  // Uzimam podatke o korisniku iz AuthContext-a
  // Ako je "user" prazan (null), znaci da niko nije prijavljen
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Ako postoji "user", znaci da je neko prijavljen
        // Pokazujem mu glavne ekrane
        <Stack.Screen name="Main" component={BottomTabs} />
      ) : (
        // Ako ne postoji "user", niko nije prijavljen
        // Pokazujem ekran za prijavu
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};


// ============================================
// GLAVNA APP FUNKCIJA - SVE POCINJE OVDJE
// ============================================
// Ovo je glavna funkcija koja se prva pokrece.
// Ona ucitava fontove i prikazuje cijelu aplikaciju.
export default function App() {
  
  // Ucitavam fontove koji mi trebaju
  // useFonts mi vraca "fontsLoaded" - true kada su fontovi spremni
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  // Dok se fontovi ucitavaju, pokazujem krug koji se vrti
  // To je kao "molim sacekajte" ekran
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // Kada su fontovi ucitani, prikazujem aplikaciju
  return (
    // SafeAreaProvider brine da sadrzaj ne ide ispod "notch-a"
    <SafeAreaProvider>
      {/* AuthProvider "omata" aplikaciju i daje svima pristup podacima o korisniku */}
      <AuthProvider>
        {/* StatusBar postavlja izgled gornje trake (vrijeme, baterija) */}
        <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
        
        {/* NavigationContainer omogucava prelazenje izmedju ekrana */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}


// ============================================
// STILOVI
// ============================================
// Ovdje definisem kako izgleda loading ekran
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,                        // Zauzmi cijeli ekran
    justifyContent: 'center',       // Centriraj vertikalno
    alignItems: 'center',           // Centriraj horizontalno
    backgroundColor: '#0F0F1E',     // Tamna pozadina
  },
});
