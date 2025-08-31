'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useState } from 'react'

export default function HomePage() {
  const { user } = useAuth()
  const [showLogin, setShowLogin] = useState(true)

  if (user) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Notion Clone
          </h1>
          <p className="text-muted-foreground">
            ドキュメント管理をシンプルに
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-lg border">
          <div className="flex mb-6">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-2 px-4 rounded-l-md transition-colors ${
                showLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              ログイン
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-2 px-4 rounded-r-md transition-colors ${
                !showLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              新規登録
            </button>
          </div>

          {showLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Notion Clone</h1>
          <UserMenu />
        </div>
      </header>
      
      <main className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            ようこそ！
          </h2>
          <p className="text-muted-foreground">
            左側のサイドバーからドキュメントやフォルダを作成できます。
          </p>
        </div>
      </main>
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-muted-foreground">
        {user?.name}
      </span>
      <button
        onClick={logout}
        className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
      >
        ログアウト
      </button>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card p-4">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">ナビゲーション</h3>
        <nav className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
            📄 すべてのページ
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
            📁 フォルダ
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
            ⭐ お気に入り
          </button>
        </nav>
      </div>
    </aside>
  )
} 