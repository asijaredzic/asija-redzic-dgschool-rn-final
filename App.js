import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) return <View />;

  return (
    <ThemeProvider>
      <WalletProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </WalletProvider>
    </ThemeProvider>


  );
}
