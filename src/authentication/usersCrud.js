import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { models } from "../models/index.js";

const{Comment, Post, User} = models;
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Post,
          as: 'posts',
          include: [{ model: Comment, as: 'comments' }]
        },
        {
          model: Comment,
          as: 'comments'
        }
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'No users found' });
    }

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.log("the error is ",error.message)
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Post,
          as: 'posts',
          include: [{ model: Comment, as: 'comments' }]
        },
        {
          model: Comment,
          as: 'comments'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.destroy({ where: { id } });
    if (!result) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  let newObject = { ...req.body };

  if (req.files && req.files.profilePicture) {
    const file = req.files.profilePicture[0];
    newObject.profilePicture = `/media/${file.filename}`;
  }

  try {
    const result = await User.update(newObject, {
      where: { id },
      returning: true,
      plain: true
    });

    if (!result[1]) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result[1]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const addAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully and is now an admin',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const removeAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.role = 'user';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully and is now a regular user',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
