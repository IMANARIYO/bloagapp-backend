'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Posts', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    authorId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users', // Reference to the 'Users' table
        key: 'id',
      },
      onDelete: 'CASCADE', // Cascade delete posts if the user is deleted
      allowNull: false,
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING), // Array to store image URLs
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  // Create a comments table for comments related to posts
  await queryInterface.createTable('Comments', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    authorId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users', // Reference to the 'Users' table
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    postId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Posts', // Reference to the 'Posts' table
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  // Drop the Comments table before dropping the Posts table
  await queryInterface.dropTable('Comments');
  await queryInterface.dropTable('Posts');
}
