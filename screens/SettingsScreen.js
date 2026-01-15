import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useAuth } from "../context/AuthContext"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    const result = login(email, password)
    if (!result.success) {
      Alert.alert("Error", result.error)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Hint: alex@example.com / password123</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#2C3E50",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 40,
    textAlign: "center",
    color: "#999",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    backgroundColor: "#fff",
    color: "#2C3E50",
  },
  button: {
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF69B4",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#999",
  },
})
