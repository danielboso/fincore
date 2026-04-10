import { createContext, useContext } from 'react'

export type AuthContextType = {
  isAuthenticated: boolean
  user: { username: string } | null
  login: (username: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
