import { models } from "../models/index.js";
import { sendEmail } from "../utils/emailUtility.js";
import { generateOTP, isOTPValid, passHashing } from "../utils/passwordfunctions.js";

const { Comment, Post, User } = models;


export const generateAndSendOTP = async (req, res) => {
  try {
    console.log('Generating and sending OTP for user:', req.body.email);
    
    const otp = generateOTP().code;
    const expiresAt = generateOTP().expiresAt;
    const userEmail = req.body.email;
    
    const user = await User.findOne({ where: { email: userEmail } }); // Use Sequelize to find the user
    
    if (!user) {
      return res.status(404).json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      });
    }
    
    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    await user.save(); // Save the updated user
    
    await sendEmail(
      user.email,
      'Password OTP Code Reset',
      'Password Resetting!',
      `Use this ${otp} to change your password. It is valid for five minutes and will expire at ${expiresAt}.`
    );
    
    return res.status(200).json({
      message: 'OTP sent successfully! Please check your email and come back with the OTP.'
    });
  } catch (error) {
    console.error('Error generating and sending OTP:', error);
    return res.status(500).json({ message: 'An error occurred while sending the OTP.' });
  }
};

export const verifyOTPAndUpdatePassword = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.findOne({ where: { email: userEmail } }); // Use Sequelize to find the user
    
    if (!user) {
      return res.status(404).json({
        message: `No user with email ${userEmail} found. Please use a correct registered email if you have ever signed up.`
      });
    }
    
    const receivedOTP = req.body.otp;
    const storedOTP = user.otp;
    const validOTP = isOTPValid(storedOTP, receivedOTP, user.otpExpiresAt, res);
    
    if (validOTP) {
      const newPassword = req.body.newpassword;
      console.log('Request to update password for:', req.body.email);
      
      const hashedPassword = await passHashing(newPassword);
      
      user.password = hashedPassword;
      user.otp = null; // Clear OTP
      user.otpExpiresAt = null; // Clear OTP expiration
      await user.save(); // Save the updated user
      
      return res.status(200).json({ message: 'Password updated successfully.' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Error verifying OTP and updating password:', error);
    return res.status(500).json({ message: 'An error occurred while updating the password.' });
  }
};
