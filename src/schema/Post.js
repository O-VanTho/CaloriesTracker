const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {type: String, require: true},
  food: {type: String, require: true},
  timeCost: {type: Number, default: 30},
  content: { type: String, required: true },
  difficulty: {type: String, enum:["Easy", "Medium", "Hard"], required: true},
  rate: {type: Number, default: 0},
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  image: {type: String, require: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;