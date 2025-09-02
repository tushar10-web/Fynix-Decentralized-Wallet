import React from 'react';
import { motion } from 'framer-motion';
import logo from './src/fynix.png';

const AnimatedLogo = ({ onAnimationComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
      onAnimationComplete={onAnimationComplete}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <img src={logo} alt="Fynix Logo" style={{ width: 150, height: 150 }} />
    </motion.div>
  );
};

export default AnimatedLogo;
