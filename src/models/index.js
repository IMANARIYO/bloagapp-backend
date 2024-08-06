import { sequelize } from "../../config/config.js";
import { Comment } from "./comment.js";
import { Post } from "./post.js";
import { User } from "./user.js";

// Initialize models
const models = {
  User,
  Post,
  Comment
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

export { sequelize, models };
