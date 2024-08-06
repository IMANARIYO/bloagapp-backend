import CommentRouter from "./src/routes/commentsRoutes.js";
import authRouter from "./src/routes/AuthenticaticationRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import postsRouter from "./src/routes/postsRoutes.js";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import { fileURLToPath } from "url";
import { sequelize } from "./config/config.js";
import { syncDB } from "./config/syncDB .js";
import { baptistename } from "./media/index.js";
import { seedUsers } from "./seeders/20240801154108-demo-users.js";
import { seedDatabase } from "./src/controllers/seederController.js";
import { badroutes, errosingeneral } from "./src/middlewares/globaleerorshandling.js";

baptistename
// Load environment variables
dotenv.config()
const app = express();
app.use(cors());  
const port = process.env.server_PORT || 4444

// Middleware to parse JSON
app.use(express.json())

// Swagger UI setup
const swaggerDocument = yaml.load('./swaggerdocumentation.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// Serve static files from the media directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/media', express.static(path.join(__dirname, './media')));
//routes
app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/comments', CommentRouter)
app.use('/seed', seedDatabase)
// Add the status route
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.post('/sync-db', syncDB);  // Use syncDB middleware directly
app.use('*',badroutes)
app.use(errosingeneral)
app.use((req, res) => {
  res.status(404).json({ message: "Welcome to the API! This route is not found." });
});
app.use(bodyParser.json())
// Connect to PostgreSQL and sync database
sequelize
  .authenticate()
  .then(() => {
    console.log(
      'Connection to the database has been established successfully.'
    )
    // Sync database after successful connection
    // return syncDB();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/api-docs`)
})
