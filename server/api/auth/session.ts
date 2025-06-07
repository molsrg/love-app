import { defineEventHandler, readBody } from 'h3'

interface SessionResponse {
  accessToken: string
  isRegistered: boolean
  user: {
    id: number
    name: string
    avatar: string
  }
}

// POST /api/auth/session
export default defineEventHandler(async (event) => {
  try {
    const { queryString } = await readBody(event)

    // Имитация проверки initData
    if (!queryString) {
      throw createError({
        statusCode: 400,
        message: 'Init data is required',
      })
    }

    // Фейковый ответ
    const response: SessionResponse = {
      accessToken: `fake-jwt-token-${Date.now()}`,
      isRegistered: true,
      user: {
        id: 123456,
        name: 'Test User',
        avatar: 'https://github.com/benjamincanac.png',
      },
    }

    return {
      data: response,
      message: 'Session created successfully',
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to create session',
    })
  }
})
