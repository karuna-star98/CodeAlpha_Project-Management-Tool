import TaskCard from './TaskCard';

export default function StatusColumn({ title, tone, tasks, onStatusChange, onCreate }) {
  return (
    <section className="board-column">
      <div className="column-head"><div><span className={`column-dot ${tone}`} /> <strong>{title}</strong> <span className="count-badge">{tasks.length}</span></div><button className="ghost-icon" onClick={onCreate}>+</button></div>
      <div className="column-body">
        {tasks.length ? tasks.map((task) => <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />) : <div className="empty-column">No tasks here yet.</div>}
      </div>
    </section>
  );
}
