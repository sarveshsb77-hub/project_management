 import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AppContext = createContext();

// ---------- Initial Mock Data ----------
const initialProjects = [
  { id: 1, name: 'Website Redesign', description: 'Complete overhaul of company website', owner: 'John Doe', progress: 85, tasks: 12, due: '2026-03-15', priority: 'High', status: 'On Track', color: '#6366f1' },
  { id: 2, name: 'Mobile App Development', description: 'Cross-platform mobile app', owner: 'Sarah Johnson', progress: 60, tasks: 24, due: '2026-05-01', priority: 'High', status: 'Active', color: '#22c55e' },
  { id: 3, name: 'ERP System', description: 'Internal ERP integration', owner: 'David Brown', progress: 45, tasks: 18, due: '2026-06-20', priority: 'Medium', status: 'At Risk', color: '#ef4444' },
  { id: 4, name: 'Marketing Website', description: 'Marketing landing pages', owner: 'Emily Davis', progress: 90, tasks: 8, due: '2026-02-28', priority: 'Low', status: 'Completed', color: '#eab308' },
  { id: 5, name: 'Design System', description: 'Component library', owner: 'Michael Wilson', progress: 30, tasks: 15, due: '2026-07-15', priority: 'Medium', status: 'Delayed', color: '#6366f1' },
  { id: 6, name: 'CRM Integration', description: 'Salesforce integration', owner: 'Jessica Taylor', progress: 50, tasks: 20, due: '2026-04-10', priority: 'High', status: 'Pending', color: '#22c55e' },
];

const initialTasks = [
  { id: 1, title: 'Create Landing Page', project: 'Website Redesign', assignee: 'Sarah Johnson', priority: 'High', status: 'To Do', due: '2026-02-20' },
  { id: 2, title: 'Homepage Design', project: 'Website Redesign', assignee: 'Sarah Johnson', priority: 'High', status: 'In Progress', due: '2026-02-22' },
  { id: 3, title: 'Login Page Design', project: 'Website Redesign', assignee: 'David Brown', priority: 'Medium', status: 'Completed', due: '2026-02-18' },
  { id: 4, title: 'API Integration', project: 'Mobile App Development', assignee: 'Emily Davis', priority: 'Critical', status: 'In Progress', due: '2026-03-01' },
  { id: 5, title: 'Dashboard UI', project: 'Mobile App Development', assignee: 'Sarah Johnson', priority: 'High', status: 'To Do', due: '2026-03-05' },
  { id: 6, title: 'User Documentation', project: 'ERP System', assignee: 'Michael Wilson', priority: 'Low', status: 'To Do', due: '2026-04-01' },
  { id: 7, title: 'Testing', project: 'Marketing Website', assignee: 'Jessica Taylor', priority: 'Medium', status: 'In Progress', due: '2026-02-25' },
  { id: 8, title: 'Database Setup', project: 'CRM Integration', assignee: 'David Brown', priority: 'High', status: 'Completed', due: '2026-03-10' },
];

