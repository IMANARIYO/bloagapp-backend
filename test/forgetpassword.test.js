import { jest } from '@jest/globals'


let prisma, generateAndSendOTP, verifyOTPAndUpdatePassword, sendEmail, generateOTP, isOTPValid, passHashing

await jest.unstable_mockModule('../prisma/client.js', () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}))

await jest.unstable_mockModule('../src/utils/emailUtility.js', () => ({
  sendEmail: jest.fn()
}))

await jest.unstable_mockModule('../src/utils/passwordfunctions.js', () => ({
  generateOTP: jest.fn(),
  isOTPValid: jest.fn(),
  passHashing: jest.fn()
}))

beforeAll(async () => {
  prisma = (await import('../prisma/client.js')).default
  ;({ generateAndSendOTP, verifyOTPAndUpdatePassword } = await import('../src/authentication/forgetpassword.js'))
  ;({ sendEmail } = await import('../src/utils/emailUtility.js'))
  ;({ generateOTP, isOTPValid, passHashing } = await import('../src/utils/passwordfunctions.js'))
})

describe('OTP & Password Reset Controller', () => {
  let req, res

  beforeEach(() => {
    jest.clearAllMocks()

    req = {
      body: {
        email: 'test@example.com',
        otp: '123456',
        newpassword: 'newPassword123'
      }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  // ---- generateAndSendOTP ----


  test('generateAndSendOTP: should update user OTP and send email', async () => {
    const mockUser = { id: 1, email: req.body.email }
    prisma.user.findUnique.mockResolvedValue(mockUser)
    generateOTP.mockReturnValue({ code: '123456', expiresAt: new Date('2025-12-31') })

    await generateAndSendOTP(req, res)

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: req.body.email },
      data: expect.objectContaining({ otp: '123456' })
    })

    expect(sendEmail).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('OTP sent'), otp: '123456' })
    )
  })

  // ---- verifyOTPAndUpdatePassword ----

  test('verifyOTPAndUpdatePassword: should return 404 if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null)

    await verifyOTPAndUpdatePassword(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: `No user with email ${req.body.email} found. Please use a correct registered email if you have ever signed up.`
    })
  })

  test('verifyOTPAndUpdatePassword: should return 400 if OTP is invalid', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: req.body.email,
      otp: '123456',
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000) // valid
    })

    isOTPValid.mockReturnValue(false)

    await verifyOTPAndUpdatePassword(req, res)

    expect(isOTPValid).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid OTP.' })
  })

  test('verifyOTPAndUpdatePassword: should update password when OTP is valid', async () => {
    const mockUser = {
      id: 1,
      email: req.body.email,
      otp: '123456',
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }

    prisma.user.findUnique.mockResolvedValue(mockUser)
    isOTPValid.mockReturnValue(true)
    passHashing.mockResolvedValue('hashedNewPassword')

    await verifyOTPAndUpdatePassword(req, res)

    expect(passHashing).toHaveBeenCalledWith('newPassword123')

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: req.body.email },
      data: {
        password: 'hashedNewPassword',
        otp: null,
        otpExpiresAt: null
      }
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully.' })
  })

  test('generateAndSendOTP: should handle errors', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB Error'))

    await generateAndSendOTP(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'An error occurred while sending the OTP.' })
  })

  test('verifyOTPAndUpdatePassword: should handle errors', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB Error'))

    await verifyOTPAndUpdatePassword(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'An error occurred while updating the password.' })
  })
})
