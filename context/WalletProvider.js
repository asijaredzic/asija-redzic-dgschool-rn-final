import { createContext, useContext, useState } from 'react';

import walletData from '../data/wallet.json';
import transactionsData from '../data/transactions.json';
import goalData from '../data/goal.json';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(walletData.balance);
  const [currency] = useState(walletData.currency);
  const [transactions, setTransactions] = useState(transactionsData);
  const [goal, setGoal] = useState(goalData);

  function addTransaction(title, amount) {
    const newTransaction = {
      id: Date.now().toString(),
      title,
      amount,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);
  }

  function updateGoal(newCurrent) {
    setGoal(prev => ({
      ...prev,
      current: newCurrent,
    }));
  }

  return (
    <WalletContext.Provider
      value={{
        balance,
        currency,
        transactions,
        goal,
        addTransaction,
        updateGoal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
