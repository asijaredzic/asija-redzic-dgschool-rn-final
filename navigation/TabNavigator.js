import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IndexScreen from '../screens/IndexScreen';
import WalletScreen from '../screens/WalletScreen';
import BalanceScreen from '../screens/BalanceScreen';
import LayoutScreen from '../screens/LayoutScreen';
import { Home, Wallet, BarChart3 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeProvider';

const Tab = createBottomTabNavigator();

function withLayout(Screen) {
  return function WrappedScreen() {
    return (
      <LayoutScreen>
        <Screen />
      </LayoutScreen>
    );
  };
}

export default function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0,
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={withLayout(IndexScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <Home
              size={22}
              color={focused ? theme.text : theme.muted}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={withLayout(WalletScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <Wallet
              size={22}
              color={focused ? theme.text : theme.muted}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Balance"
        component={withLayout(BalanceScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <BarChart3
              size={22}
              color={focused ? theme.text : theme.muted}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

