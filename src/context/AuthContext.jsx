import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getSessionApi,
  loginApi,
  logoutApi,
  signupApi
} from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const data = await getSessionApi()
      setUser(data.authenticated ? data.user : null)
      return data
    } catch {
      setUser(null)
      return { authenticated: false, user: null }
    }
  }

  useEffect(() => {
    const bootstrapAuth = async () => {
      await refreshSession()
      setIsLoading(false)
    }

    bootstrapAuth()
  }, [])

  const login = async (payload) => {
    const data = await loginApi(payload)
    setUser(data.user)
    return data
  }

  const signup = async (payload) => {
    const data = await signupApi(payload)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await logoutApi()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      refreshSession
    }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
