# TimeBit

TimeBit is a modern time tracking and project management application that helps teams and individuals manage their time effectively and track projects or hobbies effectively. Developed as a group project at **the University of Applied Sciences FH Campus Wien**, our goal is to be a simple, lightweight, and user-friendly solution for tracking time and staying organized.

## Features

- User authentication and authorization
- Google OAuth integration
- Project time tracking
- Real-time updates and notifications
- Responsive design

## Tech Stack

- **Frontend**: Plain HTML + CSS
- **Backend**: Node.js, Express.js
- **Database**: MariaDB
- **Authentication**: JWT, Google OAuth
- **Other**: Sequelize ORM, bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- A database for user registration/authentification
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mihaiel/TimeBit.git
   cd TimeBit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=your_google_callback_url
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Access the application at `http://localhost:3000`
2. Sign up or log in using your credentials or Google account
3. Start tracking your time and managing projects

## Contributing

This project is licensed under the GNU Affero General Public License v3.0. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

Please report any security issues to our security team. See [SECURITY.md](SECURITY.md) for more information.

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to my colleagues who have contributed and helped shape this project
- Special thanks to the open-source community for their time, tools and libraries
