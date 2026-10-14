 import { useAppContext } from '../context/AppContext'
import { Card, Button, ProgressBar } from '../components/common/CommonComponents'
import { Plus, Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Team() {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useAppContext()

  // ---- Invite new member (compact modal) ----
  const handleInvite = () => {
    Swal.fire({
      title: 'Invite New Member',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Full Name *" style="font-size:14px; padding:6px 12px;">
        <input id="swal-role" class="swal2-input" placeholder="Role *" style="font-size:14px; padding:6px 12px;">
        <input id="swal-projects" class="swal2-input" placeholder="Projects" value="0" style="font-size:14px; padding:6px 12px;">
        <input id="swal-tasks" class="swal2-input" placeholder="Tasks" value="0" style="font-size:14px; padding:6px 12px;">
        <input id="swal-workload" class="swal2-input" placeholder="Workload %" value="50" style="font-size:14px; padding:6px 12px;">
        <select id="swal-status" class="swal2-input" style="font-size:14px; padding:6px 12px;">
          <option value="Online">Online</option>
          <option value="Busy">Busy</option>
          <option value="Offline">Offline</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Member',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 380,
      padding: '1rem',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const role = document.getElementById('swal-role').value.trim()
        const projects = parseInt(document.getElementById('swal-projects').value) || 0
        const tasks = parseInt(document.getElementById('swal-tasks').value) || 0
        const workload = parseInt(document.getElementById('swal-workload').value) || 0
        const status = document.getElementById('swal-status').value
        if (!name || !role) {
          Swal.showValidationMessage('Name and Role are required')
          return false
        }
        return { name, role, projects, tasks, workload, status }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newMember = {
          ...result.value,
          avatar: result.value.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        }
        addTeamMember(newMember)
        Swal.fire('Added!', `${newMember.name} has been added to the team.`, 'success')
      }
    })
  }

  // ---- Edit member ----
  const handleEdit = (member) => {
    Swal.fire({
      title: `Edit ${member.name}`,
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${member.name}" style="font-size:14px; padding:6px 12px;">
        <input id="swal-role" class="swal2-input" placeholder="Role" value="${member.role}" style="font-size:14px; padding:6px 12px;">
        <input id="swal-projects" class="swal2-input" placeholder="Projects" value="${member.projects}" style="font-size:14px; padding:6px 12px;">
        <input id="swal-tasks" class="swal2-input" placeholder="Tasks" value="${member.tasks}" style="font-size:14px; padding:6px 12px;">
        <input id="swal-workload" class="swal2-input" placeholder="Workload %" value="${member.workload}" style="font-size:14px; padding:6px 12px;">
        <select id="swal-status" class="swal2-input" style="font-size:14px; padding:6px 12px;">
          <option value="Online" ${member.status === 'Online' ? 'selected' : ''}>Online</option>
          <option value="Busy" ${member.status === 'Busy' ? 'selected' : ''}>Busy</option>
          <option value="Offline" ${member.status === 'Offline' ? 'selected' : ''}>Offline</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 380,
      padding: '1rem',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const role = document.getElementById('swal-role').value.trim()
        const projects = parseInt(document.getElementById('swal-projects').value) || 0
        const tasks = parseInt(document.getElementById('swal-tasks').value) || 0
        const workload = parseInt(document.getElementById('swal-workload').value) || 0
        const status = document.getElementById('swal-status').value
        if (!name || !role) {
          Swal.showValidationMessage('Name and Role are required')
          return false
        }
        return { name, role, projects, tasks, workload, status }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = { ...result.value, avatar: member.avatar }
        updateTeamMember(member.id, updated)
        Swal.fire('Updated!', `${updated.name}'s details have been updated.`, 'success')
      }
    })
  }

  // ---- Toggle Active/Inactive ----
  const handleToggleActive = (member) => {
    const newStatus = member.status === 'Online' ? 'Offline' : 'Online'
    const action = newStatus === 'Online' ? 'Active' : 'Inactive'
    Swal.fire({
      title: `Set ${member.name} as ${action}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Online' ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, set ${action}`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateTeamMember(member.id, { status: newStatus })
        Swal.fire(`${action}!`, `${member.name} is now ${newStatus}.`, 'success')
      }
    })
  }

  // ---- Delete member ----
  const handleDelete = (member) => {
    Swal.fire({
      title: 'Remove Member?',
      text: `You are about to remove ${member.name} from the team.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTeamMember(member.id)
        Swal.fire('Removed!', `${member.name} has been removed.`, 'success')
      }
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="page-title">Team</h2>
          <p className="text-muted">Manage your team members</p>
        </div>
        <Button variant="primary" onClick={handleInvite}>
          <Plus size={18} /> Invite Member
        </Button>
      </div>
      <Card>
        <div className="table-responsive">
          <table className="table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-medium">Member</th>
                <th className="text-left py-2 px-3 font-medium">Role</th>
                <th className="text-left py-2 px-3 font-medium">Projects</th>
                <th className="text-left py-2 px-3 font-medium">Tasks</th>
                <th className="text-left py-2 px-3 font-medium">Workload</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-left py-2 px-3 font-medium" style={{ width: '160px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(m => (
                <tr key={m.id}>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="avatar-small">{m.avatar}</div>
                      {m.name}
                    </div>
                  </td>
                  <td className="py-2 px-3">{m.role}</td>
                  <td className="py-2 px-3">{m.projects}</td>
                  <td className="py-2 px-3">{m.tasks}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar progress={m.workload} />
                      <span className="text-xs">{m.workload}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">{m.status}</td>
                  <td className="py-2 px-3" style={{ width: '160px' }}>
                    <div className="flex items-center gap-3">
                      {/* Edit – blue */}
                      <button
                        onClick={() => handleEdit(m)}
                        className="p-1 rounded transition-all"
                        style={{ color: '#3b82f6' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Edit member"
                      >
                        <Edit size={16} />
                      </button>
                      {/* Toggle Active – green/red */}
                      <button
                        onClick={() => handleToggleActive(m)}
                        className="p-1 rounded transition-all"
                        style={{ color: m.status === 'Online' ? '#22c55e' : '#ef4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = m.status === 'Online' ? '#dcfce7' : '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title={m.status === 'Online' ? 'Set Inactive' : 'Set Active'}
                      >
                        {m.status === 'Online' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </button>
                      {/* Delete – red */}
                      <button
                        onClick={() => handleDelete(m)}
                        className="p-1 rounded transition-all"
                        style={{ color: '#ef4444' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Delete member"
                      >
                        <Trash2 size={16} />
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