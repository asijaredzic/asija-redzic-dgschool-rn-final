import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function SettingsScreen() {
  const { user, logout } = useAuth()
  const { colors, isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: logout, style: "destructive" },
    ])
  }

  const settingsOptions = [
    { icon: "person-outline", title: "Edit Profile", onPress: () => Alert.alert("Edit Profile", "Coming soon!") },
    { icon: "notifications-outline", title: "Notifications", onPress: () => Alert.alert("Notifications", "Coming soon!") },
    { icon: "lock-closed-outline", title: "Security", onPress: () => Alert.alert("Security", "Coming soon!") },
    { icon: "help-circle-outline", title: "Help & Support", onPress: () => Alert.alert("Help", "Contact: support@app.com") },
    { icon: "document-text-outline", title: "Terms of Service", onPress: () => Alert.alert("Terms", "Coming soon!") },
    { icon: "shield-checkmark-outline", title: "Privacy Policy", onPress: () => Alert.alert("Privacy", "Coming soon!") },
  ]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>

        <View style={[styles.userCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: colors.pink }]}>
            <Text style={styles.avatarText}>{user?.avatar}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account</Text>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.settingItem, { backgroundColor: colors.card }]}
              onPress={option.onPress}
            >
              <View style={styles.settingLeft}>
                <Ionicons name={option.icon} size={24} color={colors.primary} />
                <Text style={[styles.settingTitle, { color: colors.text }]}>{option.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.danger }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingTitle: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 12,
    marginTop: 8,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  version: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 40,
  },
})
