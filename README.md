# User Registration and Login System

This project implements a user registration and login system using Node.js as the server-side framework and PostgreSQL as the database.
## Features

- **User Registration**: Users can create accounts with unique usernames, valid emails, and secure passwords.

- **Login System**: Secure login mechanism for users to access their accounts.

- **Database Interaction**: PostgreSQL is used to store user data securely, with password hashing for enhanced security.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side execution.
  
- **Express.js**: Web application framework for Node.js, simplifying the development of web applications and APIs.

- **PostgreSQL**: Open-source relational database for storing user data.

- **Bcrypt.js**: Library for securely hashing passwords.

## Getting Started

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/username/registration-login-system.git
    cd registration-login-system
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Set up PostgreSQL:**
   - Create a new database named `registration_and_login`.
   - Update database connection details in `app.js` to match your PostgreSQL configuration.

4. **Run the Application:**

    ```bash
    npm start
    ```

    The server will be accessible at `http://localhost:3000`.

## Usage

1. **Registration Form:**

    Access the registration form at `http://localhost:3000/register`. Enter a unique username, valid email, and secure password.

2. **Login Form:**

    Access the login form at `http://localhost:3000/login`. Log in with your registered username and password.
