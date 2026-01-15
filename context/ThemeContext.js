import { createContext, useState, useContext } from "react"

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const theme = {
    isDarkMode,
    colors: isDarkMode
      ? {
          background: "#1a1a1a",
          card: "#2a2a2a",
          text: "#ffffff",
          textSecondary: "#cccccc",
          primary: "#FF69B4",
          secondary: "#A4C8E1",
          accent: "#C4F0C2",
        }
      : {
          background: "#F5F7FA",
          card: "#ffffff",
          text: "#2C3E50",
          textSecondary: "#7F8C8D",
          primary: "#FF69B4",
          secondary: "#A4C8E1",
          accent: "#C4F0C2",
        },
    toggleTheme: () => setIsDarkMode(!isDarkMode),
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
