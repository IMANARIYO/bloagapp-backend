import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../../prisma/client.js"; // your Prisma client instance

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
        comments: true,
      },
    });

    if (!users.length) {
      return res.status(404).json({ success: false, error: "No users found" });
    }

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("the error is", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            comments: true,
          },
        },
        comments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE USER
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE USER
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

  if (req.files?.profilePicture) {
    const file = req.files.profilePicture[0];
    updateData.profilePicture = `/media/${file.filename}`;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ADD ADMIN ROLE
export const addAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: "admin" },
    });

    res.status(200).json({
      success: true,
      message: "User is now an admin",
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// REMOVE ADMIN ROLE
export const removeAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: "user" },
    });

    res.status(200).json({
      success: true,
      message: "User is now a regular user",
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
