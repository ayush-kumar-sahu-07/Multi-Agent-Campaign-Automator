# Vercel Deployment Step-by-Step Guide

## Prerequisites
- [Vercel Account](https://vercel.com/signup) (free)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register) (free tier)
- Your GitHub repo connected to Vercel
- Node.js 20+ installed locally

---

## Step 1: Secure Your API Keys (🔴 CRITICAL)

### 1.1 Rotate OpenRouter API Key
Your current API key is **exposed in git history**. You must rotate it:

1. Go to [OpenRouter Console](https://openrouter.ai/account/api-keys)
2. Delete the exposed key: `[REDACTED_EXPOSED_KEY_REVOKED]`
3. Create a new API key
4. Copy the new key (you'll need it for Vercel)

**⚠️ Important:** Never commit real API keys to GitHub again. Always use `.gitignore` and Vercel environment variables.

### 1.2 Generate Strong SESSION_SECRET

Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need it for Vercel.

---

## Step 2: Set Up MongoDB Atlas (Free Tier)

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google or email
3. Create organization (skip suggestions)

### 2.2 Create a Free Cluster
1. Click "Create" (new project)
2. Name: `workflow-automator`
3. Click "Create Project"
4. Select "Build a Cluster"
5. Choose **M0 Sandbox** (free tier)
6. Select region close to you
7. Click "Create Cluster" (takes ~5 minutes)

### 2.3 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. **Username:** `automator_user`
4. **Password:** Generate secure password (copy this!)
5. **Database User Privileges:** `readWriteAnyDatabase`
6. Click "Add User"

### 2.4 Get Connection String
1. Go to "Database"
2. Click "Connect" on your cluster
3. Choose "Drivers" → Node.js
4. Copy connection string

**It will look like:**
```
mongodb+srv://automator_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Replace `<password>` with the password from Step 2.3

**Example:**
```
mongodb+srv://automator_user:MyP@ssw0rd123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority&appName=workflow-automator
```

**Save this - you'll need it for Vercel.**

---

## Step 3: Prepare Code Changes

### 3.1 Verify Files Exist
The following files should already be created:
- ✅ `.gitignore` (created by us)
- ✅ `vercel.json` (created by us)
- ✅ `DEPLOYMENT_ANALYSIS.md` (created by us)

### 3.2 Update `server/.env.example`
Make sure it shows example values (not real ones):

```bash
# Provider: openrouter | groq
AI_PROVIDER=openrouter
AI_API_KEY=your_new_api_key_here
AI_MODEL=meta-llama/llama-3.1-8b-instruct
PORT=5000
SESSION_SECRET=generate_a_strong_random_secret
CLIENT_ORIGIN=https://yourdomain.vercel.app
MONGO_MEMORY_FALLBACK=false
MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/workflow_automator?retryWrites=true&w=majority
```

### 3.3 Update `vite.config.js`
Ensure API proxy is configured:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Don't expose source maps in production
  }
})
```

### 3.4 Commit Changes to GitHub
```bash
git add .gitignore vercel.json DEPLOYMENT_ANALYSIS.md VERCEL_SETUP_GUIDE.md
git commit -m "chore: add Vercel deployment configuration"
git push origin main
```

---

## Step 4: Create Vercel Project

### 4.1 Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"

### 4.2 Configure Build Settings
1. **Framework:** Select "Vite"
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Install Command:** `npm install`

### 4.3 Add Environment Variables
Click "Environment Variables" and add each one:

**IMPORTANT: These are the exact variables needed**

```
# Frontend (available at build time)
VITE_API_BASE_URL = https://yourdomain.vercel.app/api

# Backend
MONGODB_URI = mongodb+srv://automator_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/workflow_automator?retryWrites=true&w=majority

# Session
SESSION_SECRET = (your generated 64-char hex string from Step 1.2)

# AI
AI_PROVIDER = openrouter
AI_API_KEY = (your new API key from Step 1.1)
AI_MODEL = meta-llama/llama-3.1-8b-instruct

# CORS
CLIENT_ORIGIN = https://yourdomain.vercel.app

# Environment
NODE_ENV = production
```

**Note:** Replace:
- `yourdomain` → Your Vercel project name (auto-generated or custom)
- `YOUR_PASSWORD` → Your MongoDB password
- `(your new API key)` → Your rotated OpenRouter key
- `(your generated secret)` → The SESSION_SECRET from Step 1.2

### 4.4 Deploy
Click "Deploy" and wait 2-3 minutes.

---

## Step 5: Verify Deployment

### 5.1 Check Build Logs
1. Go to Vercel Project → "Deployments"
2. Click the latest deployment
3. View "Build Logs" - should see:
   - `npm install` success
   - `npm run build` success
   - No errors

### 5.2 Test API Health
1. Get your Vercel URL (shown after deployment)
2. Open in browser:
   ```
   https://yourdomain.vercel.app/api/health
   ```
3. Should see:
   ```json
   {
     "ok": true,
     "service": "multi-agent-workflow-api"
   }
   ```

### 5.3 Test Frontend
1. Go to: `https://yourdomain.vercel.app/`
2. Should see landing page
3. Try signup: `/signup`
4. Try login: `/login`

### 5.4 Test Auth Flow
1. **Sign up** with test account
2. Should redirect to **Dashboard**
3. Click "Create Campaign"
4. Fill form and generate campaign
5. Check Dashboard - should see campaign in history

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain
1. Go to Vercel Project → "Settings" → "Domains"
2. Enter your domain
3. Vercel provides DNS records to add

### 6.2 Update CORS
Update `CLIENT_ORIGIN` environment variable to your custom domain:
```
CLIENT_ORIGIN = https://yourdomain.com
```

---

## Step 7: Monitoring & Maintenance

### 7.1 Set Up Error Tracking
Monitor your deployment at:
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com

### 7.2 View Production Logs
1. Vercel Project → "Logs"
2. Monitor for errors
3. Check MongoDB Atlas → Monitoring for connection issues

### 7.3 Database Backups
MongoDB Atlas free tier includes:
- Automatic daily backups (35 days retention)
- Point-in-time recovery

### 7.4 API Key Rotation Schedule
- Rotate `AI_API_KEY` every 90 days
- Generate new `SESSION_SECRET` if compromised
- Update in Vercel environment variables

---

## Troubleshooting

### Issue: "MONGODB_URI is missing"
**Solution:** Check Vercel environment variables are set correctly
```bash
# Verify in Vercel Project Settings → Environment Variables
# Should show MONGODB_URI with your MongoDB connection string
```

### Issue: "Unauthorized" on API requests
**Solution:** Session cookie not working
```javascript
// Check app.js has:
secure: true,  // for production
sameSite: 'none'  // for cross-domain
```

### Issue: "CORS blocked" error in browser
**Solution:** Update CLIENT_ORIGIN
```bash
# In Vercel environment variables:
CLIENT_ORIGIN = https://your-actual-vercel-domain.vercel.app
```

### Issue: Build fails with "Cannot find module"
**Solution:** Run locally first
```bash
npm install
npm run build
npm run start
# Test everything works
```

### Issue: Workflow endpoints return 500
**Solution:** Check MongoDB connection
```bash
# In MongoDB Atlas:
1. Verify cluster is running
2. Check IP whitelist includes Vercel IPs
3. Verify DATABASE_URI is correct
```

### MongoDB IP Whitelist
1. MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Option 1: Allow 0.0.0.0/0 (less secure, easier)
4. Option 2: Add Vercel IPs (more secure)

---

## Production Checklist

- [ ] API key rotated
- [ ] SESSION_SECRET generated and strong
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Connection string saved securely
- [ ] `.gitignore` created
- [ ] `vercel.json` created
- [ ] Environment variables set in Vercel
- [ ] Deploy successful (no build errors)
- [ ] `/api/health` returns 200
- [ ] Frontend loads at root domain
- [ ] Can sign up and create account
- [ ] Can generate campaign
- [ ] Campaign appears in history
- [ ] Can view saved campaigns
- [ ] No sensitive data in logs

---

## Final Notes

✅ **You're ready to deploy when:**
1. All credentials rotated
2. Environment variables set
3. MongoDB Atlas running
4. Tests pass locally
5. All checklist items complete

⏱️ **Expected time:** 30-45 minutes

📞 **Need help?**
- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Check Vercel logs for specific errors

---

**Your app is now production-ready! 🚀**
