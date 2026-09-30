import { Link } from 'react-router-dom';

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '?';
}

export default function TaskCard({ task, onStatusChange }) {
  const assignee = task.assigneeId?.name;
  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null;
  return (
    <article className="task-card">
      <div className="task-card-head">
        <span className={`priority-dot ${task.priority}`}>{task.priority}</span>
        <Link to={`/tasks/${task._id}`} className="task-open">↗</Link>
      </div>
      <Link to={`/tasks/${task._id}`} className="task-title">{task.title}</Link>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-card-meta">
        {assignee ? <span className="assignee-chip"><span className="mini-avatar">{initials(assignee)}</span>{assignee}</span> : <span className="muted">Unassigned</span>}
        {due && <span className="due">◷ {due}</span>}
      </div>
      <select className="status-select" value={task.status} onChange={(e) => onStatusChange(task._id, e.target.value)}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </article>
  );
}
