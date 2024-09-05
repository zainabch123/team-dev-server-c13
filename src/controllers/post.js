import { sendDataResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
// ignore

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  const auth = req.headers.authorization

  if (!auth) {
    return res.status(401).json({ error: 'Not authorised' })
  }

  const token = auth.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Not authorised' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.id

    const post = await prisma.post.create({
      data: {
        content: content,
        userId: userId
      }
    })

    return sendDataResponse(res, 201, { post: { id: post.id, content } })
  } catch (e) {
    return res.status(401).json({ error: 'Not authorised' })
  }
}

export const getAll = async (req, res) => {
  return sendDataResponse(res, 200, {
    posts: [
      {
        id: 1,
        content: 'Hello world!',
        author: { ...req.user }
      },
      {
        id: 2,
        content: 'Hello from the void!',
        author: { ...req.user }
      }
    ]
  })
}
