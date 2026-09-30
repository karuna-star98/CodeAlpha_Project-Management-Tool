import { useEffect, useState } from 'react';

const initial = { title: '', description: '', priority: 'medium', dueDate: '', assigneeId: '', status: 'todo' };

export default function TaskForm({ project, task, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial);
  useEffect(() => {
    if (task) setForm({ title: task.title || '', description: task.description || '', priority: task.priority || 'medium', dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '', assigneeId: task.assigneeId?._id || task.assigneeId || '', status: task.status || 'todo' });
    else setForm(initial);
  }, [task]);

  const set = (field) => (e) => setForm((v) => ({ ...v, [field]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...form, dueDate: form.dueDate || null, assigneeId: form.assigneeId || null }); };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="full">Task title<input required minLength="2" value={form.title} onChange={set('title')} placeholder="e.g. Build dashboard UI" /></label>
      <label className="full">Description<textarea rows="4" value={form.description} onChange={set('description')} placeholder="What needs to be done?" /></label>
      <label>Priority<select value={form.priority} onChange={set('priority')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
      <label>Due date<input type="date" value={form.dueDate} onChange={set('dueDate')} /></label>
      <label>Status<select value={form.status} onChange={set('status')}><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option></select></label>
      <label>Assignee<select value={form.assigneeId} onChange={set('assigneeId')}><option value="">Unassigned</option>{project.memberIds?.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}</select></label>
      <div className="form-actions full"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" disabled={submitting}>{submitting ? 'Saving…' : task ? 'Save changes' : 'Create task'}</button></div>
    </form>
  );
}
