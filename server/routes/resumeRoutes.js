import express from 'express';
import {
  downloadPdf,
  downloadDocx,
  viewPdf,
} from '../controllers/resumeController.js';

const router = express.Router();

// GET /api/resume/pdf - Download resume as PDF
router.get('/pdf', downloadPdf);

// GET /api/resume/docx - Download resume as Microsoft Word DOCX
router.get('/docx', downloadDocx);

// GET /api/resume/view - Preview resume PDF inline in browser
router.get('/view', viewPdf);

export default router;
