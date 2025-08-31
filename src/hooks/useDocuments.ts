import { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import type { CreateDocumentRequest, UpdateDocumentRequest, Document } from '@/types'

export function useDocuments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { 
    documents, 
    setDocuments, 
    addDocument: addDocumentStore, 
    updateDocument: updateDocumentStore,
    deleteDocument: deleteDocumentStore 
  } = useAppStore()

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/documents')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'ドキュメントの取得に失敗しました')
      }

      setDocuments(data.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ドキュメントの取得に失敗しました'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [setDocuments])

  const createDocument = useCallback(async (documentData: CreateDocumentRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'ドキュメントの作成に失敗しました')
      }

      addDocumentStore(data.data)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ドキュメントの作成に失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [addDocumentStore])

  const updateDocument = useCallback(async (id: string, updates: UpdateDocumentRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'ドキュメントの更新に失敗しました')
      }

      updateDocumentStore(id, updates)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ドキュメントの更新に失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [updateDocumentStore])

  const deleteDocument = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'ドキュメントの削除に失敗しました')
      }

      deleteDocumentStore(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ドキュメントの削除に失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [deleteDocumentStore])

  const getDocumentById = useCallback((id: string) => {
    return documents.find(doc => doc.id === id)
  }, [documents])

  const getDocumentsByParentId = useCallback((parentId: string | null) => {
    return documents.filter(doc => doc.parentId === parentId)
  }, [documents])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    getDocumentsByParentId,
  }
} 