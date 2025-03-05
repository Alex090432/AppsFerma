import React from 'react';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Добро пожаловать в AppsFerma</h1>
          <p>Создаем современные веб-приложения для вашего бизнеса</p>
          <button className="cta-button">Начать проект</button>
        </div>
      </section>

      <section className="features-section">
        <h2>Наши преимущества</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Современные технологии</h3>
            <p>Используем передовые инструменты разработки</p>
          </div>
          <div className="feature-card">
            <h3>Опытная команда</h3>
            <p>Профессионалы с многолетним опытом</p>
          </div>
          <div className="feature-card">
            <h3>Быстрая разработка</h3>
            <p>Эффективные процессы и методологии</p>
          </div>
          <div className="feature-card">
            <h3>Поддержка 24/7</h3>
            <p>Всегда на связи с клиентами</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Готовы начать свой проект?</h2>
        <p>Свяжитесь с нами для бесплатной консультации</p>
        <button className="cta-button">Связаться с нами</button>
      </section>
    </div>
  );
};

export default HomePage; 