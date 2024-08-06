import { seedDatabase } from "../src/controllers/seederController.js";
import { sequelize } from "./config.js";

// Define an asynchronous function to synchronize the database
export const syncDB = async (req, res) => {
  try {
    // Sync models to the database. `{ force: true }` drops existing tables and recreates them.
    await sequelize.sync({ force: true });
    // await sequelize.sync({ alter: true })
    // Use { alter: true } to avoid dropping tables

    // Log a success message to the console if synchronization is successful
    console.log('Database synced!')
    // Retrieve table names
    const tables = await sequelize.getQueryInterface().showAllTables()
    // Retrieve column information for each table
    const tableDetails = {}
    for (const table of tables) {
      const columns = await sequelize.getQueryInterface().describeTable(table)
      tableDetails[table] = columns
    }
    res.status(200).json({
      success: true,
      message: 'Database synced!',
      tables: tableDetails
    });
  }catch (error) {
    // Send an error response if synchronization fails
    console.error('Failed to sync database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync database',
      error: error.message
    });
  }
};