import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import type { CreateDocumentRequest, UpdateDocumentRequest, Document, User } from '../../../types'

const documents = new Hono()

// インメモリストレージ（本格的なアプリではデータベースを使用）
const documentsData: Document[] = []
const users: User[] = []

// 認証ミドルウェア
const authenticate = async (c: any) => {
  const sessionId = c.req.header('Cookie')?.match(/sessionId=([^;]+)/)?.[1]
  
  if (!sessionId) {
    return null
  }

  // セッション検証（簡易版）
  const user = users.find(u => u.id === sessionId)
  return user
}

// ドキュメント一覧取得
documents.get('/', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const userDocuments = documentsData.filter(doc => doc.authorId === user.id)
    
    return c.json({
      success: true,
      data: userDocuments
    })
  } catch (error) {
    console.error('Get documents error:', error)
    return c.json({
      success: false,
      error: 'ドキュメントの取得に失敗しました'
    }, 500)
  }
})

// ドキュメント作成
documents.post('/', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const body: CreateDocumentRequest = await c.req.json()
    const { title, parentId, icon, coverImage } = body

    if (!title) {
      return c.json({
        success: false,
        error: 'タイトルは必須です'
      }, 400)
    }

    const newDocument: Document = {
      id: nanoid(),
      title,
      content: '',
      icon,
      coverImage,
      parentId,
      isArchived: false,
      isPublished: false,
      authorId: user.id,
      author: user,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    documentsData.push(newDocument)

    return c.json({
      success: true,
      data: newDocument
    }, 201)
  } catch (error) {
    console.error('Create document error:', error)
    return c.json({
      success: false,
      error: 'ドキュメントの作成に失敗しました'
    }, 500)
  }
})

// ドキュメント取得
documents.get('/:id', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const id = c.req.param('id')
    const document = documentsData.find(doc => doc.id === id && doc.authorId === user.id)

    if (!document) {
      return c.json({
        success: false,
        error: 'ドキュメントが見つかりません'
      }, 404)
    }

    return c.json({
      success: true,
      data: document
    })
  } catch (error) {
    console.error('Get document error:', error)
    return c.json({
      success: false,
      error: 'ドキュメントの取得に失敗しました'
    }, 500)
  }
})

// ドキュメント更新
documents.patch('/:id', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const id = c.req.param('id')
    const documentIndex = documentsData.findIndex(doc => doc.id === id && doc.authorId === user.id)

    if (documentIndex === -1) {
      return c.json({
        success: false,
        error: 'ドキュメントが見つかりません'
      }, 404)
    }

    const body: UpdateDocumentRequest = await c.req.json()
    const { title, content, icon, coverImage, isArchived, isPublished } = body

    const updatedDocument = {
      ...documentsData[documentIndex],
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(icon !== undefined && { icon }),
      ...(coverImage !== undefined && { coverImage }),
      ...(isArchived !== undefined && { isArchived }),
      ...(isPublished !== undefined && { isPublished }),
      updatedAt: new Date()
    }

    documentsData[documentIndex] = updatedDocument

    return c.json({
      success: true,
      data: updatedDocument
    })
  } catch (error) {
    console.error('Update document error:', error)
    return c.json({
      success: false,
      error: 'ドキュメントの更新に失敗しました'
    }, 500)
  }
})

// ドキュメント削除
documents.delete('/:id', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const id = c.req.param('id')
    const documentIndex = documentsData.findIndex(doc => doc.id === id && doc.authorId === user.id)

    if (documentIndex === -1) {
      return c.json({
        success: false,
        error: 'ドキュメントが見つかりません'
      }, 404)
    }

    documentsData.splice(documentIndex, 1)

    return c.json({
      success: true,
      message: 'ドキュメントを削除しました'
    })
  } catch (error) {
    console.error('Delete document error:', error)
    return c.json({
      success: false,
      error: 'ドキュメントの削除に失敗しました'
    }, 500)
  }
})

export { documents as documentRoutes } 