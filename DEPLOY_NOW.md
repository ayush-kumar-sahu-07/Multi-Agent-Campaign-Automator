# 🚀 VERCEL DEPLOYMENT - FINAL GUIDE

## Status: ✅ PROJECT IS NOW DEPLOYMENT-READY

All code fixes have been applied. Your project is ready to deploy to Vercel!

---

## 📋 CRITICAL ACTIONS (DO THIS FIRST - 10 MINUTES)

### Step 1: Rotate Your Exposed API Key 🔴 URGENT

Your OpenRouter API key is exposed in git history:
```
[REDACTED_EXPOSED_KEY_REVOKED]
```

**Action Required:**
1. Go to: https://openrouter.ai/account/api-keys
2. **DELETE** the exposed key above
3. **CREATE** a new API key
4. **COPY** the new key
5. You'll add it to Vercel environment variables in Step 4

**⏱️ Time: 3 minutes**

---

### Step 2: Create MongoDB Atlas Account (FREE) 🟢

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Create organization (skip suggestions)
4. Click "Build a Cluster"
5. Select **M0 Sandbox** (FREE tier - plenty for development/testing)
6. Choose region closest to you
7. Click "Create Cluster" (wait 5 minutes for creation)

**⏱️ Time: 10 minutes**

---

### Step 3: Setup MongoDB Database User & Get Connection String

#### 3A: Create Database User
1. Go to "Database Access" section
2. Click "Add New Database User"
3. **Username:** `automator_user`
4. **Password:** Generate secure password (copy and save it!)
5. **Database User Privileges:** `readWriteAnyDatabase`
6. Click "Add User"

#### 3B: Get Connection String
1. Go to "Database" section  
2. Click "Connect" on your cluster
3. Choose "Drivers" → "Node.js"
4. Copy the connection string

**It looks like:**
```
mongodb+srv://automator_user:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority&appName=workflow-automator
```

Replace `<password>` with your password from 3A

**Example:**
```
mongodb+srv://automator_user:MySecurePassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority&appName=workflow-automator
```

**⏱️ Time: 5 minutes**

---

### Step 4: Generate Strong SESSION_SECRET

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy the 64-character output** - you'll need it for Vercel.

**⏱️ Time: 1 minute**

---

## ✅ CODE CHANGES COMPLETED

The following fixes have already been applied:

✅ Fixed `server/.env.example` - Production template  
✅ Fixed `server/config/db.js` - NODE_ENV validation  
✅ Fixed `server/app.js` - CORS for production  
✅ Fixed `server/app.js` - Session cookie security  
✅ Fixed `src/services/api.js` - Better URL handling  
✅ Fixed `vite.config.js` - Build optimizations  
✅ Fixed `server/index.js` - Environment logging  
✅ Created `server/utils/validateEnv.js` - Validation  
✅ Updated `server/.env` - Secure defaults  
✅ Created `.gitignore` - Prevent secret commits  
✅ Created `vercel.json` - Vercel configuration  
✅ Installed `terser` - Build dependency  
✅ Verified build succeeds - `npm run build` ✓  

---

## 🚀 DEPLOY TO VERCEL (15 MINUTES)

### Step 1: Commit Your Changes

```bash
git add .
git commit -m "fix: apply all Vercel deployment fixes and configuration"
git push origin main
```

If you haven't set up git yet:
```bash
git init
git add .
git commit -m "initial: multi-agent workflow automator project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**⏱️ Time: 5 minutes**

---

### Step 2: Create Vercel Project

1. Go to: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"
5. Configure project settings:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

**⏱️ Time: 3 minutes**

---

### Step 3: Set Environment Variables

In Vercel Project Settings → "Environment Variables", add each one:

**Copy-Paste These Exactly:**

```
VITE_API_BASE_URL = https://[YOUR-VERCEL-PROJECT-NAME].vercel.app

MONGODB_URI = mongodb+srv://automator_user:[YOUR_PASSWORD]@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority&appName=workflow-automator

SESSION_SECRET = [YOUR_64_CHAR_HEX_STRING]

AI_PROVIDER = openrouter

AI_API_KEY = [YOUR_NEW_ROTATED_KEY]

AI_MODEL = meta-llama/llama-3.1-8b-instruct

CLIENT_ORIGIN = https://[YOUR-VERCEL-PROJECT-NAME].vercel.app

