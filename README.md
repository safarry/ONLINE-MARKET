<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======
# ONLINE-MARKET
# 🛍️ Trusted Marketplace Backend

A robust, scalable backend API for a trusted marketplace platform built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 👥 **User Management** - User registration, login, profile management
- 🛒 **Product Management** - CRUD operations for products with image upload
- ⭐ **Reviews & Ratings** - Product review and rating system
- 🔍 **Search & Filter** - Advanced product search and filtering
- 📧 **Email Notifications** - Automated email system with Nodemailer
- 🖼️ **Image Upload** - Cloudinary integration for image storage
- 💳 **Payment Integration** - Stripe payment gateway (ready to implement)
- 🛡️ **Security** - Helmet, CORS, rate limiting, input validation
- 📊 **Error Handling** - Centralized error handling with custom error classes
- 🚀 **Performance** - Response compression and optimized queries

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express-validator
- **Security:** Helmet, CORS, bcryptjs
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **Logging:** Morgan
- **Testing:** Jest + Supertest (configured)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trusted-marketplace-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in your configuration values:
   - Database connection string
   - JWT secrets
   - Email credentials
   - Cloudinary credentials
   - Other API keys

4. **Start the server**
   
   Development mode (with hot reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

5. **Verify installation**
   
   Visit `http://localhost:5000` - you should see the API welcome message.

## 📁 Project Structure

```
trusted-marketplace-backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # MongoDB connection setup
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.js
│   │   └── product.controller.js (placeholder)
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication & authorization
│   │   ├── errorHandler.js  # Error handling
│   │   └── validate.js      # Request validation
│   ├── models/              # Database models
│   │   ├── User.js          # User schema
│   │   └── Product.js       # Product schema
│   ├── routes/              # API routes
│   │   ├── auth.routes.js   # Authentication routes
│   │   └── product.routes.js (placeholder)
│   ├── utils/               # Utility functions
│   │   └── helpers.js       # Common helper functions
│   └── server.js            # Application entry point
├── tests/                   # Test files (to be added)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
└── README.md                # This file
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional: "user" or "seller"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

### Product Endpoints (Coming Soon)

Product CRUD operations will be implemented following the same patterns.

## 🔐 Environment Variables

See `.env.example` for all required environment variables. Key variables include:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRE` | JWT expiration time | Yes |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `SMTP_*` | Email configuration | Optional |
| `CLOUDINARY_*` | Image upload configuration | Optional |

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run linter
npm run lint

# Database migrations (when implemented)
npm run migrate
```

### Code Style

- Use ES6+ features
- Follow async/await pattern for asynchronous operations
- Use descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Adding New Features

1. **Create Model** (if needed) in `src/models/`
2. **Create Controller** in `src/controllers/`
3. **Create Routes** in `src/routes/`
4. **Add Validation** using express-validator
5. **Update server.js** to mount new routes
6. **Test** your endpoints

Example of mounting a new route in `server.js`:
```javascript
app.use('/api/v1/products', require('./routes/product.routes'));
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js
```

## 🚀 Deployment

### Prerequisites for Production

- Node.js hosting (Heroku, DigitalOcean, AWS, etc.)
- MongoDB Atlas account
- Environment variables configured

### Deployment Steps

1. Set `NODE_ENV=production` in your hosting environment
2. Configure all required environment variables
3. Ensure MongoDB Atlas is accessible
4. Deploy using your platform's CLI or CI/CD pipeline

### Security Checklist

- [ ] All environment variables are set
- [ ] JWT secrets are strong and unique
- [ ] Database connection uses SSL
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] File upload limits are set
- [ ] Input validation is implemented
- [ ] HTTPS is enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Next Steps

Ready to start building? Here's what to implement next:

1. **Complete Product Management**
   - Implement product controller methods
   - Add image upload functionality
   - Create product search and filtering

2. **Order Management**
   - Create Order model
   - Implement order controller and routes
   - Add order status tracking

3. **Payment Integration**
   - Set up Stripe webhook handlers
   - Implement payment processing
   - Add payment verification

4. **Advanced Features**
   - Wishlist functionality
   - Shopping cart
   - Admin dashboard endpoints
   - Analytics and reporting

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For questions or issues, please open an issue on the repository.

---

**Happy Coding! 🚀**
>>>>>>> a2484778f866156196044cfd467805f70ba66363
