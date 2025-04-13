import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright">
          &copy; {currentYear} 吃掉那只青蛙 | 基于Brian Tracy的理念
        </p>
      </div>
    </footer>
  );
};

export default Footer;
