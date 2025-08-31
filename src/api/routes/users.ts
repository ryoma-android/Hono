import { Hono } from 'hono'
import type { User } from '../../../types'

const users = new Hono()

// インメモリストレージ（本格的なアプリではデータベースを使用）
const usersData: User[] = []

// 認証ミドルウェア
const authenticate = async (c: any) => {
  const sessionId = c.req.header('Cookie')?.match(/sessionId=([^;]+)/)?.[1]
  
  if (!sessionId) {
    return null
  }

  // セッション検証（簡易版）
  const user = usersData.find(u => u.id === sessionId)
  return user
}

// ユーザープロフィール取得
users.get('/profile', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    // パスワードは除外
    const { password: _, ...userWithoutPassword } = user

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return c.json({
      success: false,
      error: 'プロフィールの取得に失敗しました'
    }, 500)
  }
})

// ユーザープロフィール更新
users.patch('/profile', async (c) => {
  try {
    const user = await authenticate(c)
    if (!user) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const body = await c.req.json()
    const { name, avatar } = body

    if (name !== undefined) {
      user.name = name
    }
    if (avatar !== undefined) {
      user.avatar = avatar
    }

    user.updatedAt = new Date()

    // パスワードは除外
    const { password: _, ...userWithoutPassword } = user

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return c.json({
      success: false,
      error: 'プロフィールの更新に失敗しました'
    }, 500)
  }
})

export { users as userRoutes } 