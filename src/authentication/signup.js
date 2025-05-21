import { catchAsync } from '../middlewares/globaleerorshandling.js'

import { generateOTP } from '../utils/index.js'
import { passHashing, tokengenerating } from '../utils/index.js'
import prisma from '../../prisma/client.js'

export const signup = async (req, res) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: req.body.email
      }
    })

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use.' })
    }

    const hashedPassword = await passHashing(req.body.password)
    const newUserDetails = { ...req.body, password: hashedPassword }

    if (req.files && req.files.profilePicture) {
      newUserDetails.profilePicture = `/media/${req.files.profilePicture[0]
        .filename}`

    }

    const otpDetails = generateOTP()
    newUserDetails.otp = otpDetails.code
    newUserDetails.otpExpiresAt = otpDetails.expiresAt

    const newUser = await prisma.user.create({
      data: newUserDetails
    })

    const token = tokengenerating({
      id: newUser.id,
      email: newUser.email,
      user: newUser
    })

    res.status(200).json({
      message: 'User registered successfully',
      accesstoken: token,
      userinfomation: {
        email: newUser.email,
        fullnames: newUser.fullNames,
        profilePicture: newUser.profilePicture,
        role: newUser.role
      }
    })
  } catch (err) {

    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message })
  }
}
