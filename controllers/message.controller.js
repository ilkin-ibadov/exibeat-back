import Message from '../models/message.model.js'
import Track from '../models/track.model.js'

export const sendFeedback = async (req, res) => {
  const { id } = req.user;
  const { trackId, recipientId, content } = req.body;

  const message = await Message.create({
    track: trackId,
    sender: id,
    recipient: recipientId,
    content
  });

  await Track.findByIdAndUpdate(trackId, { feedbackSent: true });

  const io = req.app.get('io');
  io.to(recipientId).emit('new-feedback', { trackId, message });

  res.status(201).json(message);
};

export const getMessagesForTrack = async (req, res) => {
  try {
    const { trackId } = req.params;

    const messages = await Message.find({ track: trackId })
      .sort({ createdAt: 1 }) // Sort by creation date
      .populate('track')
      .populate('sender', 'username role')
      .populate('recipient', 'username role');
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { trackId } = req.params;
    const { id } = req.user;

    const result = await Message.updateMany(
      { track: trackId, recipient: id, read: false },
      { $set: { read: true } }
    );

    res.json({ updatedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};