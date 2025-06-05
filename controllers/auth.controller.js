import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!['producer', 'dj'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const user = await User.create({ username, password, role });
  const token = createToken(user);

  res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role } });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = createToken(user);
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
};