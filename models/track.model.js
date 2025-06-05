import mongoose from 'mongoose'

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dj: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissionDate: { type: Date, default: Date.now },
  hasMessage: { type: Boolean, default: false },
  feedbackSent: { type: Boolean, default: false }
});

const Track = mongoose.model('Track', trackSchema);
export default Track;