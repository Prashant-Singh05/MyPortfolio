import Contact from '../models/Contact.js';
import mongoose from 'mongoose';

/**
 * Controller to handle contact form submissions.
 * Endpoint: POST /api/contact
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your name.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your email address.',
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message.',
      });
    }

    // Verify MongoDB connection state
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database connection is temporarily unavailable. Please try again shortly.',
      });
    }

    // Save contact document to MongoDB
    const contactDoc = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been saved successfully.',
      data: {
        id: contactDoc._id,
        createdAt: contactDoc.createdAt,
      },
    });
  } catch (error) {
    console.error('[ContactController] Error saving contact submission:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. '),
      });
    }

    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your message. Please try again later.',
    });
  }
};
