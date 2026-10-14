 import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Card, ProgressBar } from '../components/common/CommonComponents'
import { ArrowLeft, FileText, Users, Mail, Phone, Building, Edit, Trash2, UserMinus, UserPlus, Pencil, Tag, Briefcase } from 'lucide-react'
import Swal from 'sweetalert2'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, tasks, addTask, updateProject, deleteProject, updateTask, deleteTask } = useAppContext()

  const project = projects.find(p => p.id === parseInt(id))
  if (!project) return <div className="p-8 text-center text-muted">Project not found</div>

  const projectTasks = tasks.filter(t => t.project === project.name)

  // ---- Build user map ----
  const userMap = new Map()
  projectTasks.forEach(t => {
    if (t.assignee) {
      const email = t.assigneeEmail || `${t.assignee.toLowerCase().replace(/\s/g, '')}@company.com`
      const mobile = t.assigneeMobile || '+1 801-542-6001'
      userMap.set(t.assignee, { email, mobile })
    }
  })
  const uniqueAssignees = Array.from(userMap.keys())

  const getUserEmail = (name) => {
    const user = userMap.get(name)
    return user ? user.email : `${name.toLowerCase().replace(/\s/g, '')}@company.com`
  }
  const getUserMobile = (name) => {
    const user = userMap.get(name)
    return user ? user.mobile : '+1 801-542-6001'
  }

  const ownerEmail = project.ownerEmail || getUserEmail(project.owner)
  const ownerPhone = project.ownerPhone || getUserMobile(project.owner)
  const isComplete = project.progress === 100 || project.status === 'Completed'

  // ---- Edit Project ----
  const handleEditProject = () => {
    Swal.fire({
      title: 'Edit Project',
      html: `
        <div style="display:flex; flex-direction:column; gap:6px; padding:0;">
          <input id="swal-name" class="swal2-input" placeholder="Project Name" value="${project.name}" style="font-size:14px; padding:6px 10px; margin:0;">
          <input id="swal-desc" class="swal2-input" placeholder="Description" value="${project.description || ''}" style="font-size:14px; padding:6px 10px; margin:0;">
          <input id="swal-owner" class="swal2-input" placeholder="Contact Person" value="${project.owner}" style="font-size:14px; padding:6px 10px; margin:0;">
          <input id="swal-email" class="swal2-input" placeholder="Email Address" value="${ownerEmail}" style="font-size:14px; padding:6px 10px; margin:0;">
          <input id="swal-phone" class="swal2-input" placeholder="Contact Number" value="${ownerPhone}" style="font-size:14px; padding:6px 10px; margin:0;">
          <div style="display:flex; gap:6px;">
            <input id="swal-progress" class="swal2-input" type="number" placeholder="Progress %" value="${project.progress}" style="font-size:14px; padding:6px 10px; margin:0; flex:1;">
            <input id="swal-due" class="swal2-input" type="date" value="${project.due}" style="font-size:14px; padding:6px 10px; margin:0; flex:1;">
          </div>
          <select id="swal-status" class="swal2-input" style="font-size:14px; padding:6px 10px; margin:0;">
            <option value="On Track" ${project.status === 'On Track' ? 'selected' : ''}>On Track</option>
            <option value="Active" ${project.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="At Risk" ${project.status === 'At Risk' ? 'selected' : ''}>At Risk</option>
            <option value="Completed" ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Delayed" ${project.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
            <option value="Pending" ${project.status === 'Pending' ? 'selected' : ''}>Pending</option>
          </select>
          <select id="swal-priority" class="swal2-input" style="font-size:14px; padding:6px 10px; margin:0;">
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
      width: 440,
      padding: '1rem',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const description = document.getElementById('swal-desc').value.trim()
        const owner = document.getElementById('swal-owner').value.trim()
        const email = document.getElementById('swal-email').value.trim()
        const phone = document.getElementById('swal-phone').value.trim()
        const progress = parseInt(document.getElementById('swal-progress').value) || 0
        const due = document.getElementById('swal-due').value
        const status = document.getElementById('swal-status').value
        const priority = document.getElementById('swal-priority').value
        if (!name) {
          Swal.showValidationMessage('Project name is required')
          return false
        }
        return { name, description, owner, ownerEmail: email, ownerPhone: phone, progress, due, status, priority }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        updateProject(project.id, result.value)
        Swal.fire('Updated!', 'Project details updated.', 'success')
      }
    })
  }

  // ---- Delete Project ----
  const handleDeleteProject = () => {
    Swal.fire({
      title: 'Delete Project?',
      text: `You are about to delete "${project.name}". This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(project.id)
        Swal.fire('Deleted!', 'Project removed.', 'success')
        navigate('/projects')
      }
    })
  }

  // ---- Add User ----
  const handleAddUser = () => {
    Swal.fire({
      title: 'Add User to Project',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="User Name *" style="font-size:14px; padding:6px 10px; margin:0;">
        <input id="swal-email" class="swal2-input" placeholder="Email Address *" style="font-size:14px; padding:6px 10px; margin:0;">
        <input id="swal-mobile" class="swal2-input" placeholder="Mobile Number *" style="font-size:14px; padding:6px 10px; margin:0;">
        <input id="swal-title" class="swal2-input" placeholder="Task Title (optional)" style="font-size:14px; padding:6px 10px; margin:0;">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add User',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 440,
      padding: '1rem',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const email = document.getElementById('swal-email').value.trim()
        const mobile = document.getElementById('swal-mobile').value.trim()
        const title = document.getElementById('swal-title').value.trim() || 'New Task'
        if (!name || !email || !mobile) {
          Swal.showValidationMessage('Name, Email and Mobile are required')
          return false
        }
        return { name, email, mobile, title }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, email, mobile, title } = result.value
        addTask({
          title,
          project: project.name,
          assignee: name,
          assigneeEmail: email,
          assigneeMobile: mobile,
          priority: 'Medium',
          status: 'To Do',
          due: new Date().toISOString().split('T')[0]
        })
        Swal.fire('Added!', `${name} has been added to the project.`, 'success')
      }
    })
  }

  // ---- Edit User (full row: Name, Email, Mobile) ----
  const handleEditUser = (userName) => {
    const currentEmail = getUserEmail(userName)
    const currentMobile = getUserMobile(userName)

    Swal.fire({
      title: `Edit User`,
      html: `
        <input id="swal-name" class="swal2-input" placeholder="User Name *" value="${userName}" style="font-size:14px; padding:6px 10px; margin:0;">
        <input id="swal-email" class="swal2-input" placeholder="Email Address *" value="${currentEmail}" style="font-size:14px; padding:6px 10px; margin:0;">
        <input id="swal-mobile" class="swal2-input" placeholder="Mobile Number *" value="${currentMobile}" style="font-size:14px; padding:6px 10px; margin:0;">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 440,
      padding: '1rem',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const email = document.getElementById('swal-email').value.trim()
        const mobile = document.getElementById('swal-mobile').value.trim()
        if (!name || !email || !mobile) {
          Swal.showValidationMessage('All fields are required')
          return false
        }
        return { name, email, mobile }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, email, mobile } = result.value
        const tasksToUpdate = tasks.filter(t => t.assignee === userName && t.project === project.name)
        tasksToUpdate.forEach(t => {
          updateTask(t.id, { 
            ...t, 
            assignee: name, 
            assigneeEmail: email, 
            assigneeMobile: mobile 
          })
        })
        Swal.fire('Updated!', `User details have been updated.`, 'success')
      }
    })
  }

  // ---- Remove User ----
  const handleRemoveUser = (userName) => {
    Swal.fire({
      title: `Remove ${userName}?`,
      text: `This will delete all tasks assigned to ${userName} from this project.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove user',
    }).then((result) => {
      if (result.isConfirmed) {
        const tasksToDelete = tasks.filter(t => t.assignee === userName && t.project === project.name)
        tasksToDelete.forEach(t => deleteTask(t.id))
        Swal.fire('Removed!', `${userName} and their tasks have been removed.`, 'success')
      }
    })
  }

  return (
    <div className="project-details">
      {/* YOUR ORIGINAL STYLES — KEPT EXACTLY AS THEY WERE */}
      <style>{`
        .project-details {
          position: relative;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.04) 0%, transparent 70%),
            radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(52,211,153,0.03) 0%, transparent 50%);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards;
        }
        .info-bar {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.15);
          background: linear-gradient(135deg, #fef3c7, #fde68a, #fdba74, #fcd34d);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          overflow: hidden;
        }
        .info-bar:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 28px rgba(99,102,241,0.12);
        }
        [data-theme="dark"] .info-bar {
          /* Use the same amber gradient but with higher opacity for visibility */
          background: linear-gradient(135deg, #fef3c7, #fde68a, #fdba74, #fcd34d);
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 4px 20px rgba(99,102,241,0.15);
          /* Add a dark overlay to keep text readable */
          position: relative;
        }
        [data-theme="dark"] .info-bar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          border-radius: 16px;
          pointer-events: none;
        }
        .info-bar-inner {
          padding: 1.25rem;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(2px);
          position: relative;
          z-index: 1;
        }
        [data-theme="dark"] .info-bar-inner {
          background: rgba(0,0,0,0.2);
        }
        @media (max-width: 1024px) { .info-bar-inner { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px) { .info-bar-inner { grid-template-columns: 1fr; } }

        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-item .label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(0,0,0,0.5);
        }
        [data-theme="dark"] .info-item .label { color: rgba(255,255,255,0.6); }
        .info-item .value {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(0,0,0,0.8);
          margin-top: 0.15rem;
        }
        [data-theme="dark"] .info-item .value { color: #fff; }

        .detail-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: var(--card);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          overflow: hidden;
        }
        .detail-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(99,102,241,0.08);
        }
        [data-theme="dark"] .detail-card {
          background: var(--card);
          border-color: rgba(255,255,255,0.05);
        }
        [data-theme="dark"] .detail-card:hover {
          border-color: rgba(255,255,255,0.15);
        }
        .detail-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--border);
        }
        [data-theme="dark"] .detail-card-header { border-bottom-color: rgba(255,255,255,0.08); }
        .detail-card-header h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
        }
        [data-theme="dark"] .detail-card-header h4 { color: #fff; }

        .nested-card {
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--card);
          padding: 0.75rem 1rem;
          transition: background 0.3s ease;
          margin-bottom: 0.75rem;
        }
        .nested-card:last-child { margin-bottom: 0; }
        [data-theme="dark"] .nested-card {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.06);
        }
        .nested-card-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .nested-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem 1.2rem;
        }
        @media (max-width: 640px) {
          .nested-card-grid { grid-template-columns: 1fr; gap: 0.2rem 0; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .nested-card-grid { grid-template-columns: 1fr 1fr; gap: 0.3rem 1rem; }
        }
        .nested-item {
          display: flex;
          justify-content: space-between;
          padding: 0.2rem 0;
          border-bottom: 1px solid var(--border);
        }
        [data-theme="dark"] .nested-item { border-bottom-color: rgba(255,255,255,0.06); }
        .nested-item .label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .nested-item .value {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text);
          text-align: right;
        }
        [data-theme="dark"] .nested-item .label { color: rgba(255,255,255,0.5); }
        [data-theme="dark"] .nested-item .value { color: #fff; }
        .nested-item.col-span-2 { grid-column: 1 / -1; }

        .users-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 0 -0.25rem;
        }
        .users-table {
          width: 100%;
          min-width: 500px;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        @media (max-width: 640px) {
          .users-table { font-size: 0.8rem; min-width: 380px; }
        }
        .users-table thead tr { background: rgba(0,0,0,0.03); }
        [data-theme="dark"] .users-table thead tr { background: rgba(255,255,255,0.05); }
        .users-table th {
          text-align: left;
          padding: 0.5rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .users-table td {
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        [data-theme="dark"] .users-table td { border-bottom-color: rgba(255,255,255,0.06); }
        .users-table tbody tr {
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .users-table tbody tr:hover {
          background-color: rgba(99,102,241,0.05);
          transform: translateX(4px);
        }
        [data-theme="dark"] .users-table tbody tr:hover { background-color: rgba(99,102,241,0.1); }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .user-avatar { width: 24px; height: 24px; font-size: 0.6rem; }
        }
        .status-text.active {
          font-weight: 500;
          color: #22c55e;
        }
        .status-text.inactive {
          font-weight: 500;
          color: #ef4444;
        }

        .action-btn-edit { color: #3b82f6; }
        .action-btn-edit:hover { background: rgba(59,130,246,0.1); }
        [data-theme="dark"] .action-btn-edit { color: #60a5fa; }
        [data-theme="dark"] .action-btn-edit:hover { background: rgba(96,165,250,0.15); }
        .action-btn-delete { color: #ef4444; }
        .action-btn-delete:hover { background: rgba(239,68,68,0.1); }
        [data-theme="dark"] .action-btn-delete { color: #f87171; }
        [data-theme="dark"] .action-btn-delete:hover { background: rgba(248,113,113,0.15); }
        .action-btn-remove { color: #ef4444; }
        .action-btn-remove:hover { background: rgba(239,68,68,0.1); }
        [data-theme="dark"] .action-btn-remove { color: #f87171; }
        [data-theme="dark"] .action-btn-remove:hover { background: rgba(248,113,113,0.15); }
        .action-btn-add { color: #22c55e; }
        .action-btn-add:hover { background: rgba(34,197,94,0.1); }
        [data-theme="dark"] .action-btn-add { color: #4ade80; }
        [data-theme="dark"] .action-btn-add:hover { background: rgba(74,222,128,0.15); }

        @media (max-width: 640px) {
          .info-bar-inner { padding: 0.75rem; gap: 0.5rem; }
          .detail-card { padding: 0.75rem !important; }
          .nested-card { padding: 0.5rem 0.6rem; margin-bottom: 0.5rem; }
          .nested-card-title { font-size: 0.65rem; }
          .nested-item .label { font-size: 0.7rem; }
          .nested-item .value { font-size: 0.8rem; }
        }
      `}</style>

      {/* Breadcrumb + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-3">
       <Link
  to="/projects"
  className="inline-flex items-center text-sm font-medium text-muted hover:text-primary transition-colors group"
>
  <ArrowLeft
    size={18}
    className="text-primary transition-transform duration-200 group-hover:-translate-x-1 mr-5"
  /> Back to Projects
</Link>
          <span className="text-muted">/</span>
          <span className="text-sm font-medium">{project.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleEditProject} className="p-1.5 rounded action-btn-edit transition-colors" title="Edit project">
            <Edit size={18} />
          </button>
          <button onClick={handleDeleteProject} className="p-1.5 rounded action-btn-delete transition-colors" title="Delete project">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* TOP INFO BAR */}
      <div className="info-bar fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="info-bar-inner">
          <div className="info-item">
            <span className="label">Code</span>
            <span className="value text-primary">CMP-{String(project.id).padStart(6, '0')}</span>
          </div>
          <div className="info-item">
            <span className="label">Company</span>
            <span className="value">{project.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Contact</span>
            <span className="value">{project.owner}</span>
          </div>
          <div className="info-item">
            <span className="label">Contact Info</span>
            <div className="value text-sm flex items-center gap-1"><Mail size={14} /> {ownerEmail}</div>
            <div className="value text-sm text-muted flex items-center gap-1"><Phone size={12} /> {ownerPhone}</div>
          </div>
          <div className="info-item">
            <span className="label">Progress</span>
            <div className="value flex items-center gap-2">
              <div className="flex-1 min-w-[50px]"><ProgressBar progress={project.progress} /></div>
              <span>{project.progress}%</span>
            </div>
            <div className="mt-0.5">
              <span className={`text-sm font-medium ${isComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isComplete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>
          <div className="info-item">
            <span className="label">Status</span>
            <span className="value text-sm font-medium text-foreground">{project.status}</span>
          </div>
        </div>
      </div>

      {/* TWO MAIN CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* LEFT – Company Profile Fields */}
        <Card className="detail-card p-4 fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="detail-card-header">
            <FileText size={18} className="text-primary" />
            <h4>Company Profile Fields</h4>
          </div>

          <div className="nested-card">
            <div className="nested-card-title"><Building size={15} className="text-primary" /> Business</div>
            <div className="nested-card-grid">
              <div className="nested-item"><span className="label">Owner</span><span className="value">{project.owner}</span></div>
              <div className="nested-item"><span className="label">Priority</span><span className="value">{project.priority}</span></div>
              <div className="nested-item"><span className="label">Due Date</span><span className="value">{project.due}</span></div>
              <div className="nested-item"><span className="label">Status</span><span className="value">{project.status}</span></div>
            </div>
          </div>

          <div className="nested-card">
            <div className="nested-card-title"><Tag size={15} className="text-primary" /> Description</div>
            <div className="nested-card-grid">
              <div className="nested-item col-span-2">
                <span className="label">Details</span>
                <span className="value" style={{ textAlign: 'left' }}>{project.description || 'No description'}</span>
              </div>
            </div>
          </div>

          <div className="nested-card">
            <div className="nested-card-title"><Briefcase size={15} className="text-primary" /> Stats</div>
            <div className="nested-card-grid">
              <div className="nested-item"><span className="label">Tasks</span><span className="value">{project.tasks}</span></div>
              <div className="nested-item"><span className="label">Progress</span><span className="value">{project.progress}%</span></div>
            </div>
          </div>
        </Card>

        {/* RIGHT – Registered Users */}
        <Card className="detail-card p-4 fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="detail-card-header">
            <Users size={18} className="text-primary" />
            <h4>Registered Users</h4>
            <button
              onClick={handleAddUser}
              className="ml-auto p-1.5 rounded action-btn-add transition-colors"
              title="Add user"
            >
              <UserPlus size={18} />
            </button>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th className="text-left">User</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Mobile</th>
                  <th className="text-center">Status</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {uniqueAssignees.length > 0 ? (
                  uniqueAssignees.map((assignee) => {
                    const hasTasks = projectTasks.some(t => t.assignee === assignee)
                    return (
                      <tr key={assignee} className="border-b border-border/50 dark:border-slate-700/30 last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <span className="user-avatar">{assignee[0]}</span>
                            <span className="font-medium">{assignee}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-muted">{getUserEmail(assignee)}</td>
                        <td className="py-2 px-3 text-muted">{getUserMobile(assignee)}</td>
                        <td className="text-center">
                          <span className={`status-text ${hasTasks ? 'active' : 'inactive'}`}>
                            {hasTasks ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditUser(assignee)}
                              className="p-1 rounded action-btn-edit transition-colors"
                              title="Edit user"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoveUser(assignee)}
                              className="p-1 rounded action-btn-remove transition-colors"
                              title="Remove user"
                            >
                              <UserMinus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No users assigned</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}