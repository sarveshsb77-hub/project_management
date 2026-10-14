 import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Card, Button, ProgressBar } from '../components/common/CommonComponents'
import { Upload, File, Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Files() {
  const { files, addFile, updateFile, deleteFile } = useAppContext()
  const [activeFilter, setActiveFilter] = useState('All Files')
  const totalStorage = 15
  const usedStorage = 6.8
  const percentage = (usedStorage / totalStorage) * 100

  // ---- Filter files based on category ----
  const getFilteredFiles = () => {
    if (activeFilter === 'All Files') return files

    switch (activeFilter) {
      case 'Project Documents':
        return files.filter(f => f.type === 'PDF' || f.type === 'DOCX')
      case 'Design Files':
        return files.filter(f => f.type === 'Figma')
      case 'Development':
        return files.filter(f => f.project === 'Mobile App' || f.project === 'CRM Integration')
      case 'Reports':
        return files.filter(f => f.type === 'XLSX')
      case 'Other':
        return files.filter(f => 
          !['PDF', 'DOCX', 'Figma', 'XLSX'].includes(f.type) &&
          f.project !== 'Mobile App' &&
          f.project !== 'CRM Integration'
        )
      default:
        return files
    }
  }

  const filteredFiles = getFilteredFiles()

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    const count = filteredFiles.length
    Swal.fire({
      icon: 'info',
      title: `${filter}`,
      text: `Showing ${count} file(s)`,
      timer: 1200,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    })
  }

  // ---- Upload File (compact modal) ----
  const handleUpload = () => {
    Swal.fire({
      title: 'Upload New File',
      html: `
        <div style="display:flex; flex-direction:column; gap:4px; padding:0;">
          <input id="swal-name" class="swal2-input" placeholder="File Name *" style="font-size:13px; padding:4px 8px; margin:0;">
          <input id="swal-project" class="swal2-input" placeholder="Project Name *" style="font-size:13px; padding:4px 8px; margin:0;">
          <select id="swal-type" class="swal2-input" style="font-size:13px; padding:4px 8px; margin:0;">
            <option value="PDF">PDF</option>
            <option value="Figma">Figma</option>
            <option value="DOCX">DOCX</option>
            <option value="XLSX">XLSX</option>
          </select>
          <input id="swal-size" class="swal2-input" placeholder="Size (e.g. 2.4 MB)" style="font-size:13px; padding:4px 8px; margin:0;">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Upload',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 380,
      padding: '1rem',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim()
        const project = document.getElementById('swal-project').value.trim()
        const type = document.getElementById('swal-type').value
        const size = document.getElementById('swal-size').value.trim() || '0 MB'
        if (!name || !project) {
          Swal.showValidationMessage('Name and Project are required')
          return false
        }
        return { name, project, type, size, modified: new Date().toISOString().split('T')[0], active: true }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        addFile(result.value)
        Swal.fire('Uploaded!', 'File has been uploaded successfully.', 'success')
      }
    })
  }

  // ---- Edit File (compact modal) ----
  const handleEdit = (file) => {
    Swal.fire({
      title: `Edit ${file.name}`,
      html: `
        <div style="display:flex; flex-direction:column; gap:4px; padding:0;">
          <input id="swal-name" class="swal2-input" placeholder="File Name" value="${file.name}" style="font-size:13px; padding:4px 8px; margin:0;">
          <input id="swal-project" class="swal2-input" placeholder="Project" value="${file.project}" style="font-size:13px; padding:4px 8px; margin:0;">
          <select id="swal-type" class="swal2-input" style="font-size:13px; padding:4px 8px; margin:0;">
            <option value="PDF" ${file.type === 'PDF' ? 'selected' : ''}>PDF</option>
            <option value="Figma" ${file.type === 'Figma' ? 'selected' : ''}>Figma</option>
            <option value="DOCX" ${file.type === 'DOCX' ? 'selected' : ''}>DOCX</option>
            <option value="XLSX" ${file.type === 'XLSX' ? 'selected' : ''}>XLSX</option>
          </select>
          <input id="swal-size" class="swal2-input" placeholder="Size" value="${file.size}" style="font-size:13px; padding:4px 8px; margin:0;">
        </div>
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
        const project = document.getElementById('swal-project').value.trim()
        const type = document.getElementById('swal-type').value
        const size = document.getElementById('swal-size').value.trim()
        if (!name || !project) {
          Swal.showValidationMessage('Name and Project are required')
          return false
        }
        return { name, project, type, size }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        updateFile(file.id, { ...result.value, modified: new Date().toISOString().split('T')[0] })
        Swal.fire('Updated!', 'File details have been updated.', 'success')
      }
    })
  }

  // ---- Toggle Active/Inactive ----
  const handleToggleActive = (file) => {
    const newStatus = !file.active
    const action = newStatus ? 'Active' : 'Inactive'
    Swal.fire({
      title: `Set "${file.name}" as ${action}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, set ${action}`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateFile(file.id, { active: newStatus })
        Swal.fire(`${action}!`, `${file.name} is now ${action}.`, 'success')
      }
    })
  }

  // ---- Delete file ----
  const handleDelete = (file) => {
    Swal.fire({
      title: 'Delete File?',
      text: `You are about to delete "${file.name}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFile(file.id)
        Swal.fire('Deleted!', 'File has been removed.', 'success')
      }
    })
  }

  const filterOptions = ['All Files', 'Project Documents', 'Design Files', 'Development', 'Reports', 'Other']

  return (
    <div>
      {/* Mobile-only styles – no desktop changes */}
      <style>{`
        @media (max-width: 640px) {
          /* Header: stack title and button */
          .files-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .files-header .upload-btn {
            width: 100%;
            justify-content: center;
          }

          /* Filters: make all buttons visible and wrapping */
          .files-filters {
            gap: 0.3rem;
            overflow: visible;
            flex-wrap: wrap;
          }
          .files-filters button {
            font-size: 0.6rem;
            padding: 0.15rem 0.4rem;
            white-space: nowrap;
            flex-shrink: 0;
          }

          /* Storage: stack label and value */
          .files-storage {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }

          /* Table: horizontal scroll, all data visible */
          .files-table-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin: 0 -1rem;
            padding: 0 1rem;
          }
          .files-table-wrap .table {
            min-width: 550px;
            font-size: 0.75rem;
          }
          .files-table-wrap th,
          .files-table-wrap td {
            padding: 0.4rem 0.5rem;
            white-space: nowrap;
          }
          .files-table-wrap th:last-child,
          .files-table-wrap td:last-child {
            padding-right: 0.5rem;
          }
          /* Action buttons: smaller and tighter */
          .files-table-wrap .action-btns {
            gap: 0.2rem;
          }
          .files-table-wrap .action-btns button {
            padding: 0.15rem;
          }
          .files-table-wrap .action-btns svg {
            width: 14px;
            height: 14px;
          }
          /* File name with ellipsis on mobile */
          .files-table-wrap td:first-child .flex {
            gap: 0.3rem;
          }
          .files-table-wrap td:first-child .flex svg {
            width: 14px;
            height: 14px;
          }
          .files-table-wrap td:first-child span {
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-2 files-header">
        <div>
          <h2 className="page-title">Files</h2>
          <p className="text-muted">Manage project documents</p>
        </div>
        <Button variant="primary" onClick={handleUpload} className="upload-btn">
          <Upload size={18} /> Upload File
        </Button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap files-filters">
        {filterOptions.map(f => (
          <Button
            key={f}
            variant={activeFilter === f ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleFilterClick(f)}
            className={`cursor-pointer transition-all ${activeFilter === f ? 'ring-2 ring-primary/30' : ''}`}
          >
            {f}
          </Button>
        ))}
      </div>

      <Card className="mb-4">
        <div className="flex justify-between items-center files-storage">
          <span>Storage</span>
          <span>{usedStorage} GB / {totalStorage} GB</span>
        </div>
        <ProgressBar progress={percentage} />
      </Card>

      <Card>
        <div className="files-table-wrap">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Project</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Size</th>
                  <th className="text-left">Modified</th>
                  <th className="text-left" style={{ width: '160px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map(f => (
                    <tr key={f.id}>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <File size={16} className="text-muted" />
                          <span>{f.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">{f.project}</td>
                      <td className="py-2.5 px-3">{f.type}</td>
                      <td className="py-2.5 px-3">{f.size}</td>
                      <td className="py-2.5 px-3">{f.modified}</td>
                      <td className="py-2.5 px-3" style={{ width: '160px' }}>
                        <div className="flex items-center gap-3 action-btns">
                          {/* Edit – blue */}
                          <button
                            onClick={() => handleEdit(f)}
                            className="p-1 rounded transition-all"
                            style={{ color: '#3b82f6' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Edit file"
                          >
                            <Edit size={16} />
                          </button>
                          {/* Toggle Active – green/red */}
                          <button
                            onClick={() => handleToggleActive(f)}
                            className="p-1 rounded transition-all"
                            style={{ color: f.active ? '#22c55e' : '#ef4444' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = f.active ? '#dcfce7' : '#fee2e2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title={f.active ? 'Set Inactive' : 'Set Active'}
                          >
                            {f.active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </button>
                          {/* Delete – red */}
                          <button
                            onClick={() => handleDelete(f)}
                            className="p-1 rounded transition-all"
                            style={{ color: '#ef4444' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Delete file"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No files found for "{activeFilter}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}