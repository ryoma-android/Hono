'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSearch } from '@/hooks/useSearch'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  onResultClick?: (item: any) => void
}

export function SearchBar({ className, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { search, results, loading, clearSearch } = useSearch()

  useEffect(() => {
    if (query.trim()) {
      search(query)
      setIsOpen(true)
    } else {
      clearSearch()
      setIsOpen(false)
    }
  }, [query, search, clearSearch])

  const handleResultClick = (item: any) => {
    onResultClick?.(item)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery('')
              clearSearch()
              setIsOpen(false)
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && (results?.total || 0) > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">検索中...</div>
          ) : (
            <>
              {results?.documents && results.documents.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-700">
                    ドキュメント ({results.documents.length})
                  </div>
                  {results.documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleResultClick(doc)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span className="text-lg">📄</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {doc.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results?.folders && results.folders.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-700">
                    フォルダ ({results.folders.length})
                  </div>
                  {results.folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => handleResultClick(folder)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span className="text-lg">📁</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {folder.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isOpen && query && !loading && (results?.total || 0) === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
          <div className="p-4 text-center text-gray-500">
            検索結果が見つかりませんでした
          </div>
        </div>
      )}
    </div>
  )
} 