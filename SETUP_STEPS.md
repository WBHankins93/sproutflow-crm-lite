# Quick Setup Steps

## 1. Install Dependencies (if not already done)
```bash
npm install
```

## 2. Set Up Supabase

### Option A: Quick Start (You have Supabase credentials)
1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` with your Supabase credentials
3. Run the database migrations in Supabase SQL Editor (see SUPABASE_SETUP.md)

### Option B: New Supabase Project
1. Follow the detailed guide in `SUPABASE_SETUP.md`
2. Create a new Supabase project at https://supabase.com
3. Get your API credentials
4. Set up `.env.local` file
5. Run the migration SQL

## 3. Start the Development Server
```bash
npm run dev
```

## 4. Access the Application
- Open http://localhost:3000
- You'll be redirected to `/login`
- Log in with your Supabase user credentials

## What You'll See
- **Without Supabase setup**: The UI will load but show errors when trying to authenticate
- **With Supabase setup**: Full functionality - login, dashboard, and all features

## Next Steps After Setup
1. Create your first user in Supabase Authentication
2. Set the user's role to 'admin' in the database
3. Start adding leads and clients
4. Use follow-up dates and notes to track daily activity
