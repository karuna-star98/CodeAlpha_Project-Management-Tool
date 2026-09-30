import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ProjectCard from '../components/ProjectCard';

function Stat({ label, value, note }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const load = async () => {
    setError('');
    try { const [dash, list] = await Promise.all([api('/dashboard'), api('/projects')]); setData(dash); setProjects(list); }
    catch (err) { setError(err.message); }
  };
  useEffect(() => { load(); }, []);

  if (!data && !error) return <div className="page-center"><Loader label="Preparing your dashboard…" /></div>;
  return <div className="page">
    <section className="page-hero">
      <div><div className="eyebrow">OVERVIEW</div><h1>Good to see you, {user?.name?.split(' ')[0]}.</h1><p>Here’s a snapshot of your projects and work in progress.</p></div>
      <Link to="/projects" className="button primary">+ New project</Link>
    </section>
    <ErrorMessage message={error} onRetry={load} />
    {data && <>
      <div className="stats-grid">
        <Stat label="Projects" value={data.projectCount} note="spaces you belong to" />
        <Stat label="My tasks" value={data.assignedTasks} note="assigned to you" />
        <Stat label="In progress" value={data.statusCounts['in-progress']} note="currently moving" />
        <Stat label="Done" value={`${data.progress}%`} note={`${data.statusCounts.done} completed tasks`} />
      </div>
      <div className="dashboard-grid">
        <section className="panel large-panel">
          <div className="panel-head"><div><h2>Recent projects</h2><p>Jump straight back into active work.</p></div><Link to="/projects" className="text-link">View all →</Link></div>
          <div className="project-grid compact">{projects.slice(0, 4).map((p) => <ProjectCard key={p._id} project={p} />)}</div>
          {!projects.length && <div className="empty-state"><div className="empty-icon">+</div><h3>No projects yet</h3><p>Create your first project and invite your team.</p><Link to="/projects" className="button primary">Create project</Link></div>}
        </section>
        <section className="panel progress-panel">
          <div className="panel-head"><div><h2>Workload</h2><p>All tasks across your projects.</p></div></div>
          <div className="progress-ring" style={{ '--progress': `${data.progress * 3.6}deg` }}><div><strong>{data.progress}%</strong><span>complete</span></div></div>
          <div className="legend"><div><i className="legend-dot todo" /> To Do <strong>{data.statusCounts.todo}</strong></div><div><i className="legend-dot progress" /> In Progress <strong>{data.statusCounts['in-progress']}</strong></div><div><i className="legend-dot done" /> Done <strong>{data.statusCounts.done}</strong></div></div>
        </section>
      </div>
      <section className="panel"><div className="panel-head"><div><h2>Upcoming due dates</h2><p>Next deadlines still open.</p></div></div>
        {data.upcomingTasks.length ? <div className="due-list">{data.upcomingTasks.map((task) => <Link key={task._id} to={`/tasks/${task._id}`} className="due-row"><div><strong>{task.title}</strong><span>{task.projectId?.name}</span></div><time>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time></Link>)}</div> : <div className="empty-inline">No upcoming due dates. Nice and clear.</div>}
      </section>
    </>}
  </div>;
}
