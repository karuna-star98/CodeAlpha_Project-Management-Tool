import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function TaskDetails() {
  const { taskId } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [task, setTask] = useState(null); const [project, setProject] = useState(null); const [comments, setComments] = useState([]); const [comment, setComment] = useState(''); const [error, setError] = useState(''); const [editing, setEditing] = useState(false); const [submitting, setSubmitting] = useState(false);

  const load = async () => { setError(''); try { const t = await api(`/tasks/${taskId}`); const [p, c] = await Promise.all([api(`/projects/${t.projectId}`), api(`/tasks/${taskId}/comments`)]); setTask(t); setProject(p); setComments(c); } catch (err) { setError(err.message); } };
  useEffect(() => { load(); }, [taskId]);
  const save = async (payload) => { setSubmitting(true); try { setTask(await api(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(payload) })); setEditing(false); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  const addComment = async (e) => { e.preventDefault(); if (!comment.trim()) return; setSubmitting(true); try { const created = await api(`/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify({ text: comment }) }); setComments((v) => [...v, created]); setComment(''); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };
  const deleteComment = async (id) => { try { await api(`/comments/${id}`, { method: 'DELETE' }); setComments((v) => v.filter((item) => item._id !== id)); } catch (err) { setError(err.message); } };
  const deleteTask = async () => { if (!confirm('Delete this task?')) return; try { await api(`/tasks/${taskId}`, { method: 'DELETE' }); navigate(`/projects/${task.projectId}`); } catch (err) { setError(err.message); } };
  const changeStatus = async (status) => { try { setTask(await api(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })); } catch (err) { setError(err.message); } };

  if (!task && !error) return <div className="page-center"><Loader label="Loading task…" /></div>;
  if (!task) return <div className="page"><ErrorMessage message={error} onRetry={load} /></div>;

  const canDelete = String(task.createdBy?._id) === String(user?.id || user?._id) || String(project?.ownerId?._id) === String(user?.id || user?._id);
  return <div className="page task-page"><ErrorMessage message={error} />
    <div className="breadcrumb"><Link to={`/projects/${task.projectId}`}>{project?.name || 'Project'}</Link><span>/</span><span>Task details</span></div>
    <section className="task-detail-layout">
      <main className="task-detail-main panel">
        <div className="detail-top"><div><span className={`priority-badge ${task.priority}`}>{task.priority} priority</span><span className="created-meta">Created {new Date(task.createdAt).toLocaleDateString()}</span></div><div className="detail-actions"><button className="button secondary" onClick={() => setEditing(true)}>Edit</button>{canDelete && <button className="button danger" onClick={deleteTask}>Delete</button>}</div></div>
        <h1>{task.title}</h1><p className="detail-description">{task.description || 'No description provided for this task.'}</p>
        <div className="task-property-grid">
          <div><span>STATUS</span><select value={task.status} onChange={(e) => changeStatus(e.target.value)}><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option></select></div>
          <div><span>ASSIGNEE</span><strong>{task.assigneeId?.name || 'Unassigned'}</strong></div>
          <div><span>DUE DATE</span><strong>{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'}</strong></div>
          <div><span>CREATED BY</span><strong>{task.createdBy?.name || 'Unknown'}</strong></div>
        </div>
      </main>
      <aside className="panel comments-panel"><div className="panel-head"><div><h2>Comments</h2><p>Communication stays attached to the work.</p></div><span className="count-badge">{comments.length}</span></div>
        <div className="comments-list">{comments.length ? comments.map((item) => <div className="comment" key={item._id}><div className="comment-avatar">{item.userId?.name?.charAt(0)?.toUpperCase() || '?'}</div><div className="comment-body"><div><strong>{item.userId?.name}</strong><time>{new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time></div><p>{item.text}</p>{(String(item.userId?._id) === String(user?.id || user?._id) || String(project?.ownerId?._id) === String(user?.id || user?._id)) && <button className="comment-delete" onClick={() => deleteComment(item._id)}>Delete</button>}</div></div>) : <div className="empty-inline">No comments yet. Start the conversation.</div>}</div>
        <form className="comment-form" onSubmit={addComment}><textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment…" /><button className="button primary" disabled={submitting || !comment.trim()}>Post comment</button></form>
      </aside>
    </section>
    {editing && <Modal title="Edit task" width="720px" onClose={() => setEditing(false)}><TaskForm project={project} task={task} onSubmit={save} onCancel={() => setEditing(false)} submitting={submitting} /></Modal>}
  </div>;
}
