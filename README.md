# MarketNest - Mini Fashion Marketplace

A full-stack MERN (MongoDB, Express, React, Node.js) fashion marketplace built for the Trizen Ventures assignment.

## Overview

MarketNest is a fashion marketplace platform that supports two user roles:
- **Brand (Seller)**: Can create, edit, and manage products
- **Customer (User)**: Can browse, search, and filter products

## Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (Access + Refresh Tokens)
- **Image Storage**: Cloudinary
- **Deployment**: Vercel (Frontend) + Render (Backend)

### Project Structure

```
marketnest/
├── server/                    # Backend API
│   ├── src/
│   │   ├── config/           # Database & Cloudinary config
│   │   ├── controllers/     # Business logic (NOT in routes)
│   │   ├── middleware/      # Auth, role, ownership validation
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/          # Route definitions (thin)
│   │   ├── services/        # Token generation
│   │   ├── utils/           # Error handling, constants
│   │   ├── validators/      # Joi validation
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── client/                   # Frontend React app
    ├── src/
    │   ├── api/             # Axios & API calls
    │   ├── components/      # Reusable UI components
    │   ├── context/         # Auth state management
    │   ├── pages/           # Page components
    │   ├── App.jsx          # Main app with routing
    │   └── main.jsx         # Entry point
    ├── .env                 # Frontend env vars
    └── package.json
```

## Authentication Flow

### JWT Implementation
The application uses a dual-token authentication system:

1. **Access Token** (15 min expiry)
   - Stored in localStorage on frontend
   - Sent in Authorization header for API requests
   - Short-lived for security

2. **Refresh Token** (7 days expiry)
   - Stored in httpOnly, secure cookie
   - Used to obtain new access tokens
   - Enables session persistence

### Flow Diagram
```
Signup/Login
    │
    ▼
Generate Access Token + Refresh Token
    │
    ├──▶ Return Access Token (localStorage)
    │
    └──▶ Set Refresh Token Cookie (httpOnly)
              │
              ▼
    API Request with Access Token
              │
              ├── Valid ──▶ Process Request
              │
              └── Expired
                  │
                  ▼
        Refresh Endpoint (cookie)
              │
              ▼
        Generate New Access Token
              │
              ▼
        Return to Client
```

## Security Decisions

| Decision | Implementation |
|----------|---------------|
| Password Hashing | bcryptjs with 10 salt rounds |
| Token Storage | Access: localStorage, Refresh: httpOnly cookie |
| Cookie Security | httpOnly, secure (production), sameSite: strict |
| Input Validation | Joi schema validation |
| CORS | Whitelist only frontend domain |
| Ownership Enforcement | Middleware verifies brand owns product |
| Role-based Access | Middleware checks user role |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List published products (paginated) |
| GET | `/api/products/:id` | Get product details |

### Products (Brand)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/brand/dashboard` | Get dashboard stats |
| GET | `/api/products/brand/all` | List brand's products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Archive product |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload images (max 5) |

## Features

### Brand Features
- [x] Dashboard with product statistics
- [x] Create products (draft or published)
- [x] Edit own products
- [x] Soft delete (archive) products
- [x] Upload multiple images (max 5)
- [x] View all own products with status filters

### Customer Features
- [x] Browse marketplace
- [x] View product details
- [x] Search by product name
- [x] Filter by category
- [x] Server-side pagination

### Security
- [x] JWT authentication with refresh tokens
- [x] Role-based access control
- [x] Ownership enforcement
- [x] Password hashing with bcrypt
- [x] Input validation with Joi

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/marketnest
JWT_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Backend (Render)
1. Create a Render account
2. Connect GitHub repository
3. Create Web Service:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables
5. Deploy

### Frontend (Vercel)
1. Create Vercel account
2. Import GitHub repository
3. Configure:
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Add environment variable: `VITE_API_URL=<backend-url>`
5. Deploy

### MongoDB Atlas
1. Create free cluster
2. Create database user
3. Get connection string
4. Add to backend environment variables
5. Network access: Allow all IPs (0.0.0.0/0)

### Cloudinary
1. Create free account
2. Get credentials from dashboard
3. Add to backend environment variables

## Running Locally

### Backend
```bash
cd server
npm install
# Configure .env file
npm run dev
```

### Frontend
```bash
cd client
npm install
# Configure .env file
npm run dev
```

## Folder Structure Overview

### Backend (Production-Ready)
The backend follows MVC pattern with separation of concerns:
- **Controllers**: Business logic (NOT in routes)
- **Routes**: Thin, only define endpoints
- **Middleware**: Auth, validation, error handling
- **Services**: Reusable logic (token generation)
- **Validators**: Input validation schemas

### Frontend
- **Context**: Global auth state
- **API**: Axios instance with interceptors
- **Components**: Reusable UI
- **Pages**: Route components

## Negative Rules Compliance

| Rule | Status |
|------|--------|
| No Supabase | ✅ Using custom MongoDB + JWT |
| No Firebase | ✅ Using MongoDB + custom auth |
| Production-ready structure | ✅ Controllers separate from routes |
| Environment variables | ✅ All secrets in .env |
| Ownership enforcement | ✅ Ownership middleware implemented |

## License

This project is for assignment purposes.
