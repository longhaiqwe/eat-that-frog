import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

/**
 * 
 */
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">
          <Link to="/">吃掉那只青蛙</Link>
        </h1>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">主页</Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className="nav-link">历史</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
