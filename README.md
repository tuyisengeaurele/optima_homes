# OptimaHomes 🏠

> **Your Trusted Real Estate Partner** — A premium real estate marketplace for buying and renting properties in Rwanda.

![OptimaHomes](./optimahomeslogo.png)

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- Framer Motion (animations)
- Zustand (state management)
- React Router DOM v7
- React Hook Form
- Axios
- Swiper.js
- React Icons

**Backend**
- Node.js + Express.js
- MySQL 8+
- JWT Authentication
- bcryptjs
- Multer (file uploads)
- Helmet + CORS + Rate Limiting

---

## Features

### Public
- Animated splash screen with brand reveal
- Hero section with property slideshow
- Advanced property search & filtering (type, city, bedrooms, price range, etc.)
- Property listings with grid/list view toggle
- Detailed property pages with image gallery
- Contact agent inquiry form
- Dark/light mode
- Fully responsive (mobile-first)

### User Dashboard
- Save/unsave favorite properties
- Track submitted inquiries
- Edit profile & change password

### Admin Dashboard
- Analytics overview (properties, users, inquiries, views)
- Full property CRUD with image upload
- User management (activate/deactivate/delete)
- Inquiry management with status tracking

---

## Project Structure

```
optimahomes/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       │   ├── common/     # Toast, Skeleton, ProtectedRoute, SplashScreen
│       │   ├── layout/     # Navbar, Footer, MainLayout, AdminLayout
│       │   └── property/   # PropertyCard
│       ├── pages/
│       │   ├── admin/      # Dashboard, Properties, Users, Inquiries
│       │   ├── auth/       # Login, Register
│       │   ├── user/       # Dashboard, SavedProperties, Inquiries, Profile
│       │   ├── Home.jsx
│       │   ├── Listings.jsx
│       │   ├── PropertyDetail.jsx
│       │   ├── About.jsx
│       │   └── Contact.jsx
│       ├── store/          # Zustand stores (auth, property, ui)
│       └── services/       # Axios API client
│
├── server/                 # Express backend
│   ├── config/             # DB and JWT config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, upload, error handling
│   ├── models/             # MySQL query models
│   └── routes/             # API route definitions
│
└── database/
    ├── schema.sql          # Full database schema
    └── seed.sql            # Sample data
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/tuyisengeaurele/optima_homes.git
cd optima_homes
```

### 2. Database Setup

```sql
-- In MySQL:
source database/schema.sql;
source database/seed.sql;
```

### 3. Server Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```

### 4. Client Setup

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173` with the API at `http://localhost:5000`.

---

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=optimahomes

JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key

CLIENT_URL=http://localhost:5173
```

---

## Default Admin Account

After running the seed file:

| Field | Value |
|-------|-------|
| Email | admin@optimahomes.com |
| Password | admin123 |

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Required |
| GET | `/api/properties` | List properties (filterable) | Public |
| GET | `/api/properties/featured` | Featured properties | Public |
| GET | `/api/properties/:id` | Single property | Public |
| POST | `/api/properties` | Create property | Admin |
| PUT | `/api/properties/:id` | Update property | Admin |
| DELETE | `/api/properties/:id` | Delete property | Admin |
| GET | `/api/favorites` | My saved properties | User |
| POST | `/api/favorites/:id` | Save property | User |
| DELETE | `/api/favorites/:id` | Remove favorite | User |
| POST | `/api/inquiries/property/:id` | Send inquiry | Public |
| GET | `/api/inquiries/my` | My inquiries | User |
| GET | `/api/inquiries` | All inquiries | Admin |
| GET | `/api/users` | All users | Admin |
| GET | `/api/analytics/dashboard` | Dashboard stats | Admin |

---

## License

MIT © Ange Aurele TUYISENGE
