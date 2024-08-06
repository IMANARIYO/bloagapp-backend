import cron from "node-cron";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { catchAsync } from "../middlewares/globaleerorshandling.js";
import { models } from "../models/index.js";
import { generateOTP, sendEmail, signupHtmlMessage } from "../utils/index.js";
import { passHashing, tokengenerating } from "../utils/index.js";

const { Comment, Post, User } = models;



// Schedule user deletion
// const scheduleUserDeletion = (userId, signupTime) => {
//   const deletionTime = new Date(signupTime.getTime() + 3 * 60 * 1000); // 3 minutes later
//   const cronExpression = `${deletionTime.getMinutes()} ${deletionTime.getHours()} * * *`;

//   cron.schedule(cronExpression, async () => {
//     try {
//       const user = await models.User.findOne({ where: { id: userId } });
//       if (user && !user.verified) {
//         await models.User.destroy({ where: { id: userId } });
//         console.log(`Deleted unverified user with ID: ${userId}`);
//       }
//     } catch (error) {
//       console.error('Error deleting unverified user:', error.message);
//     }
//   });
// };

// Signup route
export const signup = catchAsync(async (req, res, next) => {
  const existingUser = await models.User.findOne({ where: { email: req.body.email } });
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already in use.' });
  }

  const hashedPassword = await passHashing(req.body.password);
  const newUserDetails = { ...req.body, password: hashedPassword };

  if (req.files && req.files.profilePicture) {
    newUserDetails.profilePicture = `/media/${req.files.profilePicture[0].filename}`;
    console.log('Uploaded file path:', newUserDetails.profilePicture);
  }

  const otpDetails = generateOTP();
  newUserDetails.otp = otpDetails.code;
  newUserDetails.otpExpiresAt = otpDetails.expiresAt;

  const verificationLink = `https://routeeasyapi.onrender.com/auth/verify-email?token=${otpDetails.code}`;
  const newUser = await models.User.create(newUserDetails);

  // Uncomment the line below to send email
  // await sendEmail(newUser.email, "signup", "Thank you for registering with us!", signupHtmlMessage(verificationLink));

  const token = tokengenerating({ id: newUser.id, email: newUser.email, user: newUser });

  res.status(200).json({
    message: 'User registered successfully',
    accesstoken: token,
    userinfomation: {
      email: newUser.email,
      fullnames: newUser.fullNames,
      profilePicture: newUser.profilePicture,
      role: newUser.role
    }
  });

  // scheduleUserDeletion(newUser.id, newUser.createdAt);
});


