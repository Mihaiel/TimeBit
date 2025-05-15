import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Terms of Service
router.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/main-pages/outside-app/terms/terms.html'));
});

// Serve Privacy Policy
router.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/main-pages/outside-app/privacy/privacy.html'));
});

export default router;
