import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import { ActivityIndicator, View } from "react-native"
import { AuthProvider, useAuth } from "./src/context/AuthContext"
import HomeScreen from "./src/screens/HomeScreen"
import WalletScreen from "./src/screens/WalletScreen"
import CardsScreen from "./src/screens/CardsScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import LoginScreen from "./src/screens/LoginScreen"

const Tab = createBottomTabNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Wallet") {
            iconName = focused ? "wallet" : "wallet-outline"
          } else if (route.name === "Cards") {
            iconName = focused ? "card" : "card-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          }

          return <Ionicons name={iconName} size={24} color={color} />
        },
        tabBarActiveTintColor: "#FF69B4",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    )
  }

  return user ? <TabNavigator /> : <LoginScreen />
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    )
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  )
}
