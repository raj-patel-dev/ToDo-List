import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

type Status = 'todo' | 'inProgress' | 'completed'
type Priority = 'low' | 'normal' | 'high'
type Task = { _id: string; title: string; description: string; status: Status; priority: Priority; dueDate: string; createdAt?: string }
type NewTask = Omit<Task, '_id' | 'createdAt'>

const apiUrl = import.meta.env.VITE_API_URL ?? ''
const columns: { status: Status; label: string; symbol: string }[] = [
  { status: 'todo', label: 'To do', symbol: '○' },
  { status: 'inProgress', label: 'In progress', symbol: '◐' },
  { status: 'completed', label: 'Completed', symbol: '✓' },
]

const initialForm: NewTask = { title: '', description: '', status: 'todo', priority: 'normal', dueDate: '' }

function getData(payload: unknown): Task[] {
  if (Array.isArray(payload)) return payload as Task[]
  const item = payload as { data?: unknown }
  if (Array.isArray(item?.data)) return item.data as Task[]
  if (item?.data && typeof item.data === 'object' && Array.isArray((item.data as { data?: unknown }).data)) return (item.data as { data: Task[] }).data
  return []
}

function dateLabel(value: string) {
  if (!value) return 'No date'
  const date = new Date(value)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const target = new Date(date); target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
}

