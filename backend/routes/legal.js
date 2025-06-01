import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * /legal/terms:
 *   get:
 *     summary: Get the Terms of Service HTML page
 *     tags: [Legal]
 *     responses:
 *       200:
 *         description: Returns the Terms of Service page (HTML)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
// Serve Terms of Service
router.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/main-pages/outside-app/terms/terms.html'));
});

/**
 * @swagger
 * /legal/privacy:
 *   get:
 *     summary: Get the Privacy Policy HTML page
 *     tags: [Legal]
 *     responses:
 *       200:
 *         description: Returns the Privacy Policy page (HTML)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
// Serve Privacy Policy
router.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/main-pages/outside-app/privacy/privacy.html'));
});

export default router;
