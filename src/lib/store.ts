import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Document, Folder } from '@/types'

interface AppState {
  user: User | null
  documents: Document[]
  folders: Folder[]
  currentDocument: Document | null
  sidebarOpen: boolean
  setUser: (user: User | null) => void
  setDocuments: (documents: Document[]) => void
  setFolders: (folders: Folder[]) => void
  addDocument: (document: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  addFolder: (folder: Folder) => void
  updateFolder: (id: string, updates: Partial<Folder>) => void
  deleteFolder: (id: string) => void
  setCurrentDocument: (document: Document | null) => void
  setSidebarOpen: (open: boolean) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      documents: [],
      folders: [],
      currentDocument: null,
      sidebarOpen: true,
      
      setUser: (user) => set({ user }),
      
      setDocuments: (documents) => set({ documents }),
      
      setFolders: (folders) => set({ folders }),
      
      addDocument: (document) => 
        set((state) => ({ 
          documents: [...state.documents, document] 
        })),
      
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
          currentDocument: state.currentDocument?.id === id
            ? { ...state.currentDocument, ...updates }
            : state.currentDocument
        })),
      
      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
          currentDocument: state.currentDocument?.id === id
            ? null
            : state.currentDocument
        })),
      
      addFolder: (folder) =>
        set((state) => ({ 
          folders: [...state.folders, folder] 
        })),
      
      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          )
        })),
      
      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id)
        })),
      
      setCurrentDocument: (document) => set({ currentDocument: document }),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      logout: () => set({
        user: null,
        documents: [],
        folders: [],
        currentDocument: null
      })
    }),
    {
      name: 'notion-clone-storage',
      partialize: (state) => ({
        user: state.user,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
) 