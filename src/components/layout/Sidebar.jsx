 import { Link, useLocation } from 'react-router-dom'
import { navItems } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation()
  const { user } = useAuth()

  // Get user's name and role – fallback if not logged in
  const displayName = user?.name || 'Guest'
  const displayRole = user?.role || 'User'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="logo">ProManage</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${active ? 'active' : ''}`}
                onClick={() => toggleSidebar(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{displayName}</span>
              <span className="user-role">{displayRole}</span>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={() => toggleSidebar(false)} />}
    </>
  )
}