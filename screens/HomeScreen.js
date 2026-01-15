import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import categoriesData from "../../data/categories.json"
import transactionsData from "../../data/transactions.json"

export default function HomeScreen() {
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)

  const filteredTransactions = transactionsData.transactions.filter((transaction) => {
    const matchesSearch = transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={30} color="#fff" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      {selectedCategory === item.id && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
      {!selectedCategory && <Ionicons name="chevron-forward" size={16} color="#666" />}
    </TouchableOpacity>
  )

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: item.amount > 0 ? "#C4F0C2" : "#FFE5F0" }]}>
        <Ionicons name={item.icon} size={24} color={item.amount > 0 ? "#4CAF50" : "#FF69B4"} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.amount > 0 ? "#4CAF50" : "#2C3E50" }]}>
        {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hi, {user?.name} {user?.avatar}
            </Text>
            <Text style={styles.welcomeText}>Welcome back!</Text>
          </View>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="ellipsis-vertical" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearFilter}>Clear filter</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={categoriesData.categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery || selectedCategory ? "Filtered operations" : "Last operations"}
          </Text>
          {filteredTransactions.length > 0 ? (
            <FlatList
              data={filteredTransactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noResults}>No transactions found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#2C3E50",
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#2C3E50",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#2C3E50",
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 20,
    marginBottom: 15,
    color: "#2C3E50",
  },
  clearFilter: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#FF69B4",
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    width: 120,
    height: 140,
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 5,
    justifyContent: "space-between",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#2C3E50",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 15,
  },
  transactionType: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#2C3E50",
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
    color: "#999",
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  noResults: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
})
