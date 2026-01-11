import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from '../screens/IndexScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import LayoutScreen from '../screens/LayoutScreen';

const Stack = createNativeStackNavigator();

function withLayout(Screen) {
  return function Wrapped() {
    return (
      <LayoutScreen>
        <Screen />
      </LayoutScreen>
    );
  };
}

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={withLayout(IndexScreen)}
      />
      <Stack.Screen
        name="AddTransaction"
        component={withLayout(AddTransactionScreen)}
      />
    </Stack.Navigator>
  );
}
