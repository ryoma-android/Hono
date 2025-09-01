'use client'

import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { SearchBar } from '@/components/search/SearchBar'
import { DraggableSidebar } from '@/components/sidebar/DraggableSidebar'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { 
  Sun, 
  Moon, 
  Monitor, 
  Menu, 
  X,
  Plus,
  Folder,
  Star,
  Share2,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Document, Folder as FolderType } from '@/types'

export default function HomePage() {
  const { user } = useAuth()
  const { theme, toggleTheme, setThemeMode } = useTheme()
  const [showLogin, setShowLogin] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false)

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
              className={cn(
                'flex-1 py-2 px-4 rounded-l-md transition-colors',
                showLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              ログイン
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={cn(
                'flex-1 py-2 px-4 rounded-r-md transition-colors',
                !showLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
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
  const { user, logout } = useAuth()
  const { theme, toggleTheme, setThemeMode } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false)

  const handleItemClick = (item: Document | FolderType) => {
    if ('content' in item) {
      setCurrentDocument(item)
    }
  }

  const handleNewDocument = () => {
    setShowNewDocumentModal(true)
  }

  const handleNewFolder = () => {
    // フォルダ作成ロジック
  }

  const handleSearchResult = (item: any) => {
    handleItemClick(item)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-xl font-bold text-foreground">Notion Clone</h1>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar 
              className="w-64" 
              onResultClick={handleSearchResult}
            />
            
            {/* テーマ切り替え */}
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button
                variant={theme === 'light' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setThemeMode('light')}
                className="h-8 w-8"
              >
                <Sun className="w-4 h-4" />
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setThemeMode('dark')}
                className="h-8 w-8"
              >
                <Moon className="w-4 h-4" />
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setThemeMode('system')}
                className="h-8 w-8"
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        {sidebarOpen && (
          <DraggableSidebar
            onItemClick={handleItemClick}
            onNewDocument={handleNewDocument}
            onNewFolder={handleNewFolder}
          />
        )}

        {/* メインコンテンツ */}
        <div className="flex-1 p-6">
          {currentDocument ? (
            <div className="space-y-4">
              {/* ドキュメントヘッダー */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentDocument.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {currentDocument.isFavorite && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* リッチテキストエディター */}
              <RichTextEditor
                content={currentDocument.content}
                onChange={(content) => {
                  // ドキュメント更新ロジック
                  console.log('Content updated:', content)
                }}
                className="min-h-[500px]"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ようこそ！
              </h2>
              <p className="text-muted-foreground mb-6">
                左側のサイドバーからドキュメントやフォルダを作成できます。
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={handleNewDocument}>
                  <Plus className="w-4 h-4 mr-2" />
                  新しいドキュメント
                </Button>
                <Button variant="outline" onClick={handleNewFolder}>
                  <Folder className="w-4 h-4 mr-2" />
                  新しいフォルダ
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 新規ドキュメント作成モーダル */}
      {showNewDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">新しいドキュメント</h3>
            <input
              type="text"
              placeholder="ドキュメントのタイトル"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewDocumentModal(false)}
              >
                キャンセル
              </Button>
              <Button onClick={() => setShowNewDocumentModal(false)}>
                作成
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 