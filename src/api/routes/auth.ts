import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import type { LoginRequest, RegisterRequest, User, Session } from '../../../types'

const auth = new Hono()

// インメモリストレージ（本格的なアプリではデータベースを使用）
const users: User[] = []
const sessions: Session[] = []

// ユーザー登録
auth.post('/register', async (c) => {
  try {
    const body: RegisterRequest = await c.req.json()
    const { name, email, password } = body

    // バリデーション
    if (!name || !email || !password) {
      return c.json({
        success: false,
        error: '名前、メール、パスワードは必須です'
      }, 400)
    }

    // 既存ユーザーチェック
    if (users.find(user => user.email === email)) {
      return c.json({
        success: false,
        error: 'このメールアドレスは既に使用されています'
      }, 400)
    }

    // ユーザー作成
    const newUser: User = {
      id: nanoid(),
      name,
      email,
      password: await Bun.password.hash(password), // Bunのパスワードハッシュ
      createdAt: new Date(),
      updatedAt: new Date()
    }

    users.push(newUser)

    // セッション作成
    const session: Session = {
      id: nanoid(),
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24時間
      createdAt: new Date()
    }

    sessions.push(session)

    // レスポンス（パスワードは除外）
    const { password: _, ...userWithoutPassword } = newUser

    c.header('Set-Cookie', `sessionId=${session.id}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}`)

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword,
        session: session
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return c.json({
      success: false,
      error: '登録に失敗しました'
    }, 500)
  }
})

// ログイン
auth.post('/login', async (c) => {
  try {
    const body: LoginRequest = await c.req.json()
    const { email, password } = body

    // バリデーション
    if (!email || !password) {
      return c.json({
        success: false,
        error: 'メールとパスワードは必須です'
      }, 400)
    }

    // ユーザー検索
    const user = users.find(u => u.email === email)
    if (!user) {
      return c.json({
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません'
      }, 400)
    }

    // パスワード検証
    const isValidPassword = await Bun.password.verify(password, user.password)
    if (!isValidPassword) {
      return c.json({
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません'
      }, 400)
    }

    // セッション作成
    const session: Session = {
      id: nanoid(),
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24時間
      createdAt: new Date()
    }

    sessions.push(session)

    // レスポンス（パスワードは除外）
    const { password: _, ...userWithoutPassword } = user

    c.header('Set-Cookie', `sessionId=${session.id}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}`)

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword,
        session: session
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({
      success: false,
      error: 'ログインに失敗しました'
    }, 500)
  }
})

// ログアウト
auth.post('/logout', async (c) => {
  try {
    const sessionId = c.req.header('Cookie')?.match(/sessionId=([^;]+)/)?.[1]
    
    if (sessionId) {
      const sessionIndex = sessions.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions.splice(sessionIndex, 1)
      }
    }

    c.header('Set-Cookie', 'sessionId=; HttpOnly; Path=/; Max-Age=0')

    return c.json({
      success: true,
      message: 'ログアウトしました'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({
      success: false,
      error: 'ログアウトに失敗しました'
    }, 500)
  }
})

// 現在のユーザー取得
auth.get('/me', async (c) => {
  try {
    const sessionId = c.req.header('Cookie')?.match(/sessionId=([^;]+)/)?.[1]
    
    if (!sessionId) {
      return c.json({
        success: false,
        error: '認証が必要です'
      }, 401)
    }

    const session = sessions.find(s => s.id === sessionId)
    if (!session || session.expiresAt < new Date()) {
      // セッションが期限切れの場合は削除
      const sessionIndex = sessions.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions.splice(sessionIndex, 1)
      }
      return c.json({
        success: false,
        error: 'セッションが期限切れです'
      }, 401)
    }

    const user = users.find(u => u.id === session.userId)
    if (!user) {
      return c.json({
        success: false,
        error: 'ユーザーが見つかりません'
      }, 404)
    }

    // レスポンス（パスワードは除外）
    const { password: _, ...userWithoutPassword } = user

    return c.json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('Me error:', error)
    return c.json({
      success: false,
      error: 'ユーザー情報の取得に失敗しました'
    }, 500)
  }
})

export { auth as authRoutes } 