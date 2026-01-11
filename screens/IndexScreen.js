import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';
import TransactionItem from '../components/TransactionItem';

export default function IndexScreen() {
  const { balance, currency, transactions } = useWallet();
  const { theme } = useTheme();

  return (
    <View>
      <Text style={[styles.greeting, { color: theme.text }]}>
        Hi, Alex 👋
      </Text>

      <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.balanceLabel}>Total balance</Text>
        <Text style={styles.balanceValue}>
          {currency} {balance.toLocaleString()}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Last transactions
      </Text>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  balanceValue: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
});
