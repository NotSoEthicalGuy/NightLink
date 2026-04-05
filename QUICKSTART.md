# NightLink - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### Step 2: Set Up Database

You have two options:

#### Option A: Use a Cloud Database (Recommended for Quick Start)
1. Create a free PostgreSQL database at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy the connection string
3. Update `backend/.env`:
```env
DATABASE_URL="your-connection-string-here"
```

#### Option B: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `nightlink`
3. Update `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nightlink?schema=public"
```

### Step 3: Run Database Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Wait for: `🚀 NightLink API running on http://localhost:3001/api`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:3000`

### Step 5: Create Your First Account

1. Open browser: `http://localhost:3000`
2. Click "Get Started"
3. Fill in the signup form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Username: `johndoe` (this will be your URL: `/pr/johndoe`)
   - Password: `password123`
4. Click "Create Account"
5. You'll be redirected to your dashboard! 🎉

## 🎯 What You'll See

### Landing Page
- Stunning gradient background with animated elements
- Feature showcase
- Pricing tiers
- How it works section

### Dashboard
- Overview with stats (mock data for now)
- Quick actions to create events and edit website
- Sidebar navigation

### Website Editor (Coming Soon)
- Template selector
- Color palette picker
- Font selector
- Live preview

## 🛠️ Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use:

**Frontend:**
Edit `frontend/vite.config.ts`:
```typescript
server: {
  port: 5173, // Change to any available port
}
```

**Backend:**
Edit `backend/.env`:
```env
PORT=3002  # Change to any available port
```

### Database Connection Failed
- Check your `DATABASE_URL` in `backend/.env`
- Make sure PostgreSQL is running (if using local)
- Verify your cloud database credentials (if using cloud)

### Module Not Found Errors
- Run `npm install` again in both frontend and backend
- Delete `node_modules` and `package-lock.json`, then `npm install`

## 📚 Next Steps

1. **Explore the Code**
   - Frontend: `frontend/src/pages/LandingPage.tsx` - Stunning marketing page
   - Backend: `backend/src/auth/` - Authentication logic
   - Database: `backend/prisma/schema.prisma` - Data models

2. **Customize the Landing Page**
   - Edit colors in `frontend/tailwind.config.js`
   - Modify content in `frontend/src/pages/LandingPage.tsx`

3. **Test the Authentication**
   - Create multiple accounts
   - Login and logout
   - Check JWT tokens in browser DevTools (Application → Local Storage)

4. **Explore the Database**
   - Run `npx prisma studio` in the backend folder
   - Opens a visual database browser at `http://localhost:5555`

## 🎨 Customization

### Change Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color-here',
  },
}
```

### Add a New Page
1. Create `frontend/src/pages/NewPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link where needed

### Create New API Endpoint
1. Create controller in `backend/src/`
2. Add to `backend/src/app.module.ts`
3. Call from frontend using the `api` instance

## 🚀 Deployment (Future)

### Frontend → Vercel
```bash
cd frontend
vercel deploy
```

### Backend → Railway/Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically on push

## ⚡ Pro Tips

1. **Use Prisma Studio** to visually inspect your database:
   ```bash
   cd backend
   npx prisma studio
   ```

2. **Hot Reload** is enabled - make changes and see them instantly!

3. **TypeScript Autocomplete** works across frontend and backend - leverage it!

4. **Test API with Thunder Client** (VS Code extension) or Postman

## 📞 Need Help?

- Check the main `README.md` for full documentation
- Review the architecture doc in `.gemini/antigravity/brain/`
- Common issues: Database connection, port conflicts, missing env variables

---

Happy coding! 🌙✨
