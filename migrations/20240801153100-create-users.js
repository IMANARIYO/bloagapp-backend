'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fullNames: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: Sequelize.STRING,
      defaultValue: 'https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user',
      allowNull: true,
    },
    otpExpiresAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    otp: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    phoneNumber: {
      type: Sequelize.STRING,
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
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users');
}
