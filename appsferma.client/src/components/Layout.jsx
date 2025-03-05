import React from 'react';
import Footer from './Footer';
import '../styles/Layout.css';

const Layout = ({ children, onPageChange }) => {
  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="logo" onClick={() => onPageChange('home')}>AppsFerma</div>
          <ul className="nav-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); onPageChange('home'); }}>Главная</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onPageChange('about'); }}>О нас</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onPageChange('services'); }}>Услуги</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onPageChange('contact'); }}>Контакты</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onPageChange('admin'); }} className="admin-link">Админка</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;