function TaskCard({ task, isMenuOpen, onToggleMenu, onMove }: { task: Task; isMenuOpen: boolean; onToggleMenu: () => void; onMove: (status: Status) => void }) {
  return <article className="task-card">
    <div className="card-top"><span className={`priority ${task.priority}`}>{task.priority}</span><button aria-label={`Actions for ${task.title}`} aria-expanded={isMenuOpen} className="move-menu" onClick={onToggleMenu}>•••</button></div>
    {isMenuOpen && <div className="task-menu" role="menu"><strong>Move task to</strong>{columns.map(column => <button key={column.status} role="menuitem" disabled={task.status === column.status} onClick={() => onMove(column.status)}>{column.symbol} {column.label}</button>)}</div>}
    <h4>{task.title}</h4><p>{task.description}</p>
    <footer><span className="due">◷ {dateLabel(task.dueDate)}</span><select aria-label={`Change ${task.title} status`} value={task.status} onChange={event => onMove(event.target.value as Status)}><option value="todo">To do</option><option value="inProgress">In progress</option><option value="completed">Completed</option></select></footer>
  </article>
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewTask>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [view, setView] = useState<'workspace' | 'activity' | 'calendar'>('workspace')
  const [menuTask, setMenuTask] = useState<string | null>(null)

  async function loadTasks() {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/tasks/check?limit=100`)
      if (!response.ok) throw new Error('Could not load tasks')
      setTasks(getData(await response.json()))
    } catch {
      setMessage('Unable to reach the API. Start the backend at port 5000, then refresh.')
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadTasks() }, [])

  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter
    const phrase = search.toLowerCase()
    return matchesFilter && (!phrase || `${task.title} ${task.description}`.toLowerCase().includes(phrase))
  }), [tasks, filter, search])

  async function createTask(event: FormEvent) {
    event.preventDefault()
    setSaving(true); setMessage('')
    try {
      const response = await fetch(`${apiUrl}/tasks/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!response.ok) throw new Error('Creation failed')
      const saved = (await response.json()) as Task | { data: Task }
      const task = 'data' in saved ? saved.data : saved
      setTasks(current => [task, ...current])
      setForm(initialForm); setShowForm(false); setMessage('Task added to your workspace.')
    } catch { setMessage('Task could not be saved. Please check the backend connection.') }
    finally { setSaving(false) }
  }

  async function moveTask(task: Task, status: Status) {
    if (status === task.status) return
    const previous = tasks
    setTasks(current => current.map(item => item._id === task._id ? { ...item, status } : item))
    try {
      const response = await fetch(`${apiUrl}/tasks/change`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: task._id, status }) })
      if (!response.ok) throw new Error('Update failed')
      setMessage(`Moved “${task.title}” to ${columns.find(column => column.status === status)?.label}.`)
    } catch { setTasks(previous); setMessage('The status update could not be saved.') }
  }

  const completed = tasks.filter(task => task.status === 'completed').length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top"><span className="brand-mark">✦</span> flowlist</a>
      <nav aria-label="Workspace navigation"><button className={`nav-item ${view === 'workspace' ? 'active' : ''}`} onClick={() => setView('workspace')}>▦ <span>My workspace</span></button><button className={`nav-item ${view === 'activity' ? 'active' : ''}`} onClick={() => setView('activity')}>◔ <span>Activity</span></button><button className={`nav-item ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>□ <span>Calendar</span></button></nav>
      <div className="sidebar-bottom"><p>YOUR PROGRESS</p><strong>{progress}% complete</strong><div className="progress"><i style={{ width: `${progress}%` }} /></div><span>{completed} of {tasks.length} tasks done</span></div>
    </aside>
    <section className="content" id="top">
      <header><button className="mobile-logo" aria-label="Flowlist">✦</button><div><p className="eyebrow">MONDAY, AUGUST 17</p><h1>Make today count.</h1></div><div className="header-actions"><button className="icon-button" aria-label="Notifications">♧</button><button className="avatar" aria-label="User profile">AP</button></div></header>
      <section className="welcome"><div><span className="pill">FOCUS MODE</span><h2>What will you move forward?</h2><p>Small, deliberate progress adds up. Pick a task and give it your full attention.</p><button className="primary" onClick={() => setShowForm(true)}>＋ New task</button></div><div className="orbital" aria-hidden="true"><span>✦</span><i /><b /></div></section>
      {view === 'workspace' && <section className="toolbar" id="board"><div className="tabs"><button className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>All tasks <small>{tasks.length}</small></button>{columns.map(column => <button key={column.status} className={filter === column.status ? 'selected' : ''} onClick={() => setFilter(column.status)}>{column.label} <small>{tasks.filter(task => task.status === column.status).length}</small></button>)}</div><label className="search">⌕ <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search tasks" /></label></section>}
      {message && <div className="notice" role="status">{message}<button onClick={() => setMessage('')} aria-label="Dismiss">×</button></div>}
      {view === 'workspace' && <section className="board" aria-label="Task board">{columns.map(column => <div className="task-column" key={column.status}><div className={`column-title ${column.status}`}><span>{column.symbol}</span><h3>{column.label}</h3><em>{visibleTasks.filter(task => task.status === column.status).length}</em></div><div className="task-stack">{loading ? <div className="empty">Loading tasks…</div> : visibleTasks.filter(task => task.status === column.status).map(task => <TaskCard key={task._id} task={task} isMenuOpen={menuTask === task._id} onToggleMenu={() => setMenuTask(current => current === task._id ? null : task._id)} onMove={status => { setMenuTask(null); void moveTask(task, status) }} />)}{!loading && visibleTasks.filter(task => task.status === column.status).length === 0 && <div className="empty">Nothing here yet</div>}</div><button className="add-link" onClick={() => { setForm(current => ({ ...current, status: column.status })); setShowForm(true) }}>＋ Add task</button></div>)}</section>}
      {view === 'activity' && <section className="view-panel"><p className="eyebrow">WORKSPACE ACTIVITY</p><h2>Progress at a glance</h2><div className="activity-grid">{columns.map(column => <article key={column.status}><span className={`activity-symbol ${column.status}`}>{column.symbol}</span><strong>{tasks.filter(task => task.status === column.status).length}</strong><p>{column.label} tasks</p></article>)}</div><div className="activity-summary"><h3>Completion rate</h3><strong>{progress}%</strong><div className="progress"><i style={{ width: `${progress}%` }} /></div><p>{completed} of {tasks.length} tasks are complete.</p></div></section>}
      {view === 'calendar' && <section className="view-panel"><p className="eyebrow">UPCOMING DEADLINES</p><h2>Your calendar</h2><div className="calendar-list">{[...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(task => <article key={task._id}><time>{dateLabel(task.dueDate)}</time><div><strong>{task.title}</strong><p>{task.description}</p></div><span className={`priority ${task.priority}`}>{task.priority}</span></article>)}{tasks.length === 0 && <div className="empty">No tasks scheduled yet</div>}</div></section>}
    </section>
    {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowForm(false)}><form className="task-modal" onSubmit={createTask} onMouseDown={event => event.stopPropagation()}><div className="modal-heading"><div><p className="eyebrow">CREATE A TASK</p><h2>Set your next move</h2></div><button type="button" className="close" onClick={() => setShowForm(false)}>×</button></div><label>Task title<input required maxLength={100} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="e.g. Review campaign outline" /></label><label>Description<textarea required maxLength={500} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} placeholder="Add a little context…" /></label><div className="form-row"><label>Due date<input required type="date" value={form.dueDate} onChange={event => setForm({ ...form, dueDate: event.target.value })} /></label><label>Priority<select value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value as Priority })}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></label></div><div className="modal-actions"><button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button><button className="primary" disabled={saving}>{saving ? 'Adding…' : 'Create task'}</button></div></form></div>}
  </main>
}
