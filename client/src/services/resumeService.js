/**
 * Resume Service
 * Manages downloading and viewing Prashant Singh's verified resume documents
 * via the Express backend REST API (/api/resume/pdf, /api/resume/docx, /api/resume/view).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Triggers a real browser download for either PDF or Word (.docx) resume.
 *
 * @param {'pdf' | 'docx'} format - File format to download
 * @returns {Promise<boolean>} Resolves to true on successful download
 */
export async function downloadResume(format) {
  const fileExt = format.toLowerCase() === 'docx' ? 'docx' : 'pdf';
  const fileName = `Prashant_Singh_Resume.${fileExt}`;
  const endpoint = `${API_BASE_URL}/resume/${fileExt}`;

  try {
    let response;
    try {
      response = await fetch(endpoint);
    } catch (networkErr) {
      console.warn('API endpoint unreachable, trying static fallback:', networkErr);
      response = await fetch(`/resumes/${fileName}`);
    }

    if (!response || !response.ok) {
      // If primary failed, try static fallback
      response = await fetch(`/resumes/${fileName}`);
    }

    if (!response.ok) {
      let errorMsg = `Server responded with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.error) errorMsg = errorJson.error;
      } catch {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (err) {
    console.error(`Failed to download ${format.toUpperCase()} resume:`, err);
    throw err;
  }
}

/**
 * Returns the URL for viewing the PDF inline in a browser tab or iframe.
 */
export function getResumeViewUrl() {
  return `${API_BASE_URL}/resume/view`;
}
