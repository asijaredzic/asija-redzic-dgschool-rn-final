import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useWallet } from '../context/WalletProvider';
import { useTheme } from '../context/ThemeProvider';

import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';

export default function BalanceScreen() {
  const { balance, currency, transactions } = useWallet();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Header title="Balance" />

      <BalanceCard
        balance={balance}
        currency={currency}
      />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Transactions
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem item={item} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 16,
  },
});
