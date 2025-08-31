'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function Providers({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
} 