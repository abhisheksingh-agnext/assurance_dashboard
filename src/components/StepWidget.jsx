import React from 'react';
import ServiceCard from './ServiceCard';
import './StepWidget.css';

const StepWidget = ({
  step,
  editingField,
  onEdit,
  onEditSave,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveService,
  isLastStep,
  index,
  onStepDragStart,
  onStepDragEnd,
  onStepDragOver,
  onStepDrop,
  onAddStep,
  onDeleteStep
}) => {
  return (
    <div 
      className="step-container"
      draggable
      onDragStart={(e) => onStepDragStart(e, step.id, index)}
      onDragEnd={onStepDragEnd}
      onDragOver={(e) => onStepDragOver(e, index)}
      onDrop={(e) => onStepDrop(e, index)}
    >
      <div 
        className={`step-widget ${!step.services?.length ? 'empty-step' : ''}`}
      >
        <div className="step-actions">
          <button
            className="delete-step-button"
            onClick={() => onDeleteStep(step.id)}
        
          >
            <span className="delete-icon">×</span>
          </button>
        </div>

        <div className="step-header">
          <div className="step-title">
            {editingField === `${step.id}-title` ? (
              <input
                type="text"
                className="edit-input"
                defaultValue={step.title}
                autoFocus
                onKeyDown={(e) => onEditSave(e, step.id, 'title')}
                onBlur={(e) => onEditSave(e, step.id, 'title')}
              />
            ) : (
              <h3 onClick={() => onEdit(step.id, 'title')}>
                {step.title}
                <span className="edit-icon">✎</span>
              </h3>
            )}
          </div>
        </div>
        
        {editingField === `${step.id}-description` ? (
          <textarea
            className="edit-input description-input"
            defaultValue={step.description}
            autoFocus
            onKeyDown={(e) => onEditSave(e, step.id, 'description')}
            onBlur={(e) => onEditSave(e, step.id, 'description')}
          />
        ) : (
          <p onClick={() => onEdit(step.id, 'description')}>
            {step.description}
          </p>
        )}
        
        {step.services?.length > 0 ? (
          <div className="services-container">
            <h4>Added Services ({step.services.length})</h4>
            <div className="service-cards" 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, step.id)}
            >
              {step.services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onRemove={(serviceId) => onRemoveService(step.id, serviceId)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="drop-overlay" 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, step.id)}
          >
            <span className="drop-icon">⬇️</span>
            <p>Drop services here</p>
          </div>
        )}
           {!isLastStep && (
        <div className="flow-actions">
          <div className="flow-arrow" />
          <button 
            className="add-step-button"
            onClick={onAddStep}
            title="Add new step"
          >
            <span className="add-icon">+</span>
          </button>
        </div>
      )}
      </div>
   
    </div>
  );
};

export default StepWidget; 