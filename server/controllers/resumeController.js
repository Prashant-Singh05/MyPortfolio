import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESUMES_DIR = path.join(__dirname, '../public/resumes');
const PDF_FILENAME = 'Prashant_Singh_Resume.pdf';
const DOCX_FILENAME = 'Prashant_Singh_Resume.docx';

/**
 * Controller to handle resume downloads and preview
 */
export const downloadPdf = (req, res) => {
  const filePath = path.join(RESUMES_DIR, PDF_FILENAME);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'Resume PDF document not found on server.',
    });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.download(filePath, PDF_FILENAME, (err) => {
    if (err && !res.headersSent) {
      console.error('Error serving PDF resume:', err);
      res.status(500).json({ success: false, error: 'Failed to download PDF resume.' });
    }
  });
};

export const downloadDocx = (req, res) => {
  const filePath = path.join(RESUMES_DIR, DOCX_FILENAME);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'Resume Word document (.docx) not found on server.',
    });
  }

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
  res.download(filePath, DOCX_FILENAME, (err) => {
    if (err && !res.headersSent) {
      console.error('Error serving DOCX resume:', err);
      res.status(500).json({ success: false, error: 'Failed to download DOCX resume.' });
    }
  });
};

export const viewPdf = (req, res) => {
  const filePath = path.join(RESUMES_DIR, PDF_FILENAME);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'Resume PDF document not found for preview.',
    });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="Prashant_Singh_Resume.pdf"');
  res.sendFile(filePath);
};
