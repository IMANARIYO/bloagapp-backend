# Blog Application

## Overview
This blog application is developed as part of the QT Global Software Developer practical test. It features user authentication, blog post management, and commenting functionality.

## Technologies Used
- **Backend**: Node.js, Sequelize, PostgreSQL, Express.js
- **Frontend**: React.js
- **Database**: PostgreSQL

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- PostgreSQL installed and running

### Backend Setup

1. **Navigate to the Backend Directory**
   ```bash
   cd backend
2. **Install Backend Dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file in the backend directory and add your PostgreSQL credentials**
   ```
  DB_HOST=dpg-cqme1p1u0jms73frbfl0-a.ohio-postgres.render.com
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_secret
JWT_SECRET=your_jwt_secret
JWT_EXP=your_jwt_token_expiry_time
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
SERVER_PORT=4444

   ```
4. **Run the Backend Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory**
   ```bash
   cd frontend
   ```
2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Run the Frontend Server**
   ```bash
   npm start
   ```

## Features

- **User Authentication**: Users can register, log in, and log out.
- **Blog Post Management**: Users can create, read, update, and delete 
## Deployment
## Deployment

- **Backend**: Deployed using Render. For API documentation and deployment instructions, visit the [Render API Docs](https://blogapp-ampm.onrender.com/api-docs).
- **Frontend**: Deployed on Vercel. You can view the application [here](https://imanariyo-blog-app-deployed-version.vercel.app/).

The application can also be deployed on Render or Heroku if needed.

## Repositories

- **Backend Repository**: [GitHub - bloagapp-backend](https://github.com/IMANARIYO/bloagapp-backend.git)
- **Frontend Repository**: [GitHub - blogapp](https://github.com/IMANARIYO/blogapp.git)

## Contributing

Contributions are welcome! To contribute, please fork the repository, make your changes, and submit a pull request. Your contributions help improve the application.


