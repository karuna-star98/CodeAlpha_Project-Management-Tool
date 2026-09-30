import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function register(req, res) {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user._id);
  res.status(201).json({ user: safeUser(user), token });
}

export async function login(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = signToken(user._id);
  res.json({ user: safeUser(user), token });
}

export function me(req, res) {
  res.json({ user: safeUser(req.user) });
}
