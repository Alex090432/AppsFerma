import React, { useState, useEffect } from 'react';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('api/startup/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1>Панель администратора</h1>
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1>Панель администратора</h1>
          <div className="error">Ошибка: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Панель администратора</h1>
        <div className="services-section">
          <h2>Активные микросервисы</h2>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-status">
                  <span className={`status-indicator ${service.isRunning ? 'running' : 'stopped'}`}></span>
                  {service.isRunning ? 'Работает' : 'Остановлен'}
                </div>
                <h3>{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-details">
                  <p><strong>URL:</strong> {service.url}</p>
                  <p><strong>Версия:</strong> {service.version}</p>
                  <p><strong>Последний запуск:</strong> {new Date(service.lastStartTime).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 