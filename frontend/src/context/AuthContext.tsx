import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type User = {
  id?: string
  email: string
  name?: string
  role?: 'USER' | 'ADMIN'
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  signIn: (token: string, user: User) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('auth_token')
    const u = localStorage.getItem('auth_user')
    if (t) setToken(t)
    if (u) {
      try { setUser(JSON.parse(u)) } catch {}
    }
  }, [])

  const signIn = (t: string, u: User) => {
    setToken(t)
    setUser(u)
    localStorage.setItem('auth_token', t)
    localStorage.setItem('auth_user', JSON.stringify(u))
  }

  const signOut = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const value = useMemo<AuthContextType>(
    () => ({ token, user, isAuthenticated: !!token, signIn, signOut }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
