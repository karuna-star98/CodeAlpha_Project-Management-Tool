import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusColumn from '../components/StatusColumn';
import TaskForm from '../components/TaskForm';
import ProjectForm from '../components/ProjectForm';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';

const columns = [
  { status: 'todo', title: 'To Do', tone: 'todo' },
  { status: 'in-progress', title: 'In Progress', tone: 'progress' },
  { status: 'done', title: 'Done', tone: 'done' }
];

export default function ProjectBoard() {
  const { projectId } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [project, setProject] = useState(null); const [tasks, setTasks] = useState([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); const [editingTask, setEditingTask] = useState(null); const [submitting, setSubmitting] = useState(false); const [memberEmail, setMemberEmail] = useState('');
  const isOwner = project && String(project.ownerId?._id || project.ownerId) === String(user?._id || user?.id);

  const load = async () => { setLoading(true); setError(''); try { const [p, t] = await Promise.all([api(`/projects/${projectId}`), api(`/projects/${projectId}/tasks`)]); setProject(p); setTasks(t); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [projectId]);
  const grouped = useMemo(() => Object.fromEntries(columns.map((c) => [c.status, tasks.filter((t) => t.status === c.status)])), [tasks]);

  const createTask = async (payload) => { setSubmitting(true); try { const task = await api(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(payload) }); setTasks((v) => [task, ...v]); setModal(null); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  const updateTask = async (payload) => { setSubmitting(true); try { const task = await api(`/tasks/${editingTask._id}`, { method: 'PUT', body: JSON.stringify(payload) }); setTasks((v) => v.map((t) => t._id === task._id ? task : t)); setEditingTask(null); setModal(null); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  const changeStatus = async (taskId, status) => { try { const task = await api(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); setTasks((v) => v.map((t) => t._id === taskId ? task : t)); } catch (err) { setError(err.message); } };
  const updateProject = async (payload) => { setSubmitting(true); try { const p = await api(`/projects/${projectId}`, { method: 'PUT', body: JSON.stringify(payload) }); setProject(p); setModal(null); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  const addMember = async (e) => { e.preventDefault(); setSubmitting(true); try { const p = await api(`/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify({ email: memberEmail }) }); setProject(p); setMemberEmail(''); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  const removeMember = async (id) => { try { setProject(await api(`/projects/${projectId}/members/${id}`, { method: 'DELETE' })); setTasks(await api(`/projects/${projectId}/tasks`)); } catch (err) { setError(err.message); } };
  const deleteProject = async () => { if (!confirm('Delete this project and all its tasks?')) return; try { await api(`/projects/${projectId}`, { method: 'DELETE' }); navigate('/projects'); } catch (err) { setError(err.message); } };

  if (loading) return <div className="page-center"><Loader label="Loading project board…" /></div>;
  if (!project) return <div className="page"><ErrorMessage message={error || 'Project not found.'} onRetry={load} /></div>;

  return <div className="page board-page">
    <ErrorMessage message={error} />
    <section className="board-hero">
      <div className="breadcrumb"><Link to="/projects">Projects</Link><span>/</span><span>{project.name}</span></div>
      <div className="board-title-row"><div><div className="eyebrow">PROJECT BOARD</div><h1>{project.name}</h1><p>{project.description || 'Keep the team aligned from planning to done.'}</p></div><div className="board-actions"><button className="button primary" onClick={() => { setEditingTask(null); setModal('task'); }}>+ Add task</button>{isOwner && <button className="button secondary" onClick={() => setModal('project')}>Edit project</button>}</div></div>
      <div className="board-meta"><span>{project.memberIds.length} members</span><span>{tasks.length} tasks</span><span>{tasks.filter((t) => t.status === 'done').length}/{tasks.length || 0} complete</span></div>
    </section>

    <div className="member-strip"><div className="member-list">{project.memberIds.map((m) => <div key={m._id} className="member-pill"><span className="mini-avatar">{m.name.charAt(0).toUpperCase()}</span><span>{m.name}</span>{isOwner && String(m._id) !== String(project.ownerId._id) && <button onClick={() => removeMember(m._id)}>×</button>}</div>)}</div>{isOwner && <form className="add-member" onSubmit={addMember}><input type="email" required value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="Add member by email" /><button className="button secondary" disabled={submitting}>Invite</button></form>}</div>

    <div className="board">{columns.map((column) => <StatusColumn key={column.status} title={column.title} tone={column.tone} tasks={grouped[column.status]} onStatusChange={changeStatus} onCreate={() => { setEditingTask(null); setModal('task'); }} />)}</div>
    {isOwner && <div className="danger-zone"><div><strong>Project administration</strong><p>Only the owner can edit or delete this project.</p></div><button className="button danger" onClick={deleteProject}>Delete project</button></div>}

    {modal === 'task' && <Modal title={editingTask ? 'Edit task' : 'Create task'} width="720px" onClose={() => setModal(null)}><TaskForm project={project} task={editingTask} onSubmit={editingTask ? updateTask : createTask} onCancel={() => setModal(null)} submitting={submitting} /></Modal>}
    {modal === 'project' && <Modal title="Edit project" onClose={() => setModal(null)}><ProjectForm project={project} onSubmit={updateProject} onCancel={() => setModal(null)} submitting={submitting} /></Modal>}
  </div>;
}
