Exlabs Recruitment Task - User Management API
This is the backend application for the Exlabs recruitment task, which provides a User Management API. The application is built using Node.js and Express.js and uses MongoDB as the database.

/*
This application, in addition to this solution, is also deployed on heroku. 
https://exlabs-recruitment-task-sm-547879cea589.herokuapp.com/
Code for that version:
https://github.com/StefanMocek/exlabs-with-common-package.git
It also differs in that the utils folder is in a separate project and used as npm package in main app.
Code for npm package code:
https://github.com/StefanMocek/exlabs-common-package-SM.git
*/

Technologies Used
The following technologies were used to develop this application:

Node.js
TypeScript
Express.js
NoSQL Database - MongoDB
mongoose (ODM for MongoDB)
cookie-session (for session management)
jsonwebtoken (for JWT authentication)
Jest, ts-jest, mongodb-memory-server (for testing)
dotenv (for environment variables)
cors (for Cross-Origin Resource Sharing)
express-validator (for request validation)
Swagger UI Express (for API documentation)
YAML (for Swagger documentation)

How to Run Locally
To run the application locally, please follow the instructions below:

Clone the project from GitHub: https://github.com/StefanMocek/exlabs-recruitment-task.git
Install the dependencies by running the following command: npm install
Create a .env file in the root directory of the project and provide the necessary environment variables. Here is an example of the required variables:
  PORT=3000
  MONGO_URL=mongodb://localhost:27017/user_management
  JWT_KEY=your-secret-key
Build the application by running the following command: npm run build
Start the application by running the following command: npm start
This will start the server and it will be accessible at http://localhost:3000.

In dev mode You can use nodemon with command: npm run dev

Testing
To run all the tests use the command:  npm run test

API Documentation
The API documentation is available at http://localhost:3000/api-docs.

Authentication
The application uses jsonwebtoken and cookie-session for session management.

GitHub Actions
In the project, a configuration file called 'deploy.yml' has been added for GitHub Actions. GitHub Actions allows for automating the build, testing, and deployment process of the application whenever changes are made to the repository.

The 'deploy.yml' file defines the Continuous Integration pipeline for the application. Upon each push to the repository, GitHub Actions performs the following steps:

Installs Node.js with the required version.
Sets up the environment.
Installs application dependencies.
Builds the application.
Runs the application tests.
If all tests pass successfully, the application is considered valid.

Please note that in this case, the focus is on testing the application, and the deployment step is not included in the provided 'deploy.yml' file - it is done in second app.

Summary
In this solution, I presented a web application architecture based on Node.js with Express.js framework, MongoDB as the database, and JWT token-based authentication. I provided sample endpoints for basic user operations and mentioned the use of GitHub Actions for automating the build, testing, and deployment process.

I hope this information is helpful! If you have any further questions, feel free to ask.




Specification for the task:

Database schema
The database should consist of one table (for SQL databases) or collection (for NoSQL databases) with the following schema:

  "id"        INTEGER NOT NULL,
  "firstName" TEXT,
  "lastName"  TEXT,
  "email"     TEXT NOT NULL UNIQUE,
  "role"      TEXT NOT NULL,
Authentication
All API endpoints should be accessible only by authenticated users. You can use any form of authentication.

Endpoints specification
Get all users
Returns an array of all users in the database. Users can be filtered by a role query parameter.

Endpoint: GET /api/users

Query parameters:

role - return only users with selected role

Get user
Returns an object containing user data.

Endpoint: GET /api/user/:id

Path parameters:

id - ID of the user

Create user
Creates new user record in the database. User data should be based on request body.

Endpoint: POST /api/user

Request body: object with the following properties:

firstName - first name of the user
lastName - last name of the user
email - email address of the user (required)
role - role of the user (user or admin) (required)
Sample response: status code 201

Update user
Updates the user record in the database with data provided in the request body.

Endpoint: PATCH /api/user/:id

Path parameters:

id - ID of the user
Request body: object with the following properties (should contain at least one property):

firstName - first name of the user (optional)
lastName - last name of the user (optional)
role - role of the user (user or admin) (optional)
Sample response: status code 200

Delete user
Removes the user record from the database.

Endpoint: DELETE /api/user/:id

Path parameters:

id - ID of the user
Sample response: status code 200