import React, { createContext, useContext, useState } from "react"

const ThemeContext = createContext()

const lightTheme = {
  background: "#E8F4FC",
  card: "#FFFFFF",
  cardAlt: "#FFD6E8",
  primary: "#FF69B4",
  text: "#1A1A2E",
  textSecondary: "#666666",
  success: "#8acc8c",
  danger: "#FF5252",
  border: "#E0E0E0",
  inputBg: "#F5F5F5",
  pink: "#FFB6D9",
  blue: "#A4C8E1",
  green: "#C4F0C2",
  yellow: "#FFF3C4",
}

const darkTheme = {
  background: "#1A1A2E",
  card: "#2D2D44",
  cardAlt: "#3D3D5C",
  primary: "#FF69B4",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  success: "#8acc8c",
  danger: "#FF5252",
  border: "#3D3D5C",
  inputBg: "#2D2D44",
  pink: "#FFB6D9",
  blue: "#A4C8E1",
  green: "#C4F0C2",
  yellow: "#FFF3C4",
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => setIsDark(!isDark)
  const colors = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
