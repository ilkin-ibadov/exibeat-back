import Track from '../models/track.model.js'
import Message from '../models/message.model.js'

export const submitTrack = async (req, res) => {
  const { id } = req.user;
  const { title, djId, message } = req.body;

  const track = await Track.create({
    title,
    producer: id,
    dj: djId,
    hasMessage: !!message
  });

  if (message) {
    const existingMessage = await Message.findOne({
      track: track._id,
      sender: id
    });

    if (existingMessage) {
      return res.status(400).json({ error: 'You can only send one message per track.' });
    }

    await Message.create({
      track: track._id,
      sender: id,
      recipient: djId,
      content: message
    });
  }

  const io = req.app.get('io');
  io.to(djId).emit('new-submission', { track });

  res.status(201).json({ track });
};

export const getDJSubmissions = async (req, res) => {
  const { id } = req.user;
  const tracks = await Track.find({ dj: id }).populate('producer').lean();

  for (const track of tracks) {
    const msg = await Message.findOne({ track: track._id, recipient: id });
    track.hasUnreadMessage = msg && !msg.read;
  }

  res.json(tracks);
};

export const getProducerSubmissions = async (req, res) => {
  const { id } = req.user;
  const tracks = await Track.find({ producer: id })
    .populate('dj')
    .lean();

  for (const track of tracks) {
    const feedback = await Message.findOne({
      track: track._id,
      sender: track.dj._id
    });

    track.feedback = feedback || null;
  }

  res.json(tracks);
};