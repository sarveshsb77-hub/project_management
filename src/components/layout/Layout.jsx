 import { useState } from 'react'
import { Outlet } from 'react-router-dom' // ✅ Crucial change: Import Outlet
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import './Layout.css'

export default function Layout() { // ✅ Removed { children } prop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />
      <div className="main-wrapper">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <Outlet /> {/* ✅ Replaced {children} with Outlet */}
        </main>
      </div>
    </div>
  )
}