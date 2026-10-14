import { useState, useEffect } from 'react'
import { Card, Button } from '../components/common/CommonComponents'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'
import { User, Palette, Settings as SettingsIcon } from 'lucide-react'
import Swal from 'sweetalert2'

export default function Settings() {
  const { user, updateUser } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [settings, setSettings] = useState({
    name: '',
    email: '',
    language: 'English',
    timezone: 'UTC',
  })

  useEffect(() => {
    if (user) {
      setSettings({
        name: user.name || '',
        email: user.email || '',
        language: 'English',
        timezone: 'UTC',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    if (updateUser) {
      updateUser({
        name: settings.name,
        email: settings.email,
      })
    } else {
      const stored = JSON.parse(
        localStorage.getItem('promanage_user') || '{}'
      )

      const updated = {
        ...stored,
        name: settings.name,
        email: settings.email,
      }

      localStorage.setItem(
        'promanage_user',
        JSON.stringify(updated)
      )
    }

    Swal.fire({
      icon: 'success',
      title: 'Saved!',
      text: 'Your settings have been updated.',
      timer: 1500,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    })
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-muted text-sm">
        Loading...
      </div>
    )
  }

  return (
    <div className="settings-page">

      {/* Header */}
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Manage your preferences</p>
      </div>

      {/* Settings Cards */}
      <div className="settings-grid">

        {/* Profile Card */}
        <Card className="settings-card">
          <div className="settings-card-title">
            <User size={18} className="text-primary" />
            <span>Profile</span>
          </div>

          <p className="settings-card-description">
            Manage personal details
          </p>

          <div className="settings-form">

            <div>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>

            <div>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

          </div>

          <Button
            variant="primary"
            className="settings-save-button"
            onClick={handleSave}
          >
            Save
          </Button>
        </Card>


        {/* Appearance Card */}
        <Card className="settings-card">
          <div className="settings-card-title">
            <Palette size={18} className="text-primary" />
            <span>Appearance</span>
          </div>

          <p className="settings-card-description">
            Customize theme
          </p>

          <div className="theme-buttons">

            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => toggleTheme('light')}
              className={
                theme === 'light'
                  ? 'theme-button active'
                  : 'theme-button'
              }
            >
              Light
            </Button>

            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => toggleTheme('dark')}
              className={
                theme === 'dark'
                  ? 'theme-button active'
                  : 'theme-button'
              }
            >
              Dark
            </Button>

            <Button
              variant={theme === 'system' ? 'primary' : 'secondary'}
              onClick={() => toggleTheme('system')}
              className={
                theme === 'system'
                  ? 'theme-button active'
                  : 'theme-button'
              }
            >
              System
            </Button>

          </div>

          <div className="current-theme">
            <span>Current:</span>
            <span className="current-theme-value">
              {theme}
            </span>
          </div>
        </Card>


        {/* Preferences Card */}
        <Card className="settings-card">
          <div className="settings-card-title">
            <SettingsIcon size={18} className="text-primary" />
            <span>Preferences</span>
          </div>

          <p className="settings-card-description">
            Set your preferences
          </p>

          <div className="settings-form">

            <div>
              <label>Language</label>

              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            <div>
              <label>Timezone</label>

              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
              >
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
                <option>IST</option>
                <option>GMT</option>
              </select>
            </div>

          </div>
        </Card>

      </div>
    </div>
  )
}