import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const SERVICE_ID = 'fynix_wallet';      // Replace with your EmailJS service ID
const TEMPLATE_ID = 'template_vo3gbpn';    // Replace with your EmailJS template ID
const USER_ID = 'X-wQx6ye8TNdQYYj1';         // Replace with your EmailJS public key (user ID)

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields.');
      return;
    }
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Send message using EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, USER_ID)
      .then(() => setSubmitted(true))
      .catch(() => alert('Failed to send the message. Please try again.'));

  };

  if (submitted) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Thank you!</h2>
        <p>Your message has been received. We will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '20px auto', padding: 20 }}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, margin: '8px 0', boxSizing: 'border-box' }}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, margin: '8px 0', boxSizing: 'border-box' }}
            required
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            style={{ width: '100%', padding: 8, margin: '8px 0', boxSizing: 'border-box' }}
            rows={5}
            required
          />
        </label>
        <br />
        <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 6 }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
