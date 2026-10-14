 import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Card, Button, ProgressBar, Modal } from '../components/common/CommonComponents'
import { Grid, List, Plus, Edit, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useAppContext()
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    status: 'Active',
  })

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const openCreateModal = () => {
    setEditingProject(null)
    setFormData({ name: '', description: '', priority: 'Medium', status: 'Active' })
    setIsModalOpen(true)
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setFormData({ ...project })
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      Swal.fire('Error', 'Project name is required', 'warning')
      return
    }

    if (editingProject) {
      updateProject(editingProject.id, formData)
    } else {
      const projectData = {
        ...formData,
        owner: 'John Doe',
        progress: 0,
        tasks: 0,
        due: new Date().toISOString().split('T')[0],
        color: '#6366f1',
      }
      addProject(projectData)
    }

    setIsModalOpen(false)
    setEditingProject(null)
    setFormData({ name: '', description: '', priority: 'Medium', status: 'Active' })
  }

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${name}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(id)
        Swal.fire('Deleted!', 'Project has been removed.', 'success')
      }
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="text-muted">Manage your ongoing projects</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex bg-background rounded border">
            <button className={`icon-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
              <Grid size={18} />
            </button>
            <button className={`icon-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
              <List size={18} />
            </button>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus size={18} /> New Project
          </Button>
        </div>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-3 gap-3' : 'flex flex-col gap-3'}>
        {filtered.map(p => (
          <Card key={p.id} className="project-card">
            <div className="flex justify-between items-start">
              <Link to={`/projects/${p.id}`} className="font-bold hover:text-primary cursor-pointer text-lg">
                {p.name}
              </Link>
            </div>
            <p className="text-muted text-sm mt-1">{p.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="avatar-small">{p.owner?.[0] || '?'}</div>
              <span className="text-sm">{p.owner || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-muted">Due: {p.due}</span>
              <div className="flex items-center gap-2">
                <ProgressBar progress={p.progress} />
                <span className="text-sm">{p.progress}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <Link to={`/projects/${p.id}`} className="btn btn-outline btn-sm">View Details</Link>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded transition-all"
                  style={{ color: '#3b82f6' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit project"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-2 rounded transition-all"
                  style={{ color: '#ef4444' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Delete project"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'Create New Project'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Project Name"
            className="modal-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            rows="3"
            className="modal-input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <option>Active</option>
              <option>Pending</option>
              <option>On Track</option>
              <option>Completed</option>
            </select>
          </div>
          <Button variant="primary" type="submit" className="mt-2">
            {editingProject ? 'Update Project' : 'Create Project'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}