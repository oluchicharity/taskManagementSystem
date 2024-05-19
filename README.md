TASK MANAGEMENT SYSTEM

INTRODUCTION

The Task Management System is a web application designed to help users manage their tasks efficiently. It supports user registration and login, task creation, updating, deletion, and fetching tasks. The system also provides real-time notifications using Socket.IO.

FEATURES

User Registration and Authentication
Task Management (Create, Read, Update, Delete)
Real-time Notifications with Socket.IO
RESTful API

TECHNOLOGIES USED

Node.js
Express
MongoDB (Mongoose)
Socket.IO
TypeScript
JWT (JSON Web Tokens)
bcrypt (for password hashing)
Installation
Prerequisites
  "dependencies": {
  "@types/node": "^20.12.12",   
  "@types/socket.io": "^3.0.2",
    "typescript": "^5.4.5"
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/dotenv": "^8.2.0",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/mongoose": "^5.11.97",
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "concurrently": "^8.2.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-validator": "^7.0.1",
    "http": "^0.0.1-security",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.5",
    "nodemon": "^3.1.0",
    "socket.io": "^4.7.5",
    "ts-node": "^10.9.2"}


 STEPS
 
Clone the repository:

git clone https://github.com/your-username/task-management-system.git
cd task-management-system
Install the dependencies:

npm install
Create a .env file in the root directory with the following contents:

SECRET=SECRET
PORT=2000

Compile TypeScript to JavaScript:

npm run build

Start the server:

npm start


CONTRIBUTING

Contributions are welcome! Please create a pull request with a detailed description of your changes.

License
This project is licensed under the MIT License.



    

    


    
