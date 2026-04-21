import { useMemo } from 'react'
import { AuthContext, type User } from './auth-context'
import type { ReactNode } from 'react'

export function AuthProvider({
  children,
  initialUser,
  initialIsAuthenticated
}: {
  children: ReactNode,
  initialUser: User | null,
  initialIsAuthenticated: boolean
}) {
  const value = useMemo(
    () => ({
      isAuthenticated: initialIsAuthenticated,
      user: initialUser,
      isLoading: false,
    }),
    [initialUser, initialIsAuthenticated]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
