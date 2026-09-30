import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';
  return <div className="page"><section className="page-hero"><div><div className="eyebrow">ACCOUNT</div><h1>Your profile</h1><p>Your TaskFlow identity is used for project ownership, assignment and comments.</p></div></section>
    <section className="profile-card panel"><div className="profile-avatar">{initial}</div><div className="profile-info"><span className="status-pill soft">{user?.role || 'member'}</span><h2>{user?.name}</h2><p>{user?.email}</p><small>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'recently'}</small></div></section>
    <div className="info-grid"><div className="info-card"><strong>Authentication</strong><span>JWT protected session</span><p>Your account token protects project and task APIs.</p></div><div className="info-card"><strong>Collaboration</strong><span>Project membership</span><p>Only project members can access private boards and comments.</p></div><div className="info-card"><strong>Data</strong><span>MongoDB persistence</span><p>Projects, tasks and comments remain available after refresh.</p></div></div>
  </div>;
}
