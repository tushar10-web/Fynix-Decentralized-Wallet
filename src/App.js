import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import AnimatedLogo from './AnimatedLogo';
import CryptoPrices from './CryptoPrices';
import Create from './Create';
import Login from './Login';
import Contact from './Contact';

function App() {
  const [showHomepage, setShowHomepage] = useState(false);

  const handleAnimationComplete = () => {
    setShowHomepage(true);
  };

  const navLinks = [
    { name: 'Create', path: '/create' },
    { name: 'Login', path: '/login' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Home', path: '/' },
  ];

  if (!showHomepage) {
    return <AnimatedLogo onAnimationComplete={handleAnimationComplete} />;
  }

  return (
    <Router>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          padding: '15px 0',
          backgroundColor: '#1e293b',
          fontWeight: '600',
          fontSize: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        {navLinks.map(({ name, path }) => (
          <Link
            key={name}
            to={path}
            style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: 6,
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {name}
          </Link>
        ))}
      </nav>

      <Routes>
        <Route
          path="/"
          element={<CryptoPricesWithLoader />}
        />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

// Wrapper component handling loading state of live crypto prices
function CryptoPricesWithLoader() {
  const [loading, setLoading] = React.useState(true);

  // Provide a callback to CryptoPrices to notify when data has loaded
  const handleDataLoaded = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)',
            zIndex: 9999,
          }}
        >
          <ClipLoader size={60} color="#3b82f6" />
        </div>
      )}

      <main style={{ padding: '20px' }}>
        <h1>Welcome to Fynix Wallet</h1>
        <p>Explore the decentralized crypto wallet with security and ease.</p>
        <section id="crypto-images">
          <CryptoPrices onDataLoaded={handleDataLoaded} />
        </section>
      </main>
    </>
  );
}

export default App;
