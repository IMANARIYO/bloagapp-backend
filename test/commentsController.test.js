import { jest } from '@jest/globals'

let addComment, getALLCommentsForALLposts, getComments, getCommentById, updateComment, getCommentsForUserPosts, deleteComment, getCommentsByLoggedInUser, prisma

await jest.unstable_mockModule('../src/models/index.js', () => ({
  models: {
    Comment: {},
    Post: {},
    User: {}
  }
}))

await jest.unstable_mockModule('../prisma/client.js', () => ({
  default: {
    post: {
      findUnique: jest.fn(),
      findMany: jest.fn()
    },
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}))

beforeAll(async () => {
  prisma = (await import('../prisma/client.js')).default
  ;({ 
    addComment,
    getALLCommentsForALLposts,
    getComments,
    getCommentById,
    updateComment,
    getCommentsForUserPosts,
    deleteComment,
    getCommentsByLoggedInUser
  } = await import('../src/controllers/commentController.js')) 
})

describe('Comment CRUD Controller', () => {
  let req
  let res

  beforeEach(() => {
    jest.clearAllMocks()

    req = {
      params: {},
      body: {},
      user: {
        id: 1,
        fullNames: 'Test User'
      }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  describe('addComment', () => {
    beforeEach(() => {
      req.params = { postId: '1' }
      req.body = { content: 'This is a test comment' }
    })

    test('should add comment successfully', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post'
      }

      const mockComment = {
        id: 1,
        content: 'This is a test comment',
        userId: 1,
        postId: 1
      }

      prisma.post.findUnique.mockResolvedValue(mockPost)
      prisma.comment.create.mockResolvedValue(mockComment)

      await addComment(req, res)

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'This is a test comment',
          userId: 1,
          postId: 1
        }
      })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockComment)
    })

    test('should return 404 when post not found', async () => {
      prisma.post.findUnique.mockResolvedValue(null)

      await addComment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' })
    })

    test('should handle database errors', async () => {
      prisma.post.findUnique.mockRejectedValue(new Error('Database error'))

      await addComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })

  describe('getALLCommentsForALLposts', () => {
    test('should get all comments for all posts successfully', async () => {
      const mockComments = [
        {
          id: 1,
          content: 'Comment 1',
          userId: 1,
          postId: 1,
          user: { id: 1, fullNames: 'User 1' }
        },
        {
          id: 2,
          content: 'Comment 2',
          userId: 2,
          postId: 2,
          user: { id: 2, fullNames: 'User 2' }
        }
      ]

      prisma.comment.findMany.mockResolvedValue(mockComments)

      await getALLCommentsForALLposts(req, res)

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        include: {
          user: true
        }
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockComments)
    })

    test('should handle database errors', async () => {
      prisma.comment.findMany.mockRejectedValue(new Error('Database error'))

      await getALLCommentsForALLposts(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })

  describe('getComments', () => {
    beforeEach(() => {
      req.params = { postId: '1' }
    })

    test('should get comments for specific post successfully', async () => {
      const mockComments = [
        {
          id: 1,
          content: 'Comment for post 1',
          userId: 1,
          postId: 1,
          user: { id: 1, fullNames: 'User 1' }
        },
        {
          id: 2,
          content: 'Another comment for post 1',
          userId: 2,
          postId: 1,
          user: { id: 2, fullNames: 'User 2' }
        }
      ]

      prisma.comment.findMany.mockResolvedValue(mockComments)

      await getComments(req, res)

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 1 },
        include: {
          user: true
        }
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockComments)
    })

    test('should handle database errors', async () => {
      prisma.comment.findMany.mockRejectedValue(new Error('Database error'))

      await getComments(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })

  describe('getCommentById', () => {
    beforeEach(() => {
      req.params = { id: '1' }
    })

    test('should get comment by id successfully', async () => {
      const mockComment = {
        id: 1,
        content: 'Test comment',
        userId: 1,
        postId: 1,
        user: { id: 1, fullNames: 'Test User' }
      }

      prisma.comment.findUnique.mockResolvedValue(mockComment)

      await getCommentById(req, res)

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true }
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockComment)
    })

    test('should return 404 when comment not found', async () => {
      prisma.comment.findUnique.mockResolvedValue(null)

      await getCommentById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment not found' })
    })

    test('should handle database errors', async () => {
      prisma.comment.findUnique.mockRejectedValue(new Error('Database error'))

      await getCommentById(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })

  describe('updateComment', () => {
    beforeEach(() => {
      req.params = { id: '1' }
      req.body = { content: 'Updated comment content' }
    })

    test('should update comment successfully by owner', async () => {
      const existingComment = {
        id: 1,
        content: 'Original content',
        userId: 1,
        postId: 1
      }

      const updatedComment = {
        id: 1,
        content: 'Updated comment content',
        userId: 1,
        postId: 1
      }

      prisma.comment.findUnique.mockResolvedValue(existingComment)
      prisma.comment.update.mockResolvedValue(updatedComment)

      await updateComment(req, res)

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })
      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          content: 'Updated comment content'
        }
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(updatedComment)
    })

    test('should use existing content when no new content provided', async () => {
      req.body = {}

      const existingComment = {
        id: 1,
        content: 'Original content',
        userId: 1,
        postId: 1
      }

      prisma.comment.findUnique.mockResolvedValue(existingComment)
      prisma.comment.update.mockResolvedValue(existingComment)

      await updateComment(req, res)

      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          content: 'Original content'
        }
      })
    })

    test('should return 404 when comment not found', async () => {
      prisma.comment.findUnique.mockResolvedValue(null)

      await updateComment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment not found' })
    })

    test('should return 401 when user is not authorized', async () => {
      const existingComment = {
        id: 1,
        content: 'Original content',
        userId: 2, // Different from current user (id: 1)
        postId: 1
      }

      prisma.comment.findUnique.mockResolvedValue(existingComment)

      await updateComment(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
    })

    test('should handle database errors', async () => {
      prisma.comment.findUnique.mockRejectedValue(new Error('Database error'))

      await updateComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })

  describe('getCommentsForUserPosts', () => {
    test('should get comments for user posts successfully', async () => {
      const mockPosts = [
        { id: 1 },
        { id: 2 }
      ]

      const mockComments = [
        {
          id: 1,
          content: 'Comment on user post 1',
          userId: 2,
          postId: 1,
          user: { id: 2, fullNames: 'Commenter 1' }
        },
        {
          id: 2,
          content: 'Comment on user post 2',
          userId: 3,
          postId: 2,
          user: { id: 3, fullNames: 'Commenter 2' }
        }
      ]

      prisma.post.findMany.mockResolvedValue(mockPosts)
      prisma.comment.findMany.mockResolvedValue(mockComments)

      await getCommentsForUserPosts(req, res)

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { authorId: 1 },
        select: { id: true }
      })
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          postId: { in: [1, 2] }
        },
        include: {
          user: true
        }
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockComments)
    })

    test('should return 404 when user has no posts', async () => {
      prisma.post.findMany.mockResolvedValue([])

      await getCommentsForUserPosts(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'No posts found for this user' })
    })

    test('should handle database errors', async () => {
      prisma.post.findMany.mockRejectedValue(new Error('Database error'))

      await getCommentsForUserPosts(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })

  describe('deleteComment', () => {
    beforeEach(() => {
      req.params = { id: '1' }
    })

    test('should delete comment successfully by owner', async () => {
      const existingComment = {
        id: 1,
        content: 'Comment to delete',
        userId: 1,
        postId: 1
      }

      prisma.comment.findUnique.mockResolvedValue(existingComment)
      prisma.comment.delete.mockResolvedValue({})

      await deleteComment(req, res)

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      })
      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment deleted' })
    })

    test('should return 404 when comment not found', async () => {
      prisma.comment.findUnique.mockResolvedValue(null)

      await deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment not found' })
    })

    test('should return 401 when user is not authorized', async () => {
      const existingComment = {
        id: 1,
        content: 'Comment to delete',
        userId: 2, // Different from current user (id: 1)
        postId: 1
      }

      prisma.comment.findUnique.mockResolvedValue(existingComment)

      await deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
    })

    test('should handle database errors', async () => {
      prisma.comment.findUnique.mockRejectedValue(new Error('Database error'))

      await deleteComment(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })

  describe('getCommentsByLoggedInUser', () => {
    test('should get comments by logged in user successfully', async () => {
      const mockComments = [
        {
          id: 1,
          content: 'User comment 1',
          userId: 1,
          postId: 1,
          post: { id: 1, title: 'Post 1' }
        },
        {
          id: 2,
          content: 'User comment 2',
          userId: 1,
          postId: 2,
          post: { id: 2, title: 'Post 2' }
        }
      ]

      prisma.comment.findMany.mockResolvedValue(mockComments)

      await getCommentsByLoggedInUser(req, res)

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { post: true }
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockComments)
    })

    test('should return 404 when user has no comments', async () => {
      prisma.comment.findMany.mockResolvedValue([])

      await getCommentsByLoggedInUser(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'No comments found for this user' })
    })

    test('should handle database errors', async () => {
      prisma.comment.findMany.mockRejectedValue(new Error('Database error'))

      await getCommentsByLoggedInUser(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
    })
  })
})