NODE_ENV = production
```

**Replace:**
- `[YOUR-VERCEL-PROJECT-NAME]` = Your actual Vercel project name (shown after deployment)
- `[YOUR_PASSWORD]` = Your MongoDB password
- `[YOUR_64_CHAR_HEX_STRING]` = From Step 4 above
- `[YOUR_NEW_ROTATED_KEY]` = Your new OpenRouter API key

**⏱️ Time: 5 minutes**

---

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build and deployment
3. Vercel will show "Deployment Successful!" ✅

**⏱️ Time: 3 minutes**

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify everything works:

### 1. Check Build Logs
- Go to Vercel Project → "Deployments"
- Click latest deployment
- View "Build Logs"
- Look for:
  - ✅ `npm install` success
  - ✅ `npm run build` success  
  - ✅ No errors

### 2. Test Health Endpoint
- Get your Vercel URL (shown after deployment)
- Open in browser:
  ```
  https://[YOUR-VERCEL-URL]/api/health
  ```
- Should see JSON response:
  ```json
  {
    "ok": true,
    "service": "multi-agent-workflow-api",
    "environment": "production"
  }
  ```

### 3. Test Frontend Loads
- Open: `https://[YOUR-VERCEL-URL]/`
- Should see landing page
- All buttons clickable

### 4. Test Auth Flow
1. Click "Sign Up"
2. Create test account (email, password)
3. Should redirect to Dashboard
4. Click "Create Campaign"
5. Fill out form
6. Generate campaign
7. Check if it appears in Dashboard history
8. Click "Open Brief" to verify it reloads

### 5. Check MongoDB Connection
- Go to MongoDB Atlas dashboard
- Click "Database" 
- Should show activity/connections
- No connection errors

---

## 🐛 TROUBLESHOOTING

### Issue: Build fails with "terser not found"
**Solution:** Already fixed (terser installed). If it happens again:
```bash
npm install terser --save-dev
npm run build
```

### Issue: API returns "MONGODB_URI is missing"
**Solution:** Check Vercel environment variables are set:
1. Go to Project Settings → Environment Variables
2. Verify `MONGODB_URI` is present
3. Verify it contains your MongoDB password (not `<password>`)
4. Redeploy

### Issue: "CORS blocked" in browser console
**Solution:** CLIENT_ORIGIN mismatch
1. Go to Vercel deployments
2. Copy your actual URL
3. Update `CLIENT_ORIGIN` env var in Vercel
4. Redeploy

### Issue: "Unauthorized" when trying to sign up
**Solution:** SESSION_SECRET not set or too weak
1. Check `SESSION_SECRET` is set in Vercel env vars
2. Verify it's 64 characters (generated with crypto command)
3. If weak, regenerate and update

### Issue: Database shows "connection timeout"
**Solution:** MongoDB IP whitelist issue
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

---

## 📊 WHAT'S BEEN DONE

### Code Fixes Applied ✅
- Production-ready CORS configuration
- Secure session cookies (httpOnly, secure, sameSite)
- Environment validation
- Better error handling
- Build optimizations with code splitting
- Production/development environment checks

### Configuration Files ✅
- `.gitignore` - Prevents accidental secret commits
- `vercel.json` - Vercel deployment configuration
- `server/.env.example` - Production template
- `.env` files configured with secure defaults

### Dependencies ✅
- All required packages installed
- Build process verified
- Production build generated (dist/)

---

## 🎯 SUCCESS CRITERIA

Your deployment is successful when:

✅ Vercel shows "Deployment Successful"  
✅ `/api/health` returns JSON response  
✅ Frontend loads at your domain  
✅ Can sign up and create account  
✅ Can generate campaign  
✅ Campaign appears in history  
✅ Can reopen saved campaigns  
✅ No errors in browser console  
✅ No errors in Vercel logs  
✅ MongoDB shows active connections  

---

## 📞 QUICK REFERENCE

**Vercel Dashboard:** https://vercel.com/dashboard  
**MongoDB Atlas:** https://cloud.mongodb.com  
**OpenRouter API Keys:** https://openrouter.ai/account/api-keys  
**Your App URL:** https://[YOUR-PROJECT-NAME].vercel.app  

---

## 🔐 SECURITY NOTES

1. **Never commit real API keys to git**
   - `.gitignore` already prevents this
   - Always use Vercel environment variables

2. **Keep MongoDB credentials safe**
   - Password should be strong (16+ characters)
   - Store in Vercel only, not in code

3. **Rotate keys regularly**
   - Rotate OpenRouter API key every 90 days
   - Generate new SESSION_SECRET if compromised
   - Update in Vercel environment variables

4. **Monitor your usage**
   - Check OpenRouter API usage
   - Monitor MongoDB storage quota
   - Review Vercel logs for errors

---

## 🎉 FINAL STEPS

1. ✅ Rotate API key (CRITICAL)
2. ✅ Create MongoDB Atlas account
3. ✅ Generate SESSION_SECRET
4. ✅ Git commit and push
5. ✅ Create Vercel project
6. ✅ Set environment variables
7. ✅ Deploy
8. ✅ Verify all tests pass

**Total Time: ~1.5 hours**

---

**Your project is now deployment-ready! 🚀**

**Next action:** Follow Steps 1-4 above (10 minutes), then Steps 1-4 in "DEPLOY TO VERCEL" section (15 minutes).

You'll be live in approximately 25 minutes!
