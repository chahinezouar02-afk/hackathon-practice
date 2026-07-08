import { useState, useRef } from 'react'

const SAMPLE_TASKS = [
  { id: '1', text: 'Review Q3 product roadmap with design team', completed: false, createdAt: new Date('2026-07-07T09:00:00') },
  { id: '2', text: 'Update API documentation for v2.1 endpoints', completed: true, createdAt: new Date('2026-07-06T14:30:00') },
  { id: '3', text: 'Schedule user research sessions for August sprint', completed: false, createdAt: new Date('2026-07-07T11:00:00') },
]

function formatDate(date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function App() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [deletingId, setDeletingId] = useState(null)
  const inputRef = useRef(null)

  const addTask = () => {
    const text = input.trim()
    if (!text) return
    const task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    setTasks(prev => [task, ...prev])
    setInput('')
    inputRef.current?.focus()
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id) => {
    setDeletingId(id)
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== id))
      setDeletingId(null)
    }, 280)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask()
  }

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const activeCount = tasks.filter(t => !t.completed).length
  const doneCount = tasks.filter(t => t.completed).length

  return (
    <div
      style={{ fontFamily: 'Inter, sans-serif', background: '#0b0e1f', minHeight: '100vh' }}
      className="flex flex-col items-center px-4 py-12 sm:py-16"
    >
      {/* Header */}
      <div className="w-full max-w-xl mb-10">
        <div className="flex items-end gap-4 mb-1">
          <h1
            style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff', lineHeight: 1 }}
            className="text-5xl font-bold tracking-tight"
          >
            Tasks
          </h1>
          <span
            style={{ fontFamily: 'Outfit, sans-serif', color: '#b8ff47', lineHeight: 1 }}
            className="text-5xl font-bold tracking-tight"
          >
            {tasks.length}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13 }} className="mt-2">
          {activeCount} remaining · {doneCount} completed
        </p>
      </div>

      {/* Add Task Input */}
      <div className="w-full max-w-xl mb-6">
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 14,
            display: 'flex',
            gap: 8,
            padding: '8px 8px 8px 16px',
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task…"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: 15,
              flex: 1,
              fontFamily: 'Inter, sans-serif',
            }}
            className="placeholder:text-white/25"
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            style={{
              background: input.trim() ? '#b8ff47' : 'rgba(184,255,71,0.18)',
              color: input.trim() ? '#0b0e1f' : 'rgba(184,255,71,0.4)',
              border: 'none',
              borderRadius: 9,
              padding: '9px 20px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Outfit, sans-serif',
              cursor: input.trim() ? 'pointer' : 'default',
              transition: 'background 0.2s, color 0.2s, transform 0.1s',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
            onMouseDown={e => { if (input.trim()) e.currentTarget.style.transform = 'scale(0.96)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="w-full max-w-xl mb-5 flex gap-1">
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: filter === f ? '#ffffff' : 'rgba(255,255,255,0.38)',
              border: '1px solid',
              borderColor: filter === f ? 'rgba(255,255,255,0.15)' : 'transparent',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: filter === f ? 500 : 400,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.15s',
              textTransform: 'capitalize',
              letterSpacing: '0.01em',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="w-full max-w-xl flex flex-col gap-2">
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.22)',
              fontSize: 14,
              padding: '40px 0',
            }}
          >
            {filter === 'done' ? 'No completed tasks yet.' : 'Nothing here. Add a task above.'}
          </div>
        )}

        {filtered.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            deleting={deletingId === task.id}
            onToggle={() => toggleTask(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))}
      </div>

      {/* Clear completed */}
      {tasks.length > 0 && doneCount > 0 && (
        <div className="w-full max-w-xl mt-6 flex justify-end">
          <button
            onClick={() => setTasks(prev => prev.filter(t => !t.completed))}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              padding: '4px 0',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,100,100,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            Clear {doneCount} completed
          </button>
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, deleting, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        background: task.completed ? 'rgba(255,255,255,0.03)' : '#ffffff',
        border: task.completed ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        transition: 'opacity 0.25s, transform 0.25s, background 0.3s',
        opacity: deleting ? 0 : 1,
        transform: deleting ? 'translateX(16px)' : 'translateX(0)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        style={{
          width: 20,
          height: 20,
          minWidth: 20,
          borderRadius: 6,
          border: task.completed ? 'none' : '1.5px solid rgba(0,0,0,0.2)',
          background: task.completed ? '#b8ff47' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
          transition: 'background 0.2s, border-color 0.2s, transform 0.1s',
          flexShrink: 0,
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.88)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {task.completed && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="#0b0e1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 450,
            color: task.completed ? 'rgba(255,255,255,0.30)' : '#0b0e1f',
            textDecorationLine: task.completed ? 'line-through' : 'none',
            textDecorationColor: task.completed ? 'rgba(255,255,255,0.25)' : 'transparent',
            lineHeight: 1.45,
            fontFamily: 'Inter, sans-serif',
            wordBreak: 'break-word',
            transition: 'color 0.25s',
          }}
        >
          {task.text}
        </p>
        <span
          style={{
            fontSize: 11,
            color: task.completed ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.32)',
            fontFamily: 'Inter, sans-serif',
            marginTop: 3,
            display: 'block',
            transition: 'color 0.25s',
          }}
        >
          {formatDate(task.createdAt)}
        </span>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        aria-label="Delete task"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          borderRadius: 6,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s, background 0.15s',
          flexShrink: 0,
          marginTop: 1,
          color: task.completed ? 'rgba(255,80,80,0.5)' : 'rgba(0,0,0,0.28)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#ff5050'
          e.currentTarget.style.background = 'rgba(255,80,80,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = task.completed ? 'rgba(255,80,80,0.5)' : 'rgba(0,0,0,0.28)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5 3.5l.5 8M9 3.5l-.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
