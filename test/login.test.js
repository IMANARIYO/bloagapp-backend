import { jest } from '@jest/globals'




let login, prisma, passComparer, tokengenerating

await jest.unstable_mockModule('../prisma/client.js', () => ({
  default: {
    user: {
      findUnique: jest.fn()
    }
  }
}))

await jest.unstable_mockModule('../src/utils/index.js', () => ({
  passComparer: jest.fn(),
  tokengenerating: jest.fn()
}))

beforeAll(async () => {
  prisma = (await import('../prisma/client.js')).default
  ;({ login } = await import('../src/authentication/login.js'))
  ;({ passComparer, tokengenerating } = await import('../src/utils/index.js'))
})

describe('Login Controller', () => {
  let req
  let res
  
  beforeEach(() => {
    jest.clearAllMocks()
    
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    }
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    
    tokengenerating.mockReturnValue('test-token-123')
  })
  
  test('should return 404 if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    
    await login(req, res)
    
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'user not found' })
  })
  
  
  test('should return 401 if password is incorrect', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword123'
    })
    passComparer.mockResolvedValue(false)
    
    await login(req, res)
    
    expect(passComparer).toHaveBeenCalledWith('password123', 'hashedPassword123')
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Wrong password' })
  })
  
  test('should login successfully with correct credentials', async () => {
    const mockUser = {
      id: 1,
      fullNames: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword123',
      profilePicture: 'profile.jpg',
      gender: 'Male',
      role: 'user',
      phoneNumber: '1234567890'
    }
    
    prisma.user.findUnique.mockResolvedValue(mockUser)
    passComparer.mockResolvedValue(true)
    
    await login(req, res)
    
    expect(passComparer).toHaveBeenCalledWith('password123', 'hashedPassword123')
    expect(tokengenerating).toHaveBeenCalledWith({
      user: mockUser,
      id: mockUser.id,
      email: mockUser.email
    })
    
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'user logged in succeful',
      access_token: 'test-token-123',
      user: {
        id: mockUser.id,
        fullNames: mockUser.fullNames,
        username: mockUser.username,
        email: mockUser.email,
        profilePicture: mockUser.profilePicture,
        gender: mockUser.gender,
        role: mockUser.role,
        phoneNumber: mockUser.phoneNumber
      }
    })
  })
  
  test('should handle errors properly', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB error'))
    
    await login(req, res)
    
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ error: 'DB error' })
  })
})