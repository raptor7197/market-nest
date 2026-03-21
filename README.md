# MarketNest

Mini fashion marketplace built with MongoDB, Express, React, and Node.js for the Trizen Ventures assignment.

## Stack

- Frontend: React 18, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Mongoose, Joi
- Auth: JWT access token + refresh token
- Storage: Cloudinary
- Deployment: Vercel (client) + Render (server)

## Architecture

```text
client/
  src/api            Axios instance, API wrappers, auth refresh handling
  src/context        Auth state and session bootstrap
  src/pages          Route-level UI
  src/components     Reusable UI and route guards

server/
  src/config         MongoDB and Cloudinary setup
  src/controllers    Request handlers
  src/middleware     Auth, role, ownership, validation, error handling
  src/models         User and Product schemas
  src/routes         Thin route definitions
  src/services       Token generation and verification
  src/validators     Joi request validation
  src/scripts        Seed script for placeholder marketplace data
```

## Technical Implementation

### Authentication

- Signup requires `name`, `email`, `password`, and `role`.
- Passwords are hashed with `bcryptjs` in the `User` model pre-save hook.
- Login returns:
  - access token in JSON
  - refresh token in an `httpOnly` cookie
- Access token is sent in the `Authorization` header for protected requests.
- Refresh token is stored hashed in MongoDB and validated through `/api/auth/refresh`.
- Axios interceptors retry failed `401` requests after requesting a new access token.
- Logout clears the refresh cookie and removes the stored refresh token from the user document.

### Authorization

- `authenticate` middleware verifies JWT access tokens.
- `requireRole('brand')` restricts dashboard, create, update, delete, and upload routes.
- `checkOwnership` ensures a brand can edit or archive only its own products.
- Customers can only access public product browsing endpoints.

### Product Flow

- Product schema includes `name`, `description`, `price`, `category`, `images`, `brand`, and `status`.
- `status` supports `draft`, `published`, and `archived`.
- Marketplace queries only return `published` products.
- Search uses case-insensitive name matching.
- Category filtering and pagination are handled server-side.
- Brand dashboard aggregates total, published, archived, and draft counts.
- Delete is implemented as soft delete by setting `status` to `archived`.

### Uploads

- Image uploads are handled through `multer` and Cloudinary.
- Product image arrays are limited to 5 items.

### Security Decisions

- Password hashing: `bcryptjs`
- Input validation: Joi schemas on auth and product routes
- Secrets: environment variables only
- Refresh token transport: `httpOnly` cookie
- Production cookie policy: `secure: true`, `sameSite: 'none'`
- CORS: frontend origin restricted through `CLIENT_URL`

## API

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/brand/dashboard`
- `GET /api/products/brand/all`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Upload

- `POST /api/upload`

## Environment Variables

### Server

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/marketnest
JWT_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:5173
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## Deployment

### Backend

- Platform: Render
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Required env vars: all server variables listed above

### Frontend

- Platform: Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Required env var:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

### Deployment Notes

- Set `CLIENT_URL` on the backend to the exact Vercel domain.
- Refresh-token cookies require HTTPS in production.
- Cross-site auth between Vercel and Render depends on:
  - `withCredentials: true` in Axios
  - `sameSite: 'none'`
  - `secure: true`
  - correct CORS origin

## Placeholder Marketplace Data

Seed script:

```bash
cd server
npm run seed
```

This creates a brand account and published placeholder products for marketplace testing.

- Email: `seed.brand@marketnest.demo`
- Password: `SeedBrand123!`

## AI Usage

AI assistance was used for code drafting, refactoring, and documentation. Final integration, debugging, and project-specific adjustments were applied within the repository codebase.
