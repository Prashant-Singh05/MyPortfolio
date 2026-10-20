import express from 'express';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact - Submit a contact message (saved to MongoDB)
router.post('/', submitContact);

export default router;
