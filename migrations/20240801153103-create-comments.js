'use strict';

export async function up(queryInterface, Sequelize) {
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
    postId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Posts', // Reference to the 'Posts' table
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    authorId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users', // Reference to the 'Users' table
        key: 'id',
      },
      onDelete: 'SET NULL', // Set authorId to null if the user is deleted
      allowNull: true, // Allow null if onDelete is SET NULL
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
  await queryInterface.dropTable('Comments');
}
