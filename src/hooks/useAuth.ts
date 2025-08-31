import { useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import type { LoginRequest, RegisterRequest, User } from '@/types'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, setUser, logout: logoutStore } = useAppStore()

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'ログインに失敗しました')
      }

      setUser(data.data.user)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ログインに失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser])

  const register = useCallback(async (userData: RegisterRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登録に失敗しました')
      }

      setUser(data.data.user)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : '登録に失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      logoutStore()
    }
  }, [logoutStore])

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setUser(null)
    }
  }, [setUser])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  }
} 