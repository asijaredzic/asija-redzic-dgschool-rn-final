import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import cardsData from "../data/cards.json"

export default function CardsScreen() {
  const { user } = useAuth()
  const { colors } = useTheme()
  const [cards, setCards] = useState(cardsData.cards)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [transferAmount, setTransferAmount] = useState("")

  const openCardDetails = (card) => {
    setSelectedCard(card)
    setModalVisible(true)
  }

  const handleTransfer = () => {
    if (!transferAmount || isNaN(Number(transferAmount))) {
      Alert.alert("Error", "Please enter a valid amount")
      return
    }
    Alert.alert("Success", `Transfer of $${transferAmount} initiated from ${selectedCard.type}`)
    setTransferAmount("")
    setModalVisible(false)
  }

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

        <View style={[styles.balanceCard, { backgroundColor: colors.yellow }]}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>${user?.balance?.toLocaleString() || "8,689"}</Text>
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageText}>+15%</Text>
            </View>
          </View>
          <View style={styles.moneyIcons}>
            <Text style={styles.moneyIcon}>💵</Text>
            <Text style={styles.moneyIcon}>💵</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your cards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardItem, { backgroundColor: card.color }]}
              onPress={() => openCardDetails(card)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{card.type}</Text>
                {card.type === "Mastercard" && <View style={styles.mastercardLogo}><View style={styles.mcCircle1} /><View style={styles.mcCircle2} /></View>}
                {card.type === "Visa" && <Text style={styles.visaLogo}>VISA</Text>}
              </View>
              <Text style={styles.cardBalanceLabel}>Balance</Text>
              <Text style={styles.cardBalance}>${card.balance.toLocaleString()}</Text>
              <Text style={styles.cardNumber}>{card.cardNumber}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.addCardButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="add" size={32} color={colors.primary} />
            <Text style={[styles.addCardText, { color: colors.textSecondary }]}>Add Card</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-up" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="arrow-down" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="swap-horizontal" size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Exchange</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedCard?.type} Details</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={[styles.modalCard, { backgroundColor: selectedCard?.color }]}>
                <Text style={styles.modalCardType}>{selectedCard?.type}</Text>
                <Text style={styles.modalCardBalance}>${selectedCard?.balance?.toLocaleString()}</Text>
                <Text style={styles.modalCardNumber}>{selectedCard?.cardNumber}</Text>
              </View>
              <Text style={[styles.transferLabel, { color: colors.text }]}>Quick Transfer</Text>
              <View style={[styles.transferInput, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
                <TextInput
                  style={[styles.amountInput, { color: colors.text }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={transferAmount}
                  onChangeText={setTransferAmount}
                />
              </View>
              <TouchableOpacity style={[styles.transferButton, { backgroundColor: colors.primary }]} onPress={handleTransfer}>
                <Text style={styles.transferButtonText}>Transfer</Text>
              </TouchableOpacity>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  percentageBadge: {
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentageText: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 12,
  },
  moneyIcons: {
    position: "absolute",
    right: 20,
    top: 20,
    flexDirection: "row",
  },
  moneyIcon: {
    fontSize: 24,
    marginLeft: -8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardsScroll: {
    marginBottom: 24,
  },
  cardItem: {
    width: 160,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardType: {
    fontSize: 12,
    color: "#333",
  },
  mastercardLogo: {
    flexDirection: "row",
  },
  mcCircle1: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EB001B",
  },
  mcCircle2: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F79E1B",
    marginLeft: -6,
  },
  visaLogo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1F71",
    fontStyle: "italic",
  },
  cardBalanceLabel: {
    fontSize: 12,
    color: "#666",
  },
  cardBalance: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  cardNumber: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  addCardButton: {
    width: 160,
    borderRadius: 20,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
  },
  addCardText: {
    marginTop: 8,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
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
  modalCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  modalCardType: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  modalCardBalance: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  modalCardNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
  },
  transferLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  transferInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
  },
  transferButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  transferButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})
