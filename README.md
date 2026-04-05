# NightLink - Nightclub PR SaaS Platform

A multi-tenant SaaS platform that enables nightclub PRs and event promoters to create professional websites for managing event ticket reservations.

## 🚀 Features

- **Professional PR Websites**: Each PR gets a unique, customizable website
- **3 Premium Templates**: Minimalist, Party, and Premium designs
- **Reservation Management**: Accept and manage ticket reservations 24/7
- **Real-time Inventory**: Automatic ticket quantity tracking
- **Manual Payment Flow**: Customers reserve tickets, pay offline (WhatsApp/Western Union)
- **Responsive Design**: Mobile-first, stunning UI with glassmorphism effects
- **Multi-tenant Architecture**: Secure data isolation per PR
- **Analytics Dashboard**: Track reservations, revenue, and insights

## 📋 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Query** for server state management
- **Zustand** for client state management
- **React Hook Form + Zod** for form validation

### Backend
- **NestJS** with TypeScript
- **Prisma** ORM
- **PostgreSQL** database
- **JWT** authentication
- **Bcrypt** for password hashing

## 🛠️ Installation

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nightlink?schema=public"
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

6. Start the backend server:
```bash
npm run start:dev
```

The API will be running at `http://localhost:3001/api`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file:
```bash
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## 📖 Usage

### 1. Create an Account

1. Go to `http://localhost:3000`
2. Click "Get Started" or "Sign Up"
3. Fill in your details:
   - Full Name: Your professional name
   - Email: Your email address
   - Username: Your unique URL (e.g., `johndoe` → `nightlink.com/pr/johndoe`)
   - Password: Minimum 6 characters

### 2. Customize Your Website

After signing up, you'll be redirected to your dashboard:

1. **Profile Editor**: Add your bio, photo, and contact info (WhatsApp, Instagram, phone)
2. **Website Editor**: 
   - Choose a template (Minimalist, Party, or Premium)
   - Select color palette
   - Pick font family
   - Upload cover image/video
   - Toggle section visibility

### 3. Create Events

1. Navigate to "Events" in the dashboard
2. Click "Create Event"
3. Fill in event details:
   - Event name, date, and time
   - Venue information
   - Event description
   - Cover image

### 4. Add Ticket Types

For each event, create ticket types:
- VIP, General Admission, Early Bird, etc.
- Set price and total quantity
- Tickets are automatically tracked

### 5. Manage Reservations

1. Customers visit your PR website (`/pr/your-username`)
2. They select an event and ticket quantity
3. System creates a reservation (status: `PENDING_PAYMENT`)
4. Customer contacts you via WhatsApp to complete payment
5. You manually confirm payment in your dashboard
6. Reservation status changes to `PAID_CONFIRMED`

## 🎨 Templates

### Minimalist
- Clean, professional design
- White background
- Perfect for upscale events

### Party
- Bold, energetic vibe
- Dark background with gradients
- Animated elements

### Premium
- Luxury aesthetic
- Glassmorphism effects
- VIP-focused design

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new PR account
- `POST /api/auth/login` - Login to dashboard

### (Coming Soon)
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/reservations` - Get all reservations
- `PATCH /api/reservations/:id/confirm` - Confirm payment

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- Row-level security in database
- Input validation with class-validator
- CORS enabled for frontend origin

## 🚧 Roadmap

### Phase 1 (MVP) ✅
- User authentication
- Basic dashboard
- Landing page
- Database schema

### Phase 2 (Next 4 weeks)
- Event management UI
- Reservation flow
- PR website templates
- Website editor with live preview

### Phase 3 (Future)
- WhatsApp Business API integration
- QR code tickets
- Payment gateway integration (optional)
- Custom domains
- Mobile app

## 📝 Database Schema

See the full schema in `backend/prisma/schema.prisma`

Key models:
- **Tenant**: PR accounts
- **Profile**: PR profile information
- **SiteConfig**: Website customization settings
- **Event**: Event details
- **TicketType**: Ticket categories with pricing
- **Reservation**: Customer reservations with state machine

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🌟 Support

For support, email support@nightlink.com or message us on WhatsApp.

---

Built with ❤️ for nightclub PRs who want to elevate their game.
