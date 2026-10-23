'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Global Page Transition Template
 * Automatically wraps every route change with a clean, hardware-accelerated fade-and-glide entrance.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex-1 flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
