import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import type { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null)

  const login = useCallback((username: string) => {
    setUser({ username })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const isAuthenticated = !!user

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, user, login, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
