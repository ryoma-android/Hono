import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import type { CreateFolderRequest, UpdateFolderRequest, Folder, User } from '../../../types'

const folders = new Hono()

// インメモリストレージ（本格的なアプリではデータベースを使用）
const foldersData: Folder[] = []
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

// フォルダ一覧取得
folders.get('/', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const userFolders = foldersData.filter(folder => folder.authorId === user.id)
    
    return c.json({
      success: true,
      data: userFolders
    })
  } catch (error) {
    console.error('Get folders error:', error)
    return c.json({
      success: false,
      error: 'フォルダの取得に失敗しました'
    }, 500)
  }
})

// フォルダ作成
folders.post('/', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const body: CreateFolderRequest = await c.req.json()
    const { title, parentId, icon } = body

    if (!title) {
      return c.json({
        success: false,
        error: 'タイトルは必須です'
      }, 400)
    }

    const newFolder: Folder = {
      id: nanoid(),
      title,
      icon,
      parentId,
      isArchived: false,
      authorId: user.id,
      author: user,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    foldersData.push(newFolder)

    return c.json({
      success: true,
      data: newFolder
    }, 201)
  } catch (error) {
    console.error('Create folder error:', error)
    return c.json({
      success: false,
      error: 'フォルダの作成に失敗しました'
    }, 500)
  }
})

// フォルダ取得
folders.get('/:id', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const id = c.req.param('id')
    const folder = foldersData.find(f => f.id === id && f.authorId === user.id)

    if (!folder) {
      return c.json({
        success: false,
        error: 'フォルダが見つかりません'
      }, 404)
    }

    return c.json({
      success: true,
      data: folder
    })
  } catch (error) {
    console.error('Get folder error:', error)
    return c.json({
      success: false,
      error: 'フォルダの取得に失敗しました'
    }, 500)
  }
})

// フォルダ更新
folders.patch('/:id', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const id = c.req.param('id')
    const folderIndex = foldersData.findIndex(f => f.id === id && f.authorId === user.id)

    if (folderIndex === -1) {
      return c.json({
        success: false,
        error: 'フォルダが見つかりません'
      }, 404)
    }

    const body: UpdateFolderRequest = await c.req.json()
    const { title, icon, isArchived } = body

    const updatedFolder = {
      ...foldersData[folderIndex],
      ...(title !== undefined && { title }),
      ...(icon !== undefined && { icon }),
      ...(isArchived !== undefined && { isArchived }),
      updatedAt: new Date()
    }

    foldersData[folderIndex] = updatedFolder

    return c.json({
      success: true,
      data: updatedFolder
    })
  } catch (error) {
    console.error('Update folder error:', error)
    return c.json({
      success: false,
      error: 'フォルダの更新に失敗しました'
    }, 500)
  }
})

// フォルダ削除
folders.delete('/:id', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const id = c.req.param('id')
    const folderIndex = foldersData.findIndex(f => f.id === id && f.authorId === user.id)

    if (folderIndex === -1) {
      return c.json({
        success: false,
        error: 'フォルダが見つかりません'
      }, 404)
    }

    foldersData.splice(folderIndex, 1)

    return c.json({
      success: true,
      message: 'フォルダを削除しました'
    })
  } catch (error) {
    console.error('Delete folder error:', error)
    return c.json({
      success: false,
      error: 'フォルダの削除に失敗しました'
    }, 500)
  }
})

export { folders as folderRoutes } 