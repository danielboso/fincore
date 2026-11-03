import { createContext, useContext } from 'react'

export interface User {
  id: string
  username: string
  name: string | null
}

export interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
    }
  }
  return context
}
