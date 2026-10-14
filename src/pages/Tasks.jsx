import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Card, Button, Modal } from '../components/common/CommonComponents'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    assignee: '',
    priority: 'Medium',
    status: 'To Do',
    due: '',
  })

  const columns = ['To Do', 'In Progress', 'Completed']
  const groupTasks = (status) => tasks.filter(t => t.status === status)

  const headerColors = {
    'To Do': 'text-orange-500',
    'In Progress': 'text-blue-500',
    'Completed': 'text-green-500',
  }

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId)
  }

  const handleDrop = (e, status) => {
    const id = parseInt(e.dataTransfer.getData('taskId'))
    const task = tasks.find(t => t.id === id)
    if (task) {
      updateTask(id, { status })
    }
  }

  const openCreateModal = () => {
    setEditingTask(null)
    setFormData({ title: '', project: '', assignee: '', priority: 'Medium', status: 'To Do', due: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setFormData({ ...task })
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.project.trim()) {
      Swal.fire('Error', 'Title and Project are required.', 'warning')
      return
    }

    if (editingTask) {
      updateTask(editingTask.id, formData)
    } else {
      addTask(formData)
    }

    setIsModalOpen(false)
    setEditingTask(null)
    setFormData({ title: '', project: '', assignee: '', priority: 'Medium', status: 'To Do', due: '' })
  }

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${title}". This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(id)
        Swal.fire('Deleted!', 'Task has been removed.', 'success')
      }
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="page-title">My Tasks</h2>
          <p className="text-muted">Manage your daily workload</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Task
        </Button>
      </div>

      {/* 
        Grid: 1 column on mobile, 3 columns on desktop 
        The "kanban-col" cards will be placed in a row on desktop.
      */}
      <div className="tasks-grid">
        {columns.map(col => (
          <Card key={col} className="kanban-col" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, col)}>
            <div className="flex justify-between items-center mb-3">
              <h4 className={`font-medium ${headerColors[col]}`}>{col}</h4>
              <span className="text-xs text-muted bg-muted px-2 py-0.5 rounded-full">{groupTasks(col).length}</span>
            </div>
            <div className="flex flex-col gap-2 min-h-[200px]">
              {groupTasks(col).map(t => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  className="task-card p-3 border rounded bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="flex-1 min-w-0">
                      <strong className="text-sm block truncate">{t.title}</strong>
                      <div className="text-xs text-muted mt-0.5 truncate">{t.project}</div>
                      {t.assignee && <div className="text-xs text-muted truncate">👤 {t.assignee}</div>}
                      {t.due && <div className="text-xs text-muted truncate">📅 {t.due}</div>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 rounded transition-all"
                        style={{ color: '#3b82f6' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Edit task"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.title)}
                        className="p-1.5 rounded transition-all"
                        style={{ color: '#ef4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create Task'} className="small-modal">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Task Title *"
            className="modal-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Project Name *"
            className="modal-input"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Assignee (optional)"
            className="modal-input"
            value={formData.assignee || ''}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
          />
          <input
            type="date"
            className="modal-input"
            value={formData.due || ''}
            onChange={(e) => setFormData({ ...formData, due: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              className="modal-input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select
              className="modal-input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <Button variant="primary" type="submit" className="mt-1 text-sm py-1.5">
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}