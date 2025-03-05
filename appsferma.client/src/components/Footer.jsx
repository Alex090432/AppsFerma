import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>О нас</h3>
          <p>AppsFerma - ваш надежный партнер в разработке современных веб-приложений</p>
        </div>
        
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>Email: info@appsferma.com</p>
          <p>Телефон: +7 (XXX) XXX-XX-XX</p>
          <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
        </div>
        
        <div className="footer-section">
          <h3>Социальные сети</h3>
          <div className="social-links">
            <a href="#" className="social-link">VK</a>
            <a href="#" className="social-link">Telegram</a>
            <a href="#" className="social-link">GitHub</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AppsFerma. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer; 