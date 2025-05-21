import { jest } from '@jest/globals'



let signup, prisma, generateOTP, passHashing, tokengenerating

await jest.unstable_mockModule('../prisma/client.js', () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}))

await jest.unstable_mockModule('../src/utils/index.js', () => ({
  generateOTP: jest.fn(),
  passHashing: jest.fn(),
  tokengenerating: jest.fn()
}))

beforeAll(async () => {
  prisma = (await import('../prisma/client.js')).default
  ;({ signup } = await import('../src/authentication/signup.js'))
  ;({ generateOTP, passHashing, tokengenerating } = await import('../src/utils/index.js'))
})

describe('Signup Controller', () => {
  let req
  let res
  let next

  beforeEach(() => {
    jest.clearAllMocks()

    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        fullNames: 'Test User'
      },
      files: {
        profilePicture: [{ filename: 'test-image.jpg' }]
      }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    next = jest.fn()

    passHashing.mockResolvedValue('hashedPassword123')
    generateOTP.mockReturnValue({
      code: '123456',
      expiresAt: new Date('2025-05-22')
    })
    tokengenerating.mockReturnValue('test-token-123')
  })

  test('should return 409 if user already exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@example.com' })

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'Email is already in use.' })
  })

  test('should create a new user with profile picture', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      fullNames: 'Test User',
      profilePicture: '/media/test-image.jpg',
      role: 'user'
    })

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      accesstoken: 'test-token-123',
      userinfomation: expect.objectContaining({
        email: 'test@example.com',
        fullnames: 'Test User',
        profilePicture: '/media/test-image.jpg',
        role: 'user'
      })
    })
  })

  test('should create user without profile picture', async () => {
    req.files = null
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue({
      id: 2,
      email: 'test@example.com',
      fullNames: 'Test User',
      profilePicture: 'default.jpg',
      role: 'user'
    })

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalled()
  })

  test('should handle DB error properly', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockRejectedValue(new Error('DB error'))

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Something went wrong',
      error: expect.any(String)
    }))
  })
})
