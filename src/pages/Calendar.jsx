 import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Card, Button } from '../components/common/CommonComponents'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Calendar() {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useAppContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1))
  const handleToday = () => setCurrentDate(new Date())

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return calendarEvents.filter(e => e.date === dateStr)
  }

  const isToday = (day) => {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  // ---- Month/Year picker ----
  const handleMonthYearClick = () => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const yearOptions = Array.from({ length: 41 }, (_, i) => 2000 + i)

    Swal.fire({
      title: 'Select Month & Year',
      html: `
        <div style="display:flex; gap:10px; justify-content:center; align-items:center; padding-bottom:40px;">
          <select id="month-select" class="swal2-input" style="width:140px; font-size:14px; padding:6px 12px; margin:0;">
            ${months.map((m, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
          <select id="year-select" class="swal2-input" style="width:140px; font-size:14px; padding:6px 12px; margin:0;">
            ${yearOptions.map(y => 
              `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`
            ).join('')}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Go',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 420,
      padding: '1.5rem 1.5rem 6rem 1.5rem',
      preConfirm: () => {
        const newMonth = parseInt(document.getElementById('month-select').value)
        const newYear = parseInt(document.getElementById('year-select').value)
        return { month: newMonth, year: newYear }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentDate(new Date(result.value.year, result.value.month, 1))
      }
    })
  }

  // ---- Add Event ----
  const handleAddEvent = () => {
    Swal.fire({
      title: 'Add New Event',
      html: `
        <div style="display:flex; flex-direction:column; gap:4px;">
          <input id="swal-title" class="swal2-input" placeholder="Event Title *" style="font-size:14px; padding:6px 12px; margin:0;">
          <input id="swal-date" class="swal2-input" type="date" value="${year}-${String(month + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}" style="font-size:14px; padding:6px 12px; margin:0;">
          <select id="swal-type" class="swal2-input" style="font-size:14px; padding:6px 12px; margin:0;">
            <option value="meeting">Meeting</option>
            <option value="review">Review</option>
            <option value="sprint">Sprint</option>
            <option value="deadline">Deadline</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Event',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#d33',
      width: 400,
      padding: '1rem',
      preConfirm: () => {
        const title = document.getElementById('swal-title').value.trim()
        const date = document.getElementById('swal-date').value
        const type = document.getElementById('swal-type').value
        if (!title) {
          Swal.showValidationMessage('Event title is required')
          return false
        }
        return { title, date, type }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        addCalendarEvent({ ...result.value, id: Date.now() })
        Swal.fire('Added!', 'Event has been added to the calendar.', 'success')
      }
    })
  }

  // ---- Edit Event ----
  const handleEditEvent = (event) => {
    Swal.fire({
      title: 'Edit Event',
      html: `
        <div style="display:flex; flex-direction:column; gap:4px;">
          <input id="swal-title" class="swal2-input" placeholder="Event Title *" value="${event.title}" style="font-size:14px; padding:6px 12px; margin:0;">
          <input id="swal-date" class="swal2-input" type="date" value="${event.date}" style="font-size:14px; padding:6px 12px; margin:0;">
          <select id="swal-type" class="swal2-input" style="font-size:14px; padding:6px 12px; margin:0;">
            <option value="meeting" ${event.type === 'meeting' ? 'selected' : ''}>Meeting</option>
            <option value="review" ${event.type === 'review' ? 'selected' : ''}>Review</option>
            <option value="sprint" ${event.type === 'sprint' ? 'selected' : ''}>Sprint</option>
            <option value="deadline" ${event.type === 'deadline' ? 'selected' : ''}>Deadline</option>
            <option value="milestone" ${event.type === 'milestone' ? 'selected' : ''}>Milestone</option>
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
        const title = document.getElementById('swal-title').value.trim()
        const date = document.getElementById('swal-date').value
        const type = document.getElementById('swal-type').value
        if (!title) {
          Swal.showValidationMessage('Event title is required')
          return false
        }
        return { title, date, type }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        updateCalendarEvent(event.id, result.value)
        Swal.fire('Updated!', 'Event has been updated.', 'success')
      }
    })
  }

  // ---- Delete Event ----
  const handleDeleteEvent = (eventId, title, e) => {
    e.stopPropagation()
    Swal.fire({
      title: 'Delete Event?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCalendarEvent(eventId)
        Swal.fire('Deleted!', 'Event has been removed.', 'success')
      }
    })
  }

  // ---- Delete icon style ----
  const deleteButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #f87171, #dc2626)',
    boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    padding: 0,
    marginLeft: '4px',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    color: 'white',
    verticalAlign: 'middle',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Calendar</h2>
          <p className="text-muted">Schedule your projects and track deadlines</p>
        </div>
        <Button variant="primary" onClick={handleAddEvent}>
          <Plus size={18} /> Add Event
        </Button>
      </div>

      <Card className="calendar-card">
        <div className="calendar-header-row flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" className="nav-btn" onClick={handlePrev}>
              <ChevronLeft size={18} />
            </Button>
            <Button variant="secondary" size="sm" className="nav-btn" onClick={handleNext}>
              <ChevronRight size={18} />
            </Button>
          </div>
          <h3 
            className="calendar-title cursor-pointer hover:text-primary transition-colors text-base sm:text-lg"
            onClick={handleMonthYearClick}
            title="Click to change month/year"
          >
            {currentDate.toLocaleString('default', { month: 'long' })} <span className="year text-muted">{year}</span>
          </h3>
          <Button variant="secondary" size="sm" className="today-btn" onClick={handleToday}>
            Today
          </Button>
        </div>

        <div className="calendar-grid grid grid-cols-7 gap-1 sm:gap-1.5">
          {days.map(d => (
            <div key={d} className="calendar-header text-center text-xs sm:text-sm font-semibold text-muted py-1 sm:py-2">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-empty aspect-square w-full" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const events = getEventsForDay(day)
            return (
              <div 
                key={day} 
                className={`calendar-day aspect-square w-full p-0.5 sm:p-1 rounded-lg border border-transparent transition-all overflow-hidden ${
                  isToday(day) ? 'today border-primary bg-primary/10' : 'hover:border-border hover:bg-muted/20'
                }`}
              >
                <span className={`day-number text-xs sm:text-sm font-medium float-right mr-0.5 mt-0.5 ${
                  isToday(day) ? 'text-primary' : 'text-muted'
                }`}>
                  {day}
                </span>
                <div className="day-events mt-4 sm:mt-5 flex flex-col gap-0.5">
                  {events.map(e => (
                    <div 
                      key={e.id} 
                      className={`event-pill event-${e.type} text-[9px] sm:text-xs px-1.5 py-0.5 rounded-full truncate cursor-pointer hover:scale-105 transition-all flex items-center justify-between gap-0.5`}
                      onClick={() => handleEditEvent(e)}
                    >
                      <span className="truncate flex-1">{e.title}</span>
                      <button
                        onClick={(ev) => handleDeleteEvent(e.id, e.title, ev)}
                        style={deleteButtonStyle}
                        onMouseEnter={(el) => {
                          el.currentTarget.style.transform = 'scale(1.15)'
                          el.currentTarget.style.boxShadow = '0 4px 10px rgba(239,68,68,0.6)'
                        }}
                        onMouseLeave={(el) => {
                          el.currentTarget.style.transform = 'scale(1)'
                          el.currentTarget.style.boxShadow = '0 2px 6px rgba(239,68,68,0.4)'
                        }}
                        title="Delete event"
                      >
                        <X size={9} style={{ strokeWidth: 2.5 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}