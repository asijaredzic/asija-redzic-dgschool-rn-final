import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import categoriesData from "../../data/categories.json"
import transactionsData from "../../data/transactions.json"

export default function HomeScreen() {
  const { user, logout } = useAuth()
  const { colors } = useTheme()

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: item.color }]}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={30} color="#fff" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={16} color="#666" />
    </TouchableOpacity>
  )

  const renderTransaction = ({ item }) => (
    <View style={[styles.transactionItem, { backgroundColor: colors.card }]}>
      <View style={[styles.transactionIcon, { backgroundColor: item.amount > 0 ? "#C4F0C2" : "#FFE5F0" }]}>
        <Ionicons name={item.icon} size={24} color={item.amount > 0 ? "#4CAF50" : "#FF69B4"} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionType, { color: colors.text }]}>{item.type}</Text>
        <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.amount > 0 ? "#4CAF50" : colors.text }]}>
        {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hi, {user?.name} {user?.avatar}
            </Text>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome back!</Text>
          </View>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <Text style={[styles.searchText, { color: colors.textSecondary }]}>Search...</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Last operations</Text>
          <FlatList
            data={transactionsData.transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 20,
    marginBottom: 15,
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
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
})
