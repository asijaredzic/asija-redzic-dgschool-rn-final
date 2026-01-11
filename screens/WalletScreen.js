import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useWallet } from '../context/WalletProvider';
import { useTheme } from '../context/ThemeProvider';

const screenWidth = Dimensions.get('window').width;

export default function WalletScreen() {
  const { balance, goal } = useWallet();
  const { theme } = useTheme();

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [
          balance - 300,
          balance - 150,
          balance - 220,
          balance - 80,
          balance,
        ],
      },
    ],
  };

  const progress = Math.round((goal.current / goal.target) * 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Wallet</Text>

      <View style={[styles.chartContainer, { backgroundColor: theme.primary }]}>
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={200}
          chartConfig={{
            backgroundColor: theme.primary,
            backgroundGradientFrom: theme.primary,
            backgroundGradientTo: theme.primary,
            color: () => theme.text,
            labelColor: () => theme.text,
            propsForDots: { r: '0' },
          }}
          bezier
          style={styles.chart}
        />

        <View style={[styles.goalCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.goalLabel, { color: theme.muted }]}>
            Your goal
          </Text>
          <Text style={[styles.goalValue, { color: theme.text }]}>
            ${goal.current} of ${goal.target}
          </Text>
          <Text style={[styles.goalProgress, { color: theme.text }]}>
            {progress}%
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
  },
  chartContainer: {
    borderRadius: 24,
    padding: 20,
  },
  chart: {
    borderRadius: 16,
  },
  goalCard: {
    marginTop: 20,
    borderRadius: 20,
    padding: 16,
  },
  goalLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  goalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  goalProgress: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginTop: 8,
  },
});
