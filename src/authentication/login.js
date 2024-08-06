import { models } from "../models/index.js";
import { passComparer, tokengenerating } from "../utils/index.js";

const { Comment, Post, User } = models;

export const login = async (req, res) => {
  try {
  
    const user = await User.findOne({ where: { email: req.body.email } });
    // let user = await User.findOne({ email: req.body.email }).select('+password');
    if (user) {
      let istruepassword = await passComparer(req.body.password, user.password)
      if (istruepassword) {
        let token = tokengenerating({
          user: user,
          id: user.id,
          email: user.email
        })
        const userResponse = {
          id: user.id,
          fullNames: user.fullNames,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          gender: user.gender,
          role: user.role,
          phoneNumber: user.phoneNumber
        }
        res.status(200).json({
          message: 'user logged in succeful',
          access_token: token,
          user: userResponse
        })
      } else if (!istruepassword) {
        return res.status(401).json({ message: 'Wrong password' })
      }
    } else if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }
  } catch (err) {
    return res.status(409).json({ error: err.message })
  }
}
