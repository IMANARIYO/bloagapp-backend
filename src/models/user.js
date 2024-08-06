import { DataTypes } from "sequelize";
import { sequelize } from "../../config/config.js";

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullNames: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Ensures that email addresses are unique
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue:
        'https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull: true
    },
    otpExpiresAt: {
      type: DataTypes.DATE, // Changed to DATE to handle date and time
      allowNull: true
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
    tableName: 'Users' // Specify the table name
  }
)

// Define associations
User.associate = function (models) {
  User.hasMany(models.Post, { foreignKey: 'authorId', as: 'posts' })
  User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
}