const initialTeam = [
  { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD', status: 'Online', projects: 6, tasks: 12, workload: 75 },
  { id: 2, name: 'Sarah Johnson', role: 'UI/UX Designer', avatar: 'SJ', status: 'Busy', projects: 4, tasks: 8, workload: 90 },
  { id: 3, name: 'David Brown', role: 'Frontend Developer', avatar: 'DB', status: 'Online', projects: 5, tasks: 15, workload: 60 },
  { id: 4, name: 'Emily Davis', role: 'Backend Developer', avatar: 'ED', status: 'Offline', projects: 3, tasks: 6, workload: 40 },
  { id: 5, name: 'Michael Wilson', role: 'DevOps Engineer', avatar: 'MW', status: 'Online', projects: 4, tasks: 9, workload: 80 },
  { id: 6, name: 'Jessica Taylor', role: 'QA Tester', avatar: 'JT', status: 'Busy', projects: 4, tasks: 18, workload: 85 },
];

const initialFiles = [
  { id: 1, name: 'Project Proposal.pdf', project: 'Website Redesign', type: 'PDF', size: '2.4 MB', modified: '2026-02-10' },
  { id: 2, name: 'Homepage Design.fig', project: 'Website Redesign', type: 'Figma', size: '12 MB', modified: '2026-02-12' },
  { id: 3, name: 'Development Notes.docx', project: 'Mobile App', type: 'DOCX', size: '4.1 MB', modified: '2026-02-15' },
  { id: 4, name: 'Project Report.xlsx', project: 'ERP System', type: 'XLSX', size: '8.2 MB', modified: '2026-02-18' },
  { id: 5, name: 'Project Report.pdf', project: 'Marketing Website', type: 'PDF', size: '1.5 MB', modified: '2026-02-20' },
  { id: 6, name: 'API Documentation.pdf', project: 'CRM Integration', type: 'PDF', size: '3.2 MB', modified: '2026-02-22' },
];

const initialNotifications = [
  { id: 1, title: 'New Task Assigned', message: 'You have been assigned to Dashboard UI', time: '5 min ago', read: false },
  { id: 2, title: 'Task Completed', message: 'Login Page Design is completed', time: '1 hour ago', read: false },
  { id: 3, title: 'Project Deadline Approaching', message: 'Website Redesign due in 3 days', time: '3 hours ago', read: false },
  { id: 4, title: 'New File Uploaded', message: 'Homepage Design.fig uploaded', time: '1 day ago', read: true },
  { id: 5, title: 'Team Activity', message: 'Sarah joined the project', time: '2 days ago', read: true },
];

const initialCalendar = [
  { id: 1, title: 'Project Kickoff', date: '2026-03-01', type: 'meeting' },
  { id: 2, title: 'Design Review', date: '2026-03-05', type: 'review' },
  { id: 3, title: 'Sprint Planning', date: '2026-03-10', type: 'sprint' },
  { id: 4, title: 'API Deadline', date: '2026-03-15', type: 'deadline' },
  { id: 5, title: 'Client Meeting', date: '2026-03-20', type: 'meeting' },
  { id: 6, title: 'Progress Update', date: '2026-03-25', type: 'review' },
  { id: 7, title: 'Testing Start', date: '2026-03-28', type: 'milestone' },
];

// ---------- Context Provider ----------
export function AppProvider({ children }) {
  // --- State with localStorage persistence ---
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('app_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('app_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('app_team');
    return saved ? JSON.parse(saved) : initialTeam;
  });
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('app_files');
    return saved ? JSON.parse(saved) : initialFiles;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('app_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('app_calendarEvents');
    return saved ? JSON.parse(saved) : initialCalendar;
  });

  // Persist on change
  useEffect(() => { localStorage.setItem('app_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('app_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('app_team', JSON.stringify(teamMembers)); }, [teamMembers]);
  useEffect(() => { localStorage.setItem('app_files', JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem('app_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('app_calendarEvents', JSON.stringify(calendarEvents)); }, [calendarEvents]);

  // ----- Projects CRUD -----
  const addProject = (project) => {
    const newProject = { ...project, id: Date.now() };
    setProjects([...projects, newProject]);
    Swal.fire('Success', 'Project created successfully!', 'success');
    return newProject;
  };

  const updateProject = (id, updates) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    Swal.fire('Updated', 'Project updated successfully!', 'success');
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // ----- Tasks CRUD -----
  const addTask = (task) => {
    const newTask = { ...task, id: Date.now() };
    setTasks([...tasks, newTask]);
    Swal.fire('Success', 'Task created successfully!', 'success');
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    Swal.fire('Updated', 'Task updated successfully!', 'success');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // ----- Team CRUD -----
  const addTeamMember = (member) => {
    const newMember = { ...member, id: Date.now() };
    setTeamMembers([...teamMembers, newMember]);
    Swal.fire('Success', 'Team member added!', 'success');
    return newMember;
  };

  const updateTeamMember = (id, updates) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, ...updates } : m));
    Swal.fire('Updated', 'Member updated!', 'success');
  };

  const deleteTeamMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  // ----- Files CRUD -----
  const addFile = (file) => {
    const newFile = { ...file, id: Date.now() };
    setFiles([...files, newFile]);
    Swal.fire('Success', 'File uploaded!', 'success');
    return newFile;
  };

  const updateFile = (id, updates) => {
    setFiles(files.map(f => f.id === id ? { ...f, ...updates } : f));
    Swal.fire('Updated', 'File updated!', 'success');
  };

  const deleteFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  // ----- Notifications CRUD -----
  const addNotification = (notif) => {
    const newNotif = { ...notif, id: Date.now(), read: false };
    setNotifications([newNotif, ...notifications]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // ----- Calendar CRUD -----
  const addCalendarEvent = (event) => {
    const newEvent = { ...event, id: Date.now() };
    setCalendarEvents([...calendarEvents, newEvent]);
    Swal.fire('Success', 'Event added!', 'success');
    return newEvent;
  };

  const updateCalendarEvent = (id, updates) => {
    setCalendarEvents(calendarEvents.map(e => e.id === id ? { ...e, ...updates } : e));
    Swal.fire('Updated', 'Event updated!', 'success');
  };

  const deleteCalendarEvent = (id) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
  };

  // ---------- Context Value ----------
  const value = {
    projects, setProjects, addProject, updateProject, deleteProject,
    tasks, setTasks, addTask, updateTask, deleteTask,
    teamMembers, setTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember,
    files, setFiles, addFile, updateFile, deleteFile,
    notifications, setNotifications, addNotification, markNotificationRead, deleteNotification,
    calendarEvents, setCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);