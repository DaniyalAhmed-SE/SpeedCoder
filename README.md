# SpeedCoder

C/C++ coding practice platform — AI judged, no execution sandbox needed.

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
# create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/speedcoder.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to vercel.com → Sign up free with your GitHub account
2. Click **Add New Project**
3. Import your `speedcoder` repo
4. Click **Deploy** — Vercel auto-detects the config

### 3. Add your Gemini API key
1. In your Vercel project dashboard → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

That's it. Your app is live at `https://your-project.vercel.app`

## Project Structure
```
speedcoder/
├── api/
│   └── evaluate.js      ← Vercel serverless function (Gemini proxy)
├── public/
│   └── index.html       ← The full frontend
└── vercel.json          ← Vercel routing config
```

## How the API key stays safe
- Key lives in Vercel environment variables — never in your code
- Frontend calls `/api/evaluate` (your own proxy)
- Proxy forwards to Gemini with the key server-side
- Users never see the key, even in devtools

## Getting a Gemini API key
1. Go to aistudio.google.com
2. Sign in with Google
3. Click **Get API Key** → **Create API key**
4. Free tier is generous — plenty for a portfolio project
