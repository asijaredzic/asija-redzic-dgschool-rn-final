import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';

export default function AddTransactionScreen({ navigation }) {
  const { addTransaction } = useWallet();
  const { theme } = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  function handleAdd() {
    if (!title || !amount) return;

    addTransaction(title, Number(amount));
    navigation.goBack();
  }

  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>
        Add transaction
      </Text>

      <TextInput
        placeholder="Title"
        placeholderTextColor={theme.muted}
        value={title}
        onChangeText={setTitle}
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text },
        ]}
      />

      <TextInput
        placeholder="Amount"
        placeholderTextColor={theme.muted}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text },
        ]}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 24,
  },
  input: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
});
