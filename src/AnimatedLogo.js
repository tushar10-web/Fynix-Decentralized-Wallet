import React from 'react';
import { motion } from 'framer-motion';
import logo from './fynix.png';

const FloatingShape = ({ style, animationDuration = 10, delay = 0 }) => (
  <motion.div
    initial={{ y: 0, x: 0, opacity: 0.4 }}
    animate={{ y: [0, -20, 0], x: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }}
    transition={{
      duration: animationDuration,
      repeat: Infinity,
      repeatType: 'mirror',
      delay,
      ease: 'easeInOut',
    }}
    style={{
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(59, 130, 246, 0.4)', // Blue tone
      ...style,
      zIndex: 1,
      pointerEvents: 'none',
    }}
  />
);

const AnimatedLogo = ({ onAnimationComplete }) => (
  <div
    style={{
      position: 'relative',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)', // Dark navy background
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {/* Floating shapes */}
    <FloatingShape style={{ width: 100, height: 100, top: '20%', left: '15%' }} animationDuration={14} delay={0} />
    <FloatingShape style={{ width: 80, height: 80, top: '60%', left: '10%' }} animationDuration={12} delay={3} />
    <FloatingShape style={{ width: 150, height: 150, top: '40%', right: '15%' }} animationDuration={16} delay={1} />
    <FloatingShape style={{ width: 60, height: 60, bottom: '15%', right: '25%' }} animationDuration={13} delay={2} />

    {/* Animated logo */}
    <motion.img
      src={logo}
      alt="Fynix Logo"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5 }}
      onAnimationComplete={onAnimationComplete}
      style={{
        width: 250,
        height: 'auto',
        objectFit: 'contain',
        zIndex: 10,
        borderRadius: 22,
        boxShadow: '0 10px 40px rgba(59, 130, 246, 0.9)',
        position: 'relative',
      }}
    />
  </div>
);

export default AnimatedLogo;
