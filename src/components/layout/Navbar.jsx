 import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Search, Bell, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar({ toggleSidebar }) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showNotif, setShowNotif] = useState(false)

  const themeMenuRef = useRef(null)
  const notifRef = useRef(null)
  const searchInputRef = useRef(null)

  const pageTitle = location.pathname.replace('/', '').split('/')[0] || 'Dashboard'
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

  const displayName = user?.name || 'Guest'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input
  const focusSearch = (e) => {
    e.preventDefault()
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="page-title">{formattedTitle}</h2>
      </div>

      <div className="navbar-right">
        <div className="search-box hide-mobile" onClick={focusSearch}>
          <Search size={18} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search projects..."
          />
        </div>

        <div className="nav-actions">
          {/* Theme dropdown */}
          <div className="theme-menu-wrapper" ref={themeMenuRef}>
            <button className="icon-btn" onClick={() => setShowThemeMenu(!showThemeMenu)}>
              {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
            </button>
            {showThemeMenu && (
              <div className="dropdown">
                <button onClick={() => { toggleTheme('light'); setShowThemeMenu(false); }}><Sun size={16} /> Light</button>
                <button onClick={() => { toggleTheme('dark'); setShowThemeMenu(false); }}><Moon size={16} /> Dark</button>
                <button onClick={() => { toggleTheme('system'); setShowThemeMenu(false); }}><Monitor size={16} /> System</button>
              </div>
            )}
          </div>

          {/* Notification dropdown */}
          <div className="notif-wrapper" ref={notifRef}>
            <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            {showNotif && (
              <div className="dropdown notif-dropdown">
                <div className="notif-header">
                  <span>Notifications</span>
                  <button className="text-btn">Mark all read</button>
                </div>
                <div className="notif-item">
                  <p><strong>New Task</strong> assigned to you</p>
                  <span>5 min ago</span>
                </div>
                <div className="notif-item">
                  <p><strong>Project Deadline</strong> approaching</p>
                  <span>1 hour ago</span>
                </div>
              </div>
            )}
          </div>

          <div className="user-profile hide-mobile">
            <div className="avatar-small">{initials}</div>
            <div className="user-details">
              <span className="user-name">{displayName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}