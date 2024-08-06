import cron from "node-cron";
import { catchAsync } from "../middlewares/globaleerorshandling.js";
import { User } from "../models/index.js";
import { isOTPValid } from "../utils/passwordfunctions.js";

const tokenExpirationTime = 24 * 60 * 60 * 1000;

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Token is required for email verification.' });
  }

  const user = await User.findOne({ where: { otp: token } }); // Use Sequelize to find the user
  if (!user) {
    return res
      .status(404)
      .json({ message: 'Invalid token. User not found.' });
  }

  const receivedOTP = token;
  const storedOTP = user.otp;
  const validOTP = isOTPValid(storedOTP, receivedOTP, user.otpExpiresAt, res); // Assign the result of isOTPValid to validOTP

  if (validOTP === true) {
    // Mark the user as verified and clear OTP details
    user.verified = true;
    user.otp = null; // Clear OTP
    user.otpExpiresAt = null; // Clear OTP expiration
    await user.save(); // Save the updated user

    return res
      .status(200)
      .json({ message: 'Email verification successful. You can now login.' });
  } else {
    return res
      .status(400)
      .json({ message: 'Invalid or expired OTP.' });
  }
});
