import { createContext, useState, useContext, useEffect } from "react"
import usersData from "../../data/users.json"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const login = (email, password) => {
    const foundUser = usersData.users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      setUser(foundUser)
      return { success: true }
    }
    return { success: false, error: "Invalid credentials" }
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
