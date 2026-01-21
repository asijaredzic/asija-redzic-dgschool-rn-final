import React, { createContext, useContext, useState, useEffect } from "react"
import usersData from "../data/users.json"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const foundUser = usersData.users.find(
      (u) => u.email === email && u.password === password
    )
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const updateBalance = (amount) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount })
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
