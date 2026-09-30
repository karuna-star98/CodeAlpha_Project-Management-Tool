import { useEffect, useState } from 'react';

export default function ProjectForm({ project, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  useEffect(() => { setName(project?.name || ''); setDescription(project?.description || ''); }, [project]);

  return (
    <form className="form-stack" onSubmit={(e) => { e.preventDefault(); onSubmit({ name, description }); }}>
      <label>Project name<input required minLength="2" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Campus Collaboration App" /></label>
      <label>Description<textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the project, goal or deliverable." /></label>
      <div className="form-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" disabled={submitting}>{submitting ? 'Saving…' : project ? 'Save project' : 'Create project'}</button></div>
    </form>
  );
}
