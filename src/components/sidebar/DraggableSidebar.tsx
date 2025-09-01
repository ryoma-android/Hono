'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Folder, 
  FileText, 
  Star, 
  MoreVertical, 
  Plus,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Document, Folder as FolderType } from '@/types'

interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
}

function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
        isDragging && 'opacity-50',
        className
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

interface DraggableSidebarProps {
  className?: string
  onItemClick?: (item: Document | FolderType) => void
  onNewDocument?: () => void
  onNewFolder?: () => void
}

export function DraggableSidebar({ 
  className, 
  onItemClick, 
  onNewDocument, 
  onNewFolder 
}: DraggableSidebarProps) {
  const { documents, folders, setDocuments, setFolders } = useAppStore()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = documents.findIndex(doc => doc.id === active.id)
      const newIndex = documents.findIndex(doc => doc.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newDocuments = arrayMove(documents, oldIndex, newIndex)
        setDocuments(newDocuments)
      }
    }
  }

  const rootDocuments = documents.filter(doc => !doc.parentId)
  const rootFolders = folders.filter(folder => !folder.parentId)

  return (
    <div className={cn('w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700', className)}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">ナビゲーション</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewDocument}
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewFolder}
              className="h-8 w-8"
            >
              <Folder className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rootDocuments.map(doc => doc.id)}
            strategy={verticalListSortingStrategy}
          >
            {/* お気に入り */}
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-500">
                <Star className="w-4 h-4" />
                お気に入り
              </div>
              {documents.filter(doc => doc.isFavorite).map((doc) => (
                <SortableItem key={doc.id} id={doc.id}>
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="flex-1 text-sm truncate">{doc.title}</span>
                  {doc.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                </SortableItem>
              ))}
            </div>

            {/* フォルダ */}
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-500">
                <Folder className="w-4 h-4" />
                フォルダ
              </div>
              {rootFolders.map((folder) => (
                <div key={folder.id}>
                  <div
                    className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {expandedFolders.has(folder.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <Folder className="w-4 h-4 text-yellow-500" />
                    <span className="flex-1 text-sm truncate">{folder.title}</span>
                    {folder.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  </div>
                  
                  {expandedFolders.has(folder.id) && (
                    <div className="ml-6">
                      {documents
                        .filter(doc => doc.parentId === folder.id)
                        .map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => onItemClick?.(doc)}
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="flex-1 text-sm truncate">{doc.title}</span>
                            {doc.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ドキュメント */}
            <div>
              <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-500">
                <FileText className="w-4 h-4" />
                ドキュメント
              </div>
              {rootDocuments.map((doc) => (
                <SortableItem 
                  key={doc.id} 
                  id={doc.id}
                  onClick={() => onItemClick?.(doc)}
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="flex-1 text-sm truncate">{doc.title}</span>
                  {doc.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
} 