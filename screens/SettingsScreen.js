import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>

        <View style={[styles.userCard, { backgroundColor: colors.card }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>

          <TouchableOpacity style={[styles.option, { backgroundColor: colors.card }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.option, { backgroundColor: colors.card }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="moon-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D5DB", true: "#FF69B4" }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={[styles.option, { backgroundColor: colors.card }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="language-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Language</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Security</Text>

          <TouchableOpacity style={[styles.option, { backgroundColor: colors.card }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="lock-closed-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: colors.card }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: "#FF4444" }]} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFB6D9",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 30,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 18,
    borderRadius: 15,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    padding: 18,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    marginLeft: 10,
  },
})
