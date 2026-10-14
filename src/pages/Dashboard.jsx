 import { useState, useEffect } from 'react'
import { projects, tasks } from '../data/mockData'
import { Card, ProgressBar } from '../components/common/CommonComponents'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
  FolderOpen,
  CheckCircle,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const userName = user?.name || 'Guest'

  // ---------- Data ----------
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status !== 'Completed').length
  const completedTasks = tasks.filter(t => t.status === 'Completed').length
  const overdueTasks = tasks.filter(t => new Date(t.due) < new Date() && t.status !== 'Completed').length

  const statusData = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})
  const pieData = Object.keys(statusData).map(key => ({ name: key, value: statusData[key] }))
  // Pastel colors matching the screenshot theme
  const COLORS = ['#fcd34d', '#60a5fa', '#34d399', '#f472b6', '#a78bfa']

  const chartData = [
    { name: 'Jan', progress: 40 },
    { name: 'Feb', progress: 55 },
    { name: 'Mar', progress: 70 },
    { name: 'Apr', progress: 65 },
    { name: 'May', progress: 85 },
    { name: 'Jun', progress: 90 },
  ]

  const isProjectCompleted = (project) => project.status === 'Completed' || project.progress === 100

  // ---------- Count-up ----------
  const [counts, setCounts] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    overdueTasks: 0
  })

  useEffect(() => {
    const duration = 800
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const ease = 1 - Math.pow(1 - progress, 3)
      setCounts({
        totalProjects: Math.round(ease * totalProjects),
        activeProjects: Math.round(ease * activeProjects),
        completedTasks: Math.round(ease * completedTasks),
        overdueTasks: Math.round(ease * overdueTasks)
      })
      if (step >= steps) {
        clearInterval(timer)
        setCounts({ totalProjects, activeProjects, completedTasks, overdueTasks })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalProjects, activeProjects, completedTasks, overdueTasks])

  // ---------- Stat cards config ----------
  const stats = [
    {
      label: 'Total Projects',
      value: counts.totalProjects,
      change: '+12%',
      trend: 'up',
      icon: FolderOpen,
      bg: 'linear-gradient(135deg, #fef3c7, #fde68a, #fdba74, #fcd34d)',
      c1: 'rgba(251, 146, 60, 0.35)',
      c2: 'rgba(244, 63, 94, 0.25)',
      iconBg: 'bg-white/40',
      iconColor: 'text-amber-800'
    },
    {
      label: 'Active',
      value: counts.activeProjects,
      change: '-3%',
      trend: 'down',
      icon: CheckCircle,
      bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe, #93c5fd, #60a5fa)',
      c1: 'rgba(56, 189, 248, 0.35)',
      c2: 'rgba(99, 102, 241, 0.25)',
      iconBg: 'bg-white/40',
      iconColor: 'text-blue-800'
    },
    {
      label: 'Tasks Completed',
      value: counts.completedTasks,
      change: '+25%',
      trend: 'up',
      icon: CheckSquare,
      bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0, #6ee7b7, #34d399)',
      c1: 'rgba(52, 211, 153, 0.35)',
      c2: 'rgba(16, 185, 129, 0.25)',
      iconBg: 'bg-white/40',
      iconColor: 'text-emerald-800'
    },
    {
      label: 'Overdue',
      value: counts.overdueTasks,
      change: '+8%',
      trend: 'up',
      icon: AlertCircle,
      bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8, #f9a8d4, #f472b6)',
      c1: 'rgba(244, 63, 94, 0.35)',
      c2: 'rgba(168, 85, 247, 0.25)',
      iconBg: 'bg-white/40',
      iconColor: 'text-pink-800'
    }
  ]

  return (
    <div className="dashboard">
      {/* Inline styles – complete */}
      <style>{`
        /* ----- Dashboard Background ----- */
        .dashboard {
          position: relative;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.04) 0%, transparent 70%),
            radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(52,211,153,0.03) 0%, transparent 50%);
        }

        /* ----- Entrance ----- */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { opacity: 1; animation: none !important; }
          .stat-card:hover { transform: none !important; }
        }

        /* ----- Stat Cards (full gradient) ----- */
        .stat-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          overflow: hidden;
          padding: 0;
        }
        .stat-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 40px rgba(99,102,241,0.15), 0 8px 24px rgba(0,0,0,0.06);
          border-color: rgba(255,255,255,0.4);
        }

        .stat-inner {
          position: relative;
          padding: 1.25rem;
          height: 100%;
          overflow: hidden;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
        }
        .stat-inner::before,
        .stat-inner::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          transition: transform 0.6s ease, opacity 0.6s ease;
        }
        .stat-inner::before {
          width: 140px;
          height: 140px;
          top: -40px;
          right: -40px;
          background: radial-gradient(circle, var(--c1, rgba(255,255,255,0.25)) 0%, transparent 70%);
          animation: float1 12s ease-in-out infinite alternate;
        }
        .stat-inner::after {
          width: 90px;
          height: 90px;
          bottom: -30px;
          left: -30px;
          background: radial-gradient(circle, var(--c2, rgba(255,255,255,0.2)) 0%, transparent 70%);
          animation: float2 14s ease-in-out infinite alternate-reverse;
        }
        @keyframes float1 {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(10px,-15px) scale(1.15); }
        }
        @keyframes float2 {
          0% { transform: translate(0,0) scale(1); }
          100% { transform: translate(-10px,15px) scale(1.2); }
        }
        .stat-card:hover .stat-inner::before,
        .stat-card:hover .stat-inner::after {
          transform: scale(1.3) rotate(4deg);
          opacity: 0.9;
        }

        .stat-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(4px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .stat-card:hover .stat-icon {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* ----- Chart Cards ----- */
        .chart-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: var(--card);
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .chart-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.08);
        }

        /* ----- Area chart gradient animation ----- */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .area-gradient-fill {
          animation: shimmer 6s ease-in-out infinite alternate;
        }

        /* ----- Pie chart slice glow (via CSS) ----- */
        .pie-slice {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
          transition: filter 0.3s ease;
        }
        .chart-card:hover .pie-slice {
          filter: drop-shadow(0 4px 12px rgba(99,102,241,0.2));
        }

        /* ----- Table & Task hover ----- */
        .table-hover tbody tr {
          transition: background-color 0.25s ease, transform 0.2s ease;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(99,102,241,0.05);
          transform: translateX(4px);
        }
        .task-item {
          transition: background-color 0.25s ease, transform 0.2s ease;
        }
        .task-item:hover {
          background-color: rgba(99,102,241,0.04);
          transform: translateX(4px);
        }

        /* ----- Dark mode adjustments ----- */
        [data-theme="dark"] .stat-inner::before,
        [data-theme="dark"] .stat-inner::after {
          opacity: 0.25;
        }
        [data-theme="dark"] .stat-icon {
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
        }
        [data-theme="dark"] .stat-card {
          border-color: rgba(255,255,255,0.05);
        }
        [data-theme="dark"] .stat-card:hover {
          border-color: rgba(255,255,255,0.2);
        }
        [data-theme="dark"] .stat-content p,
        [data-theme="dark"] .stat-content h3 {
          color: #fff !important;
        }
        [data-theme="dark"] .stat-content .text-black\\/50 {
          color: rgba(255,255,255,0.5) !important;
        }
        [data-theme="dark"] .stat-content .text-emerald-700 { color: #34d399 !important; }
        [data-theme="dark"] .stat-content .text-rose-700 { color: #fb7185 !important; }
        [data-theme="dark"] .stat-content .text-amber-800 { color: #fbbf24 !important; }
        [data-theme="dark"] .stat-content .text-blue-800 { color: #60a5fa !important; }
        [data-theme="dark"] .stat-content .text-pink-800 { color: #f472b6 !important; }

        [data-theme="dark"] .chart-card {
          background: var(--card);
          border-color: rgba(255,255,255,0.05);
        }
        [data-theme="dark"] .chart-card:hover {
          border-color: rgba(255,255,255,0.15);
        }

        /* ----- Responsive ----- */
        @media (max-width: 1024px) {
          .dashboard .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
          .dashboard .grid-cols-3 { grid-template-columns: 1fr 1fr; }
          .dashboard .grid-cols-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dashboard .grid-cols-4 { grid-template-columns: 1fr; }
          .dashboard .grid-cols-3 { grid-template-columns: 1fr; }
          .stat-inner { padding: 1rem; }
          .stat-icon { width: 40px; height: 40px; }
          .stat-icon svg { width: 18px; height: 18px; }
        }
      `}</style>

      {/* Header – New Project button removed */}
      <div className="flex justify-between items-center gap-2 mb-6 fade-up" style={{ animationDelay: '0.05s' }}>
        <div>
          <h2 className="page-title">Good morning, {userName}! 👋</h2>
          <p className="text-muted">Here's what's happening with your projects today.</p>
        </div>
      </div>

      {/* Stats – 4 cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isUp = stat.trend === 'up'

          return (
            <Card
              key={index}
              className="stat-card fade-up"
              style={{ animationDelay: `${0.12 + index * 0.08}s` }}
            >
              <div
                className="stat-inner"
                style={{ background: stat.bg, '--c1': stat.c1, '--c2': stat.c2 }}
              >
                <div className="flex items-start justify-between">
                  <div className="stat-content flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.6)' }}>
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-bold mt-1" style={{ color: 'rgba(0,0,0,0.8)' }}>
                      {stat.value}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`text-xs font-medium flex items-center gap-0.5 ${isUp ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {stat.change}
                      </span>
                      <span className="text-xs text-black/50">vs last month</span>
                    </div>
                  </div>
                  <div className={`stat-icon ${stat.iconBg} ${stat.iconColor} ml-3`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts – Area + Pie */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="col-span-2 chart-card fade-up" style={{ animationDelay: '0.5s' }}>
          <h4 className="mb-3 text-sm font-medium flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            Project Progress
          </h4>
          <div className="chart-container" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#grad)"
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="chart-card fade-up" style={{ animationDelay: '0.58s' }}>
          <h4 className="mb-3 text-sm font-medium flex items-center gap-2">
            <PieChartIcon size={18} className="text-primary" />
            Status Overview
          </h4>
          <div className="chart-container" style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={2}
                      className="pie-slice"
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* No text labels below – only the chart */}
        </Card>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="fade-up" style={{ animationDelay: '0.66s' }}>
          <h4 className="mb-3 text-sm font-medium flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Recent Projects
          </h4>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th className="text-xs font-semibold text-muted uppercase tracking-wider">Project</th>
                  <th className="text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-xs font-semibold text-muted uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 4).map((p, idx) => (
                  <tr key={p.id} className="fade-up" style={{ animationDelay: `${0.74 + idx * 0.08}s` }}>
                    <td className="py-2">
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-muted">{p.owner}</div>
                    </td>
                    <td className="py-2">
                      <span className={`text-xs font-medium ${isProjectCompleted(p) ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isProjectCompleted(p) ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <ProgressBar progress={p.progress} />
                        <span className="text-xs text-muted">{p.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="fade-up" style={{ animationDelay: '0.74s' }}>
          <h4 className="mb-3 text-sm font-medium flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Upcoming Deadlines
          </h4>
          <div className="task-list flex flex-col gap-2">
            {tasks.filter(t => t.status !== 'Completed').slice(0, 4).map((t, idx) => (
              <div
                key={t.id}
                className="task-item flex justify-between items-center py-2.5 border-b border-border last:border-0 rounded px-2 transition-colors fade-up"
                style={{ animationDelay: `${0.82 + idx * 0.08}s` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.title}</div>
                  <div className="text-xs text-muted truncate">{t.project}</div>
                </div>
                <div className="text-xs text-muted ml-2 flex-shrink-0">{t.due}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}