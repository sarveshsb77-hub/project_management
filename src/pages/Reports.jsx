 import { projects, tasks } from '../data/mockData'
import { useAppContext } from '../context/AppContext'
import { Card } from '../components/common/CommonComponents'
import { Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts'
import Swal from 'sweetalert2'

export default function Reports() {
  const { projects: contextProjects, updateProject, deleteProject } = useAppContext()
  const projectData = contextProjects.length > 0 ? contextProjects : projects

  const statusData = projectData.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})
  const pieData = Object.keys(statusData).map(key => ({ name: key, value: statusData[key] }))
  const COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#94a3b8']

  const priorityData = tasks.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1
    return acc
  }, {})
  const barData = Object.keys(priorityData).map(key => ({ name: key, tasks: priorityData[key] }))

  const lineData = [
    { name: 'Week 1', completed: 5 },
    { name: 'Week 2', completed: 8 },
    { name: 'Week 3', completed: 12 },
    { name: 'Week 4', completed: 10 },
  ]

  // ---- Edit project ----
  const handleEdit = (project) => {
    Swal.fire({
      title: `Edit ${project.name}`,
      html: `
        <div style="display:flex; flex-direction:column; gap:4px; padding:0;">
          <input id="swal-name" class="swal2-input" placeholder="Project Name" value="${project.name}" style="font-size:13px; padding:4px 8px; margin:0;">
          <input id="swal-desc" class="swal2-input" placeholder="Description" value="${project.description}" style="font-size:13px; padding:4px 8px; margin:0;">
          <input id="swal-owner" class="swal2-input" placeholder="Owner" value="${project.owner}" style="font-size:13px; padding:4px 8px; margin:0;">
          <div style="display:flex; gap:4px;">
            <input id="swal-progress" class="swal2-input" type="number" placeholder="Progress %" value="${project.progress}" style="font-size:13px; padding:4px 8px; margin:0; flex:1;">
            <input id="swal-due" class="swal2-input" type="date" value="${project.due}" style="font-size:13px; padding:4px 8px; margin:0; flex:1;">
          </div>
          <select id="swal-status" class="swal2-input" style="font-size:13px; padding:4px 8px; margin:0;">
            <option value="On Track" ${project.status === 'On Track' ? 'selected' : ''}>On Track</option>
            <option value="Active" ${project.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="At Risk" ${project.status === 'At Risk' ? 'selected' : ''}>At Risk</option>
            <option value="Completed" ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Delayed" ${project.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
            <option value="Pending" ${project.status === 'Pending' ? 'selected' : ''}>Pending</option>
          </select>
          <select id="swal-priority" class="swal2-input" style="font-size:13px; padding:4px 8px; margin:0;">
            <option value="High" ${project.priority === 'High' ? 'selected' : ''}>High</option>
            <option value="Medium" ${project.priority === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="Low" ${project.priority === 'Low' ? 'selected' : ''}>Low</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 400,
      padding: '1rem',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const description = document.getElementById('swal-desc').value.trim()
        const owner = document.getElementById('swal-owner').value.trim()
        const progress = parseInt(document.getElementById('swal-progress').value) || 0
        const due = document.getElementById('swal-due').value
        const status = document.getElementById('swal-status').value
        const priority = document.getElementById('swal-priority').value
        if (!name) {
          Swal.showValidationMessage('Project name is required')
          return false
        }
        return { name, description, owner, progress, due, status, priority }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        updateProject(project.id, result.value)
        Swal.fire('Updated!', 'Project updated successfully.', 'success')
      }
    })
  }

  // ---- Toggle Active/Inactive ----
  const handleToggleActive = (project) => {
    const newStatus = project.status === 'Active' ? 'Pending' : 'Active'
    const action = newStatus === 'Active' ? 'Active' : 'Inactive'
    Swal.fire({
      title: `Set ${project.name} as ${action}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Active' ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, set ${action}`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateProject(project.id, { status: newStatus })
        Swal.fire(`${action}!`, `${project.name} is now ${action}.`, 'success')
      }
    })
  }

  // ---- Delete project ----
  const handleDelete = (project) => {
    Swal.fire({
      title: 'Delete Project?',
      text: `You are about to delete "${project.name}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(project.id)
        Swal.fire('Deleted!', 'Project has been removed.', 'success')
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="page-title">Reports</h2>
        <p className="text-muted">Analytics and performance metrics</p>
      </div>

      {/* 4 separate Cards – no nested div inside */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card className="stat-card">
          <h4>Total Projects</h4>
          <h2>{projectData.length}</h2>
        </Card>
        <Card className="stat-card">
          <h4>Completion Rate</h4>
          <h2>72%</h2>
        </Card>
        <Card className="stat-card">
          <h4>Tasks Completed</h4>
          <h2>{tasks.filter(t => t.status === 'Completed').length}</h2>
        </Card>
        <Card className="stat-card">
          <h4>Overdue</h4>
          <h2>{tasks.filter(t => new Date(t.due) < new Date() && t.status !== 'Completed').length}</h2>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <h4 className="mb-3 text-sm font-medium">Project Completion</h4>
          <div className="chart-container" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h4 className="mb-3 text-sm font-medium">Tasks by Priority</h4>
          <div className="chart-container" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h4 className="mb-3 text-sm font-medium">Project Performance</h4>
        <div className="table-responsive">
          <table className="table" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th className="text-left py-1 px-2 font-medium">Project</th>
                <th className="text-left py-1 px-2 font-medium">Owner</th>
                <th className="text-left py-1 px-2 font-medium">Progress</th>
                <th className="text-left py-1 px-2 font-medium">Status</th>
                <th className="text-left py-1 px-2 font-medium" style={{ width: '160px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projectData.map(p => (
                <tr key={p.id}>
                  <td className="py-1 px-2"><strong>{p.name}</strong></td>
                  <td className="py-1 px-2">{p.owner}</td>
                  <td className="py-1 px-2">{p.progress}%</td>
                  <td className="py-1 px-2">{p.status}</td>
                  <td className="py-1 px-2" style={{ width: '160px' }}>
                    <div className="flex items-center gap-3">
                      {/* Edit – blue */}
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1 rounded transition-all"
                        style={{ color: '#3b82f6' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Edit project"
                      >
                        <Edit size={15} />
                      </button>
                      {/* Toggle Active – green/red */}
                      <button
                        onClick={() => handleToggleActive(p)}
                        className="p-1 rounded transition-all"
                        style={{ color: p.status === 'Active' ? '#22c55e' : '#ef4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = p.status === 'Active' ? '#dcfce7' : '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title={p.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                      >
                        {p.status === 'Active' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                      </button>
                      {/* Delete – red */}
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-1 rounded transition-all"
                        style={{ color: '#ef4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Delete project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}