import React from 'react';
import './ServicesPanel.css';

const ServicesPanel = ({ 
  services, 
  activeService, 
  isDragging, 
  onServiceClick, 
  onDragStart, 
  onDragEnd 
}) => {
  return (
    <div className="services-panel">
      <h2>Services</h2>
      <ul className="services-list">
        {services.map(service => (
          <li
            key={service.id}
            className={`${activeService === service.id ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
            draggable="true"
            onDragStart={(e) => onDragStart(e, service)}
            onDragEnd={onDragEnd}
            onClick={() => onServiceClick(service.id)}
          >
            <span className="service-icon">{service.icon}</span>
            {service.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesPanel; 