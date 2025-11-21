# Neon PostgreSQL Setup Guide

## Step 1: Get Neon Connection String

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up or log in
3. Create a new project
4. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

## Step 2: Update Environment Variables

Open `backend/.env` and replace the DATABASE_URL with your Neon connection string:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## Step 3: Install Dependencies (Already Done)

The required packages are already installed:
- `pg` - PostgreSQL driver
- `dotenv` - Environment variable management

## Step 4: Database Configuration

The database is automatically configured in `backend/src/config/database.js` with:
- SSL support for Neon
- Connection pooling
- Error handling

## Step 5: Database Table

The `urls` table will be automatically created when the server starts:

```sql
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 6: Start the Application

1. Make sure your Neon connection string is set in `.env`
2. Start the server:
   ```bash
   npm run dev
   ```

The server will:
- Connect to Neon PostgreSQL
- Create the `urls` table if it doesn't exist
- Start the API server on port 3333

## Step 7: Test the Connection

1. Open your browser to `http://localhost:3333/healthz`
2. You should see a successful health check response
3. Try creating a short URL through the frontend at `http://localhost:3000`

## Features Available

- ✅ Create short URLs
- ✅ Custom short codes
- ✅ URL redirection with click tracking
- ✅ Statistics viewing
- ✅ Search functionality
- ✅ Delete URLs
- ✅ Health monitoring

## Troubleshooting

### Connection Issues
- Verify your Neon connection string is correct
- Check if your Neon project is active
- Ensure SSL is enabled (Neon requires SSL)

### Table Creation Issues
- The table is created automatically on first run
- If there are permission issues, manually run the SQL in Neon console

### Port Conflicts
- The backend runs on port 3333
- The frontend runs on port 3000
- Change the PORT in `.env` if needed
