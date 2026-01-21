import React, { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LineChart } from "react-native-chart-kit"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import balanceHistoryData from "../data/balanceHistory.json"
import transactionsData from "../data/transactions.json"

const screenWidth = Dimensions.get("window").width

export default function WalletScreen() {
  const { user } = useAuth()
  const { colors } = useTheme()
  const [selectedMonth, setSelectedMonth] = useState("Apr")

  const chartData = {
    labels: balanceHistoryData.balanceHistory.map((item) => item.month),
    datasets: [
      {
        data: balanceHistoryData.balanceHistory.map((item) => item.balance),
        color: () => colors.primary,
        strokeWidth: 3,
      },
    ],
  }

  const chartConfig = {
    backgroundColor: colors.cardAlt,
    backgroundGradientFrom: colors.cardAlt,
    backgroundGradientTo: colors.cardAlt,
    decimalPlaces: 0,
    color: () => colors.text,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary,
    },
  }

  const goal = balanceHistoryData.goal

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Wallet</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.monthSelector}>
          <Text style={[styles.monthText, { color: colors.text }]}>Month</Text>
          <Ionicons name="chevron-down" size={16} color={colors.text} />
          <View style={styles.monthActions}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card }]}>
              <Ionicons name="pencil" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card }]}>
              <Ionicons name="bar-chart" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.cardAlt }]}>
          <View style={styles.chartHeader}>
            <View style={[styles.amountBadge, { backgroundColor: colors.card }]}>
              <Text style={[styles.amountText, { color: colors.success }]}>+365.70</Text>
            </View>
          </View>
          <LineChart
            data={chartData}
            width={screenWidth - 60}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthsScroll}>
            {balanceHistoryData.balanceHistory.map((item) => (
              <TouchableOpacity
                key={item.month}
                style={[styles.monthButton, selectedMonth === item.month && { backgroundColor: colors.card }]}
                onPress={() => setSelectedMonth(item.month)}
              >
                <Text style={[styles.monthButtonText, { color: selectedMonth === item.month ? colors.text : colors.textSecondary }]}>
                  {item.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.goalCard, { backgroundColor: colors.card }]}>
          <View style={styles.goalHeader}>
            <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.progressText, { color: colors.primary }]}>{goal.percentage}%</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Your goal</Text>
              <Text style={[styles.goalAmount, { color: colors.text }]}>
                ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity style={[styles.arrowButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Balance</Text>
        {transactionsData.transactions.slice(0, 3).map((transaction) => (
          <TouchableOpacity key={transaction.id} style={[styles.transactionRow, { backgroundColor: colors.card }]}>
            <View style={[styles.transactionIcon, { backgroundColor: transaction.amount > 0 ? colors.green : colors.pink }]}>
              <Ionicons name={transaction.icon} size={20} color="#333" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={[styles.transactionType, { color: colors.text }]}>{transaction.type}</Text>
              <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{transaction.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: transaction.amount > 0 ? colors.success : colors.danger }]}>
              {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
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
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
  },
  monthActions: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 12,
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
  },
  chartCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  chartHeader: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  amountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  monthsScroll: {
    marginTop: 10,
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  monthButtonText: {
    fontSize: 14,
  },
  goalCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  goalInfo: {
    flex: 1,
    marginLeft: 16,
  },
  goalLabel: {
    fontSize: 14,
  },
  goalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
})
