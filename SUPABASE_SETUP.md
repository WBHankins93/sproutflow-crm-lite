# Supabase Setup Guide

Follow these steps to set up your Supabase project for Sproutflow CRM Lite.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in:
   - **Name**: Sproutflow CRM (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to you
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Copy this value
   - **anon public** key: Copy this value (under "Project API keys")

## Step 3: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor** (in the sidebar)
2. Click "New query"
3. For a fresh project, run `supabase/migrations/001_initial_schema.sql`
4. Then run `supabase/migrations/002_crm_lite_workflow.sql`
5. If your project already has the initial schema, run only `002_crm_lite_workflow.sql`
6. You should see "Success. No rows returned" after each migration

## Step 5: Create Your First User

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Fill in:
   - **Email**: your-email@example.com
   - **Password**: choose a password
   - **Auto Confirm User**: Check this box (so you don't need to verify email)
4. Click "Create user"

5. **Important**: Update the user's role in the database:
   - Go to **SQL Editor** again
   - Run this query (replace the email with your user's email):
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_build_object('role', 'admin', 'full_name', 'Your Name')
   WHERE email = 'your-email@example.com';
   ```

   Or manually update the `users` table:
   ```sql
   UPDATE public.users 
   SET role = 'admin', full_name = 'Your Name'
   WHERE email = 'your-email@example.com';
   ```

## Step 6: Verify Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. You should be redirected to `/login`
4. Log in with the credentials you created
5. You should see the dashboard
6. Create a lead, add a note, convert the lead to a client, and confirm the new client record opens

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file has the correct values
- Make sure you copied the **anon public** key, not the service_role key
- Restart the dev server after changing `.env.local`

### "relation does not exist" error
- Make sure you ran the migration SQL in Step 4
- Check that all tables were created in **Table Editor** in Supabase

### Can't log in
- Make sure you created a user in Supabase Authentication
- Check that the user's email matches what you're using to log in
- Verify the user was created in the `users` table (check Table Editor)

### Row Level Security errors
- The migration includes RLS policies, but if you're getting permission errors, you may need to check the policies in Supabase
- Go to **Authentication** > **Policies** to view and manage RLS policies
