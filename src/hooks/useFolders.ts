import { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import type { CreateFolderRequest, UpdateFolderRequest, Folder } from '@/types'

export function useFolders() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { 
    folders, 
    setFolders, 
    addFolder: addFolderStore, 
    updateFolder: updateFolderStore,
    deleteFolder: deleteFolderStore 
  } = useAppStore()

  const fetchFolders = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/folders')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'フォルダの取得に失敗しました')
      }

      setFolders(data.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'フォルダの取得に失敗しました'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [setFolders])

  const createFolder = useCallback(async (folderData: CreateFolderRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'フォルダの作成に失敗しました')
      }

      addFolderStore(data.data)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'フォルダの作成に失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [addFolderStore])

  const updateFolder = useCallback(async (id: string, updates: UpdateFolderRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'フォルダの更新に失敗しました')
      }

      updateFolderStore(id, updates)
      return data.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'フォルダの更新に失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [updateFolderStore])

  const deleteFolder = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'フォルダの削除に失敗しました')
      }

      deleteFolderStore(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'フォルダの削除に失敗しました'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [deleteFolderStore])

  const getFolderById = useCallback((id: string) => {
    return folders.find(folder => folder.id === id)
  }, [folders])

  
  const getFoldersByParentId = useCallback((parentId: string | null) => {
    return folders.filter(folder => folder.parentId === parentId)
  }, [folders])

  const getRootFolders = useCallback(() => {
    return folders.filter(folder => !folder.parentId)
  }, [folders])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  return {
    folders,
    loading,
    error,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolderById,
    getFoldersByParentId,
    getRootFolders,
  }
} 