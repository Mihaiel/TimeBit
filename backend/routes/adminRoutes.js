import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Admin page route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin-page/admin.html'));
});

// Admin CSS route
router.get('/admin.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin-page/admin.css'));
});

export default router; 