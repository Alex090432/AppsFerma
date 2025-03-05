import React, { useState, useEffect } from 'react';
import '../styles/AdminPage.css';

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

const DataType = {
  FILES: 'FILES',
  TABLE: 'TABLE',
  TEXT: 'TEXT'
};

const AdminPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({
    id: crypto.randomUUID(),
    name: '',
    http_methods: [],
    endpoints: [],
    input_type: DataType.TEXT,
    type_result: DataType.TEXT,
    author: '',
    params: '',
    description: '',
    notes: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/microservices/services');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const processedData = data.map(service => ({
          ...service,
          http_methods: service.http_methods || [],
          endpoints: service.endpoints || [],
          input_type: service.input_type || DataType.TEXT,
          type_result: service.type_result || DataType.TEXT
        }));
        setServices(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHttpMethodChange = (e) => {
    const { value, checked } = e.target;
    setNewService(prev => ({
      ...prev,
      http_methods: checked 
        ? [...prev.http_methods, HttpMethod[value]]
        : prev.http_methods.filter(method => method !== HttpMethod[value])
    }));
  };

  const handleEndpointChange = (e) => {
    const endpoints = e.target.value.split(',').map(endpoint => endpoint.trim());
    setNewService(prev => ({
      ...prev,
      endpoints
    }));
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот сервис?')) {
      return;
    }

    try {
      const response = await fetch(`/api/microservices/services/${serviceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении сервиса');
      }

      setServices(prev => prev.filter(service => service.id !== serviceId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setNewService({
      id: service.id,
      name: service.name,
      http_methods: service.http_methods,
      endpoints: service.endpoints,
      input_type: service.input_type,
      type_result: service.type_result,
      author: service.author,
      params: service.params,
      description: service.description,
      notes: service.notes
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingService 
        ? `/api/microservices/services/${editingService.id}`
        : '/api/microservices/services';
      
      const method = editingService ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newService.id,
          name: newService.name,
          http_methods: newService.http_methods,
          endpoints: newService.endpoints,
          input_type: newService.input_type,
          type_result: newService.type_result,
          author: newService.author,
          params: newService.params,
          description: newService.description,
          notes: newService.notes
        })
      });

      if (!response.ok) {
        throw new Error(editingService ? 'Ошибка при обновлении сервиса' : 'Ошибка при добавлении сервиса');
      }

      const updatedService = await response.json();
      
      if (editingService) {
        setServices(prev => prev.map(service => 
          service.id === editingService.id ? updatedService : service
        ));
      } else {
        setServices(prev => [...prev, updatedService]);
      }

      setNewService({
        id: crypto.randomUUID(),
        name: '',
        http_methods: [],
        endpoints: [],
        input_type: DataType.TEXT,
        type_result: DataType.TEXT,
        author: '',
        params: '',
        description: '',
        notes: ''
      });
      setEditingService(null);
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="admin-container">Загрузка...</div>;
  if (error) return <div className="admin-container">Ошибка: {error}</div>;

  return (
    <div className="admin-container">
      <h1>Панель администратора</h1>
      
      <div className="admin-controls">
        <button 
          className="add-service-btn"
          onClick={() => {
            setEditingService(null);
            setNewService({
              id: crypto.randomUUID(),
              name: '',
              http_methods: [],
              endpoints: [],
              input_type: DataType.TEXT,
              type_result: DataType.TEXT,
              author: '',
              params: '',
              description: '',
              notes: ''
            });
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? 'Отмена' : 'Добавить сервис'}
        </button>
      </div>

      {showAddForm && (
        <form className="service-form" onSubmit={handleSubmit}>
          <h2>{editingService ? 'Редактировать сервис' : 'Добавить новый сервис'}</h2>
          <div className="form-group">
            <label htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              value={newService.id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Название:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newService.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>HTTP методы:</label>
            <div className="checkbox-group">
              {Object.values(HttpMethod).map(method => (
                <label key={method} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={method}
                    checked={newService.http_methods.includes(HttpMethod[method])}
                    onChange={handleHttpMethodChange}
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="endpoints">Эндпоинты (через запятую):</label>
            <input
              type="text"
              id="endpoints"
              name="endpoints"
              value={newService.endpoints.join(', ')}
              onChange={handleEndpointChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="input_type">Тип входных данных:</label>
            <select
              id="input_type"
              name="input_type"
              value={newService.input_type}
              onChange={handleInputChange}
              required
            >
              {Object.values(DataType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="type_result">Тип результата:</label>
            <select
              id="type_result"
              name="type_result"
              value={newService.type_result}
              onChange={handleInputChange}
              required
            >
              {Object.values(DataType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="author">Автор:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={newService.author}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="params">Параметры:</label>
            <input
              type="text"
              id="params"
              name="params"
              value={newService.params}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              name="description"
              value={newService.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Заметки:</label>
            <textarea
              id="notes"
              name="notes"
              value={newService.notes}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="submit-btn">
            {editingService ? 'Сохранить изменения' : 'Добавить'}
          </button>
        </form>
      )}

      <section className="services-section">
        <h2>Активные микросервисы</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-header">
                <h3>{service.name}</h3>
                <div className="service-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(service)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(service.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <p>{service.description}</p>
              <div className="service-details">
                <p><strong>ID:</strong> {service.id}</p>
                <p><strong>HTTP методы:</strong> {Array.isArray(service.http_methods) ? service.http_methods.join(', ') : ''}</p>
                <p><strong>Эндпоинты:</strong> {Array.isArray(service.endpoints) ? service.endpoints.join(', ') : ''}</p>
                <p><strong>Тип входных данных:</strong> {service.input_type}</p>
                <p><strong>Тип результата:</strong> {service.type_result}</p>
                <p><strong>Автор:</strong> {service.author}</p>
                <p><strong>Параметры:</strong> {service.params}</p>
                <p><strong>Заметки:</strong> {service.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;