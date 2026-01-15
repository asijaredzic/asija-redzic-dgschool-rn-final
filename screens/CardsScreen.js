import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import cardsData from "../../data/cards.json"

export default function CardsScreen() {
  const { user } = useAuth()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="close" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <View style={styles.balanceContent}>
            <Text style={styles.balanceAmount}>${user?.balance.toLocaleString()}</Text>
            <View style={styles.balanceInfo}>
              <Text style={styles.totalBalance}>Your total balance</Text>
              <View style={styles.increaseTag}>
                <Ionicons name="trending-up" size={16} color="#4CAF50" />
                <Text style={styles.increaseText}>+10%</Text>
              </View>
            </View>
          </View>
          <View style={styles.moneyIllustration}>
            <Text style={styles.moneyEmoji}>💵</Text>
            <Text style={styles.moneyEmoji}>💵</Text>
            <Text style={styles.moneyEmoji}>💵</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your cards</Text>
          {cardsData.cards.map((card) => (
            <View key={card.id} style={[styles.card, { backgroundColor: card.color }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardBalance}>Balance</Text>
                <Text style={styles.cardType}>{card.type}</Text>
              </View>
              <Text style={styles.cardAmount}>${card.balance.toLocaleString()}</Text>
              <Text style={styles.cardNumber}>{card.cardNumber}</Text>
            </View>
          ))}
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
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#2C3E50",
  },
  balanceSection: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    backgroundColor: "#fff",
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
    color: "#999",
  },
  balanceContent: {
    marginBottom: 15,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
    color: "#2C3E50",
  },
  balanceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalBalance: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginRight: 10,
    color: "#999",
  },
  increaseTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  increaseText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#4CAF50",
    marginLeft: 3,
  },
  moneyIllustration: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  moneyEmoji: {
    fontSize: 30,
    marginLeft: 5,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
    color: "#2C3E50",
  },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    minHeight: 180,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  cardBalance: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#2C3E50",
  },
  cardType: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#2C3E50",
  },
  cardAmount: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#2C3E50",
    marginBottom: 15,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#2C3E50",
  },
})
