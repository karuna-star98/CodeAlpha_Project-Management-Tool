import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const taskCount = project.taskCount || 0;
  const completed = project.completedTaskCount || 0;
  const progress = taskCount ? Math.round((completed / taskCount) * 100) : 0;
  return (
    <Link className="project-card" to={`/projects/${project._id}`}>
      <div className="project-card-top">
        <div className="project-icon">{project.name.charAt(0).toUpperCase()}</div>
        <span className="status-pill soft">Active</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description || 'No project description yet.'}</p>
      <div className="project-card-meta">
        <span>◉ {project.memberIds?.length || 0} members</span>
        <span>▣ {taskCount} tasks</span>
      </div>
      <div className="progress-line"><span style={{ width: `${progress}%` }} /></div>
    </Link>
  );
}
