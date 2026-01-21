import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import categoriesData from "../data/categories.json"
import transactionsData from "../data/transactions.json"

export default function HomeScreen({ navigation }) {
  const { user } = useAuth()
  const { colors } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const filteredTransactions = transactionsData.transactions.filter((t) => {
    const matchesSearch = t.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (iconName) => {
    const iconMap = {
      wallet: "wallet",
      "trending-up": "trending-up",
      "piggy-bank": "cash",
    }
    return iconMap[iconName] || "ellipse"
  }

  const getTransactionIcon = (iconName) => {
    const iconMap = {
      school: "school",
      "fast-food": "fast-food",
      wallet: "wallet",
      cart: "cart",
      car: "car",
    }
    return iconMap[iconName] || "ellipse"
  }

  const openCategoryModal = (category) => {
    setSelectedCategory(category.name.toLowerCase())
    setModalVisible(true)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.pink }]}>
              <Text style={styles.avatarText}>{user?.avatar}</Text>
            </View>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>Hi, {user?.name}</Text>
              <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome back!</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.menuButton, { backgroundColor: colors.card }]}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categoriesData.categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => openCategoryModal(category)}
            >
              <Ionicons name={getCategoryIcon(category.icon)} size={32} color="#333" />
              <Text style={styles.categoryName}>{category.name}</Text>
              <Ionicons name="chevron-forward" size={16} color="#333" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Last operations</Text>
        {filteredTransactions.slice(0, 5).map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={[styles.transactionCard, { backgroundColor: colors.card }]}
            onPress={() => Alert.alert("Transaction", `${transaction.type}: $${Math.abs(transaction.amount)}`)}
          >
            <View style={[styles.transactionIcon, { backgroundColor: transaction.amount > 0 ? colors.green : colors.pink }]}>
              <Ionicons name={getTransactionIcon(transaction.icon)} size={24} color="#333" />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionType, { color: colors.text }]}>{transaction.type}</Text>
              <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{transaction.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: transaction.amount > 0 ? colors.success : colors.danger }]}>
              {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Category Details</Text>
                <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedCategory(null); }}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.modalTransaction, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalTransactionType, { color: colors.text }]}>{item.type}</Text>
                    <Text style={{ color: item.amount > 0 ? colors.success : colors.danger }}>
                      ${Math.abs(item.amount).toFixed(2)}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={<Text style={{ color: colors.textSecondary, textAlign: "center" }}>No transactions</Text>}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 14,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 10,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 24,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 20,
    marginRight: 12,
    width: 100,
    alignItems: "center",
    gap: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTransaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTransactionType: {
    fontSize: 16,
  },
})
