'use client'

import { useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import type { SearchRequest, SearchResult } from '@/types'

export function useSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult | null>(null)
  const { documents, folders } = useAppStore()

  const search = useCallback(async (query: string, type: 'document' | 'folder' | 'all' = 'all') => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // クライアントサイド検索（実際のアプリではサーバーサイド検索を使用）
      const searchQuery = query.toLowerCase()
      
      const matchedDocuments = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery) ||
        doc.content.toLowerCase().includes(searchQuery) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      )

      const matchedFolders = folders.filter(folder =>
        folder.title.toLowerCase().includes(searchQuery)
      )

      const filteredResults: SearchResult = {
        documents: type === 'folder' ? [] : matchedDocuments,
        folders: type === 'document' ? [] : matchedFolders,
        total: (type === 'folder' ? 0 : matchedDocuments.length) + 
               (type === 'document' ? 0 : matchedFolders.length)
      }

      setResults(filteredResults)
    } catch (err) {
      const message = err instanceof Error ? err.message : '検索に失敗しました'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [documents, folders])

  const clearSearch = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return {
    loading,
    error,
    results,
    search,
    clearSearch,
  }
} 