 import React from 'react'
import './Common.css'

export const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
)

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => (
  <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
    {children}
  </button>
)

export const Badge = ({ status, label }) => {
  const colorMap = {
    'On Track': 'success',
    'Active': 'primary',
    'Pending': 'warning',
    'Delayed': 'danger',
    'Completed': 'success',
    'At Risk': 'danger',
    'High': 'danger',
    'Medium': 'warning',
    'Low': 'success',
    'Critical': 'danger',
    'To Do': 'secondary',
    'In Progress': 'primary',
    'Online': 'success',
    'Busy': 'warning',
    'Offline': 'secondary',
  }
  return <span className={`badge badge-${colorMap[status] || 'secondary'}`}>{label || status}</span>
}

export const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div className="progress-bar" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
  </div>
)

// ✅ Updated Modal – accepts className prop
export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}