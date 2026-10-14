 import { useState } from 'react'
import { notifications as initialNotifications } from '../data/mockData'
import { Card, Button } from '../components/common/CommonComponents'
import { Bell, CheckCircle, Settings } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications)

  // ---- Mark all read with SweetAlert2 ----
  const markAllRead = () => {
    Swal.fire({
      title: 'Mark all as read?',
      text: 'This will mark all notifications as read.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark all read',
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(items.map(n => ({ ...n, read: true })))
        Swal.fire({
          icon: 'success',
          title: 'All marked as read!',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end',
          toast: true,
        })
      }
    })
  }

  // ---- Settings icon with SweetAlert2 ----
  const handleSettings = () => {
    Swal.fire({
      title: 'Notification Settings',
      text: 'You can configure notification preferences here.',
      icon: 'info',
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'OK',
    })
  }

  // ---- Individual notification click (optional) ----
  const markAsRead = (id) => {
    setItems(items.map(n => n.id === id ? { ...n, read: true } : n))
    Swal.fire({
      icon: 'success',
      title: 'Marked as read',
      timer: 800,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="text-muted">Stay updated</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCircle size={16} className="mr-1" /> Mark all read
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSettings}>
            <Settings size={16} />
          </Button>
        </div>
      </div>

      <Card>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <Bell size={40} className="mx-auto mb-3 text-muted/40" />
            <p>No notifications</p>
          </div>
        ) : (
          items.map(n => (
            <div
              key={n.id}
              className={`notif-row flex justify-between items-center p-3 border-b last:border-0 cursor-pointer transition-all hover:bg-muted/30 ${n.read ? 'opacity-70' : 'bg-primary-light'}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className={n.read ? 'text-muted' : 'text-primary'} />
                <div>
                  {/* All titles now use the same dark color (text-foreground) */}
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="text-sm text-muted">{n.message}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-xs text-muted">{n.time}</span>
                {!n.read && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}