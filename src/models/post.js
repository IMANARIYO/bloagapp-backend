import { DataTypes } from "sequelize";
import { sequelize } from "../../config/config.js";

export const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'Posts'
});

// Define associations
Post.associate = function(models) {
  Post.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
}
