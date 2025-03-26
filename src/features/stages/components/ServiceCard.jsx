import React from 'react';

const ServiceCard = ({ service, onRemove }) => {
  return (
    <div className="service-card">
      <div className="service-info">
        <span className="service-icon">{service.icon}</span>
        <span className="service-name">{service.name}</span>
      </div>
      <button 
        className="remove-service" 
        onClick={() => onRemove(service.id)}
        title="Remove service"
      >
        ×
      </button>
    </div>
  );
};

export default ServiceCard; 