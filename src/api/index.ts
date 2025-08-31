import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { authRoutes } from './routes/auth'
import { documentRoutes } from './routes/documents'
import { folderRoutes } from './routes/folders'
import { userRoutes } from './routes/users'

const app = new Hono()

// ミドルウェア
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}))
app.use('*', secureHeaders())

// ルート
app.route('/auth', authRoutes)
app.route('/documents', documentRoutes)
app.route('/folders', folderRoutes)
app.route('/users', userRoutes)

// ヘルスチェック
app.get('/', (c) => c.json({ message: 'Notion Clone API' }))

// エラーハンドリング
app.onError((err, c) => {
  console.error('API Error:', err)
  return c.json({ 
    success: false, 
    error: 'Internal Server Error' 
  }, 500)
})

// 404
app.notFound((c) => {
  return c.json({ 
    success: false, 
    error: 'Not Found' 
  }, 404)
})

const port = process.env.PORT || 3001

console.log(`🚀 Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
}) 