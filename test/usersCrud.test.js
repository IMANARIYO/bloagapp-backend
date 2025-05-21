import { jest } from '@jest/globals'

let getAllUsers, getUserById, deleteUserById, updateUserById, addAdmin, removeAdmin, prisma

await jest.unstable_mockModule('../prisma/client.js', () => ({
  default: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn()
    }
  }
}))

beforeAll(async () => {
  prisma = (await import('../prisma/client.js')).default
  ;({ 
    getAllUsers, 
    getUserById, 
    deleteUserById, 
    updateUserById, 
    addAdmin, 
    removeAdmin 
  } = await import('../src/authentication/usersCrud.js')) 
})
describe('User CRUD Controller', () => {
  let req
  let res

  beforeEach(() => {
    jest.clearAllMocks()

    req = {
      params: {},
      body: {},
      files: null
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  describe('getAllUsers', () => {
    test('should return all users successfully', async () => {
      const mockUsers = [
        {
          id: '1',
          fullNames: 'User One',
          email: 'user1@example.com',
          posts: [
            {
              id: 'post1',
              title: 'Test Post',
              comments: [
                { id: 'comment1', content: 'Test comment' }
              ]
            }
          ],
          comments: [
            { id: 'comment2', content: 'User comment' }
          ]
        },
        {
          id: '2',
          fullNames: 'User Two',
          email: 'user2@example.com',
          posts: [],
          comments: []
        }
      ]

      prisma.user.findMany.mockResolvedValue(mockUsers)

      await getAllUsers(req, res)

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        include: {
          posts: {
            include: {
              comments: true,
            },
          },
          comments: true,
        },
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Users retrieved successfully",
        data: mockUsers,
      })
    })

    test('should return 404 when no users found', async () => {
      prisma.user.findMany.mockResolvedValue([])

      await getAllUsers(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "No users found" 
      })
    })

    test('should handle database errors', async () => {
      prisma.user.findMany.mockRejectedValue(new Error('Database error'))

      await getAllUsers(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "Internal Server Error" 
      })
    })
  })

  describe('getUserById', () => {
    beforeEach(() => {
      req.params = { id: 'user123' }
    })

    test('should return user by id successfully', async () => {
      const mockUser = {
        id: 'user123',
        fullNames: 'Test User',
        email: 'test@example.com',
        posts: [
          {
            id: 'post1',
            title: 'Test Post',
            comments: []
          }
        ],
        comments: []
      }

      prisma.user.findUnique.mockResolvedValue(mockUser)

      await getUserById(req, res)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user123' },
        include: {
          posts: {
            include: {
              comments: true,
            },
          },
          comments: true,
        },
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User retrieved successfully",
        data: mockUser,
      })
    })

    test('should return 404 when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await getUserById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "User not found" 
      })
    })

    test('should handle database errors', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      await getUserById(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "Internal Server Error" 
      })
    })
  })

  describe('deleteUserById', () => {
    beforeEach(() => {
      req.params = { id: 'user123' }
    })

    test('should delete user successfully', async () => {
      prisma.user.delete.mockResolvedValue({})

      await deleteUserById(req, res)

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user123' },
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ 
        success: true, 
        message: "User deleted successfully" 
      })
    })

    test('should return 404 when user not found for deletion', async () => {
      const error = new Error('Record not found')
      error.code = 'P2025'
      prisma.user.delete.mockRejectedValue(error)

      await deleteUserById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "User not found" 
      })
    })

    test('should handle other database errors', async () => {
      prisma.user.delete.mockRejectedValue(new Error('Database error'))

      await deleteUserById(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "Internal Server Error" 
      })
    })
  })

  describe('updateUserById', () => {
    beforeEach(() => {
      req.params = { id: 'user123' }
      req.body = { 
        fullNames: 'Updated Name',
        email: 'updated@example.com'
      }
    })

    test('should update user successfully without profile picture', async () => {
      const mockUpdatedUser = {
        id: 'user123',
        fullNames: 'Updated Name',
        email: 'updated@example.com'
      }

      prisma.user.update.mockResolvedValue(mockUpdatedUser)

      await updateUserById(req, res)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: {
          fullNames: 'Updated Name',
          email: 'updated@example.com'
        },
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User updated successfully",
        data: mockUpdatedUser,
      })
    })

    test('should update user with profile picture', async () => {
      req.files = {
        profilePicture: [{ filename: 'new-profile.jpg' }]
      }

      const mockUpdatedUser = {
        id: 'user123',
        fullNames: 'Updated Name',
        email: 'updated@example.com',
        profilePicture: '/media/new-profile.jpg'
      }

      prisma.user.update.mockResolvedValue(mockUpdatedUser)

      await updateUserById(req, res)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: {
          fullNames: 'Updated Name',
          email: 'updated@example.com',
          profilePicture: '/media/new-profile.jpg'
        },
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User updated successfully",
        data: mockUpdatedUser,
      })
    })

    test('should return 404 when user not found for update', async () => {
      const error = new Error('Record not found')
      error.code = 'P2025'
      prisma.user.update.mockRejectedValue(error)

      await updateUserById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "User not found" 
      })
    })

    test('should handle other database errors', async () => {
      prisma.user.update.mockRejectedValue(new Error('Database error'))

      await updateUserById(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "Internal Server Error" 
      })
    })
  })

  describe('addAdmin', () => {
    beforeEach(() => {
      req.params = { id: 'user123' }
    })

    test('should add admin role successfully', async () => {
      const mockUpdatedUser = {
        id: 'user123',
        fullNames: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      }

      prisma.user.update.mockResolvedValue(mockUpdatedUser)

      await addAdmin(req, res)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { role: "admin" },
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User is now an admin",
        data: mockUpdatedUser,
      })
    })

    test('should return 404 when user not found', async () => {
      const error = new Error('Record not found')
      error.code = 'P2025'
      prisma.user.update.mockRejectedValue(error)

      await addAdmin(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "User not found" 
      })
    })

    test('should handle database errors', async () => {
      prisma.user.update.mockRejectedValue(new Error('Database error'))

      await addAdmin(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "Internal Server Error" 
      })
    })
  })

  describe('removeAdmin', () => {
    beforeEach(() => {
      req.params = { id: 'user123' }
    })

    test('should remove admin role successfully', async () => {
      const mockUpdatedUser = {
        id: 'user123',
        fullNames: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }

      prisma.user.update.mockResolvedValue(mockUpdatedUser)

      await removeAdmin(req, res)

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { role: "user" },
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User is now a regular user",
        data: mockUpdatedUser,
      })
    })

    test('should return 404 when user not found', async () => {
      const error = new Error('Record not found')
      error.code = 'P2025'
      prisma.user.update.mockRejectedValue(error)

      await removeAdmin(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "User not found" 
      })
    })

    test('should handle database errors', async () => {
      prisma.user.update.mockRejectedValue(new Error('Database error'))

      await removeAdmin(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ 
        success: false, 
        error: "Internal Server Error" 
      })
    })
  })
})