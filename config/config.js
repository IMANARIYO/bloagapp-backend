import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();



const DB_URL="postgresql://imanariyo:W8auP2dV6WVQSVMt20tpcXlIIknow2lL@dpg-cqorifaj1k6c73d7925g-a.oregon-postgres.render.com/blogdb_c1k7"

export const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres', 
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false 
    }
  },
 
  
});


