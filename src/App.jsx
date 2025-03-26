import { useState, useRef } from 'react'
import './App.css'
import ServicesPanel from './components/ServicesPanel'
import StepWidget from './components/StepWidget'
import JsonPreviewModal from './components/JsonPreviewModal'

function App() {
  // Initialize state with a default step
  const [steps, setSteps] = useState([{
    id: Date.now(),
    title: 'Stage 1',
    description: 'Drag services here to configure this stage',
    services: []
  }])
  const [activeService, setActiveService] = useState('inspection')
  const [isDragging, setIsDragging] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [showJsonPreview, setShowJsonPreview] = useState(false)
  const [draggedStepId, setDraggedStepId] = useState(null)
  const draggedIndex = useRef(null)

  /**
   * Available services that can be added to steps
   * Each service has an id, name, icon, and description
   */
  const services = [
    { 
      id: 'inspection', 
      name: 'Farming Inspection',
      icon: '🔍',
      description: 'Quality inspection and verification process'
    },
    { 
      id: 'bank_aud', 
      name: 'Bank Audit',
      icon: '🔍',
      description: 'Quality inspection and verification process'
    },
    { 
      id: 'lab_certification', 
      name: 'Lab certification',
      icon: '🧪',
      description: 'Quality inspection and verification process'
    },
    { 
      id: 'cold_store', 
      name: 'Cold Store',
      icon: '🧪',
      description: 'Laboratory testing and analysis'
    },
    { 
      id: 'analysis_report', 
      name: 'Analysis Report',
      icon: '📊',
      description: 'Quality assurance and control'
    }
  ]

  /**
   * Handles the start of a drag operation for a service
   * @param {DragEvent} e - The drag event
   * @param {Object} service - The service being dragged
   */
  const handleDragStart = (e, service) => {
    setIsDragging(true)
    e.dataTransfer.setData('application/json', JSON.stringify(service))
  }

  /**
   * Handles the end of a drag operation
   */
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  /**
   * Handles the drag over event for a step
   * Adds visual feedback when a service is dragged over a step
   * @param {DragEvent} e - The drag event
   */
  const handleServiceDragOver = (e) => {
    e.preventDefault()
    const stepElement = e.currentTarget.closest('.step-widget')
    if (stepElement) {
      stepElement.classList.add('drag-over')
    }
  }

  /**
   * Handles the drag leave event for a step
   * Removes visual feedback when a service is dragged out of a step
   * @param {DragEvent} e - The drag event
   */
  const handleStepDragLeave = (e) => {
    e.preventDefault()
    const stepElement = e.currentTarget.closest('.step-widget')
    if (stepElement) {
      stepElement.classList.remove('drag-over')
    }
  }

  /**
   * Handles dropping a service onto a step
   * Adds the service to the step if it's not already present
   * @param {DragEvent} e - The drop event
   * @param {string} stepId - The ID of the step receiving the service
   */
  const handleServiceDrop = (e, stepId) => {
    e.preventDefault()
    const stepElement = e.currentTarget.closest('.step-widget')
    if (stepElement) {
      stepElement.classList.remove('drag-over')
    }

    try {
      const serviceData = JSON.parse(e.dataTransfer.getData('application/json'))
      
      setSteps(steps.map(step => {
        if (step.id === stepId) {
          const services = step.services || []
          if (!services.find(s => s.id === serviceData.id)) {
            return {
              ...step,
              services: [...services, serviceData]
            }
          }
        }
        return step
      }))
    } catch (error) {
      console.error('Error adding service to step:', error)
    }
  }

  /**
   * Removes a service from a step
   * @param {string} stepId - The ID of the step containing the service
   * @param {string} serviceId - The ID of the service to remove
   */
  const removeService = (stepId, serviceId) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          services: step.services.filter(s => s.id !== serviceId)
        }
      }
      return step
    }))
  }

  /**
   * Adds a new step to the configuration
   * Automatically numbers the step based on existing steps
   */
  const addNewStep = () => {
    const newStep = {
      id: Date.now(),
      title: `Stage ${steps.length + 1}`,
      description: 'Drag services here to configure this stage',
      services: []
    }
    setSteps([...steps, newStep])
  }

  /**
   * Initiates editing of a step field (title or description)
   * @param {string} stepId - The ID of the step being edited
   * @param {string} field - The field to edit ('title' or 'description')
   */
  const handleEdit = (stepId, field) => {
    setEditingField(`${stepId}-${field}`)
  }

  /**
   * Saves changes to a step field when editing is complete
   * Saves on Enter key press or when focus is lost
   * @param {Event} e - The event triggering the save
   * @param {string} stepId - The ID of the step being edited
   * @param {string} field - The field being edited ('title' or 'description')
   */
  const handleEditSave = (e, stepId, field) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const newValue = e.target.value.trim()
      if (newValue) {
        setSteps(steps.map(step => 
          step.id === stepId ? { ...step, [field]: newValue } : step
        ))
      }
      setEditingField(null)
    }
  }

  /**
   * Starts dragging a step for reordering
   * @param {DragEvent} e - The drag event
   * @param {string} stepId - The ID of the step being dragged
   * @param {number} index - The index of the step in the array
   */
  const handleStepDragStart = (e, stepId, index) => {
    setDraggedStepId(stepId)
    draggedIndex.current = index
    e.currentTarget.classList.add('dragging')
    
    // Set data for Firefox compatibility
    e.dataTransfer.setData('text/plain', stepId)
    
    // Set the drag effect
    e.dataTransfer.effectAllowed = 'move'
  }

  /**
   * Handles when dragging a step ends
   * @param {DragEvent} e - The drag event
   */
  const handleStepDragEnd = (e) => {
    setDraggedStepId(null)
    draggedIndex.current = null
    e.currentTarget.classList.remove('dragging')
    
    // Remove all drag-over classes
    document.querySelectorAll('.drag-over-left, .drag-over-right').forEach(el => {
      el.classList.remove('drag-over-left', 'drag-over-right')
    })
  }

  /**
   * Handles dragover for steps reordering
   * @param {DragEvent} e - The drag event
   * @param {number} index - The index of the step being dragged over
   */
  const handleStepDragOver = (e, index) => {
    e.preventDefault()
    
    if (draggedStepId === null || draggedIndex.current === index) {
      return
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    const midpoint = rect.left + rect.width / 2
    
    // Clear previous indicators
    e.currentTarget.classList.remove('drag-over-left', 'drag-over-right')
    
    // Apply the appropriate class based on cursor position
    if (e.clientX < midpoint) {
      e.currentTarget.classList.add('drag-over-left')
    } else {
      e.currentTarget.classList.add('drag-over-right')
    }
  }

  /**
   * Handles dropping a step for reordering
   * @param {DragEvent} e - The drop event
   * @param {number} dropIndex - The index of the target drop location
   */
  const handleStepDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedStepId === null || draggedIndex.current === null) {
      return
    }
    
    // Get the midpoint to determine if dropping before or after
    const rect = e.currentTarget.getBoundingClientRect()
    const midpoint = rect.left + rect.width / 2
    const dropAfter = e.clientX >= midpoint
    
    // Calculate the final position
    let newIndex = dropAfter ? dropIndex + 1 : dropIndex
    
    // Adjust the index if we're moving a step forward
    if (draggedIndex.current < dropIndex) {
      newIndex--;
    }
    
    // Make a copy of the steps array
    const newSteps = [...steps]
    
    // Remove the dragged step
    const [draggedStep] = newSteps.splice(draggedIndex.current, 1)
    
    // Insert at the new position
    newSteps.splice(newIndex, 0, draggedStep)
    
    // Update the steps array
    setSteps(newSteps)
    
    // Reset drag state
    setDraggedStepId(null)
    draggedIndex.current = null
    
    // Update step titles if needed
    updateStepTitles(newSteps)
  }

  /**
   * Updates step titles after reordering
   * @param {Array} newSteps - The new array of steps
   */
  const updateStepTitles = (newSteps) => {
    // If steps have default sequential titles, update them
    const updatedSteps = newSteps.map((step, index) => {
      const defaultTitle = `Stage ${index + 1}`;
      
      // Check if the title follows the default pattern
      const titlePattern = /^Stage \d+$/;
      if (titlePattern.test(step.title)) {
        return { ...step, title: defaultTitle };
      }
      
      return step;
    });
    
    setSteps(updatedSteps);
  }

  /**
   * Adds a new step after the specified index
   * @param {number} afterIndex - The index after which to add the new step
   */
  const addStepAfter = (afterIndex) => {
    const newStep = {
      id: Date.now(),
      title: `Stage ${steps.length + 1}`,
      description: 'Drag services here to configure this stage',
      services: []
    }
    
    const newSteps = [
      ...steps.slice(0, afterIndex + 1),
      newStep,
      ...steps.slice(afterIndex + 1)
    ]
    
    setSteps(newSteps)
    // Update step titles to maintain sequence
    updateStepTitles(newSteps)
  }

  /**
   * Deletes a step from the configuration
   * @param {string} stepId - The ID of the step to delete
   */
  const deleteStep = (stepId) => {
    // Don't allow deleting if there's only one step
    if (steps.length <= 1) {
      return;
    }
    
    // Filter out the step with the given ID
    const newSteps = steps.filter(step => step.id !== stepId);
    
    // Update step titles to maintain sequence
    const updatedSteps = newSteps.map((step, index) => {
      // Check if the title follows the default pattern
      const titlePattern = /^Stage \d+$/;
      if (titlePattern.test(step.title)) {
        return { ...step, title: `Stage ${index + 1}` };
      }
      return step;
    });
    
    setSteps(updatedSteps);
  };

  return (
    <div className="dashboard">
      <ServicesPanel
        services={services}
        activeService={activeService}
        isDragging={isDragging}
        onServiceClick={setActiveService}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      
      <div className="content-area">
        <div className="content-header">
          <h1>Stage Configuration</h1>
          <div className="header-buttons">
            <button className="create-button" onClick={addNewStep}>
              + Add New Stage
            </button>
            <button className="save-button" onClick={() => setShowJsonPreview(true)}>
              Save
            </button>
          </div>
        </div>
        
        <div className="steps-container">
          <div className={`steps-grid ${steps.length === 1 ? 'single-step' : ''}`}>
            {steps.map((step, index) => (
              <StepWidget
                key={step.id}
                step={step}
                editingField={editingField}
                onEdit={handleEdit}
                onEditSave={handleEditSave}
                onDragOver={handleServiceDragOver}
                onDragLeave={handleStepDragLeave}
                onDrop={handleServiceDrop}
                onRemoveService={removeService}
                isLastStep={index === steps.length - 1}
                index={index}
                onStepDragStart={handleStepDragStart}
                onStepDragEnd={handleStepDragEnd}
                onStepDragOver={handleStepDragOver}
                onStepDrop={handleStepDrop}
                onAddStep={() => addStepAfter(index)}
                onDeleteStep={deleteStep}
              />
            ))}
          </div>
        </div>
      </div>

      {showJsonPreview && (
        <JsonPreviewModal
          steps={steps}
          onClose={() => setShowJsonPreview(false)}
        />
      )}
    </div>
  )
}

export default App
