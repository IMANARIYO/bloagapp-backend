import prisma from '../../prisma/client.js'
import { models } from '../models/index.js'

const { Comment, Post, User } = models

// ADD A COMMENT TO A POST
export const addComment = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId)

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        userId: req.user.id,
        postId: postId
      }
    })

    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET ALL COMMENTS FOR ALL POSTS
export const getALLCommentsForALLposts = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: true
      }
    })
    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// GET ALL COMMENTS FOR ONE POST
export const getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId)

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: true
      }
    })

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET A SINGLE COMMENT BY ID
export const getCommentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    res.status(200).json(comment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// UPDATE A COMMENT
export const updateComment = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    if (comment.userId !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: {
        content: req.body.content || comment.content
      }
    })

    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET ALL COMMENTS FOR POSTS OWNED BY LOGGED-IN USER
export const getCommentsForUserPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: req.user.id },
      select: { id: true }
    })

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found for this user' })
    }

    const postIds = posts.map(p => p.id)

    const comments = await prisma.comment.findMany({
      where: {
        postId: { in: postIds }
      },
      include: {
        user: true
      }
    })

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE A COMMENT
export const deleteComment = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    if (comment.userId !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    await prisma.comment.delete({ where: { id } })

    res.status(200).json({ message: 'Comment deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET COMMENTS BY LOGGED-IN USER
export const getCommentsByLoggedInUser = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { userId: req.user.id },
      include: { post: true }
    })

    if (!comments.length) {
      return res
        .status(404)
        .json({ message: 'No comments found for this user' })
    }

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
