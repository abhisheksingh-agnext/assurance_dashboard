import React from 'react';

const JsonPreviewModal = ({ steps, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Configuration JSON Preview</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <pre className="json-preview">
          {JSON.stringify(steps, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default JsonPreviewModal; 