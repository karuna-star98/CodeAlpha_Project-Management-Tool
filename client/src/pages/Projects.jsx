import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function Projects() {
  const [projects, setProjects] = useState([]); const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false); const [submitting, setSubmitting] = useState(false);
  const load = async () => { setError(''); try { setProjects(await api('/projects')); } catch (err) { setError(err.message); } };
  useEffect(() => { load(); }, []);
  const create = async (payload) => { setSubmitting(true); try { const project = await api('/projects', { method: 'POST', body: JSON.stringify(payload) }); setProjects((p) => [project, ...p]); setShowCreate(false); } catch (err) { setError(err.message); } finally { setSubmitting(false); } };

  return <div className="page"><section className="page-hero"><div><div className="eyebrow">WORKSPACES</div><h1>Your projects</h1><p>Organize team work into focused spaces with shared task boards.</p></div><button className="button primary" onClick={() => setShowCreate(true)}>+ New project</button></section>
    <ErrorMessage message={error} onRetry={load} />
    {!projects.length && !error ? <div className="page-center"><Loader /></div> : <div className="project-grid">{projects.map((project) => <ProjectCard key={project._id} project={project} />)}</div>}
    {showCreate && <Modal title="Create project" onClose={() => setShowCreate(false)}><ProjectForm onSubmit={create} onCancel={() => setShowCreate(false)} submitting={submitting} /></Modal>}
  </div>;
}
