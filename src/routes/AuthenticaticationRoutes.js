import express from "express";
import { isAdmin } from "../middlewares/isadmin.js";
import { uploadMiddleware } from "../middlewares/uploadMiddlewareMulter.js";
import { Authenticate } from "../utils/jwtfunctions.js";

import {
  addAdmin,
  changepassword,
  deleteUserById,
  generateAndSendOTP,
  getAllUsers,
  login,
  removeAdmin,
  signup,

  updateUserById,
  verifyOTPAndUpdatePassword
} from '../authentication/index.js'

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/signup', uploadMiddleware, signup)
authRouter.post('/forget', generateAndSendOTP)
authRouter.post('/reset', verifyOTPAndUpdatePassword)
authRouter.get('/getAllUsers', getAllUsers)
authRouter.use(Authenticate)
authRouter.post('/change', changepassword)
authRouter.delete('/deleteUserById/:id', deleteUserById)
authRouter.patch('/updateUserById/:id', uploadMiddleware, updateUserById)
authRouter.patch('/addadminbyid/:id', isAdmin, addAdmin)
authRouter.patch('/maketheadminasuser/:id', isAdmin, removeAdmin)

authRouter.delete('/deleteuserbyid/:id', isAdmin, deleteUserById)

export default authRouter
