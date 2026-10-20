import React from 'react';
import { motion } from 'motion/react';
import './Hero.css';

/**
 * Hero Component
 * Renders the central retro PORTFOLIO watermark heading.
 */
function Hero({ isDesktopEntering = false, prefersReducedMotion = false }) {
  return (
    <header className="hero-header portfolio-header" aria-label="Portfolio Title Banner">
      <motion.div
        className="hero-heading-wrapper portfolio-heading-wrapper"
        initial={isDesktopEntering && !prefersReducedMotion ? { scale: 0.94, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.48, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="hero-heading portfolio-heading">PORTFOLIO</h1>
      </motion.div>
    </header>
  );
}

export default Hero;
