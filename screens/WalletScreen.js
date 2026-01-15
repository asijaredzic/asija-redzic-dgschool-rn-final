import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LineChart } from "react-native-chart-kit"
import balanceData from "../../data/balanceHistory.json"

const screenWidth = Dimensions.get("window").width

export default function WalletScreen() {
  const chartData = {
    labels: balanceData.balanceHistory.map((item) => item.month),
    datasets: [
      {
        data: balanceData.balanceHistory.map((item) => item.balance),
      },
    ],
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <TouchableOpacity style={styles.monthSelector}>
              <Text style={styles.monthText}>Month</Text>
              <Ionicons name="chevron-down" size={16} color="#2C3E50" />
            </TouchableOpacity>
            <View style={styles.chartIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="list" size={20} color="#2C3E50" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                backgroundColor: "#FFB6D9",
                backgroundGradientFrom: "#FFB6D9",
                backgroundGradientTo: "#FFC9E5",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 20,
                },
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: "#fff",
                },
              }}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={false}
            />
            <View style={styles.balanceIndicator}>
              <View style={styles.balancePoint} />
              <Text style={styles.balanceValue}>+$65.70</Text>
            </View>
          </View>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalPercentage}>
              <Text style={styles.percentageText}>{balanceData.goal.percentage}%</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalLabel}>Your goal</Text>
              <Text style={styles.goalAmount}>
                ${balanceData.goal.current.toLocaleString()} of ${balanceData.goal.target.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#FF69B4" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Balance</Text>
          <View style={styles.balanceIcons}>
            <TouchableOpacity style={styles.balanceIcon}>
              <Ionicons name="home" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceIcon}>
              <Ionicons name="stats-chart" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceIcon}>
              <Ionicons name="grid" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.balanceIcon, styles.activeIcon]}>
              <Ionicons name="bulb" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceIcon}>
              <Ionicons name="calendar" size={24} color="#999" />
            </TouchableOpacity>
          </View>
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
  chartSection: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  monthText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#2C3E50",
    marginRight: 5,
  },
  chartIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  chartContainer: {
    position: "relative",
  },
  chart: {
    borderRadius: 20,
  },
  balanceIndicator: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: [{ translateX: -40 }],
    alignItems: "center",
  },
  balancePoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  goalCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalPercentage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF69B4",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
  goalInfo: {
    flex: 1,
    marginLeft: 15,
  },
  goalLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#999",
  },
  goalAmount: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginTop: 2,
    color: "#2C3E50",
  },
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  balanceTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
    color: "#2C3E50",
  },
  balanceIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIcon: {
    backgroundColor: "#2C3E50",
  },
})
