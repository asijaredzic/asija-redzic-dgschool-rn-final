import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import cardsData from "../../data/cards.json"

export default function CardsScreen() {
  const { colors } = useTheme()
  const { user } = useAuth()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Wallet</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.balanceSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Balance</Text>
          <View style={styles.balanceContent}>
            <Text style={[styles.balanceAmount, { color: colors.text }]}>${user?.balance.toLocaleString()}</Text>
            <View style={styles.balanceInfo}>
              <Text style={[styles.totalBalance, { color: colors.textSecondary }]}>Your total balance</Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your cards</Text>
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
  },
  balanceSection: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
  },
  balanceContent: {
    marginBottom: 15,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  balanceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalBalance: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginRight: 10,
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
