import { DataTypes } from "sequelize";
import { sequelize } from "../../config/config.js";

export const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Posts',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'Comments'
});

// Define associations
Comment.associate = function(models) {
  Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
}
