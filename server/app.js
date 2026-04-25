import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import workflowRoutes from "./routes/workflow.js";
import campaignHistoryRoutes from "./routes/campaignHistory.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || true,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use('/api', authRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/campaigns', campaignHistoryRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API working ✅' });
});

export default app;