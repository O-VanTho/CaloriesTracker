const mongoose = require('mongoose');
const Meal = require('./Meal');  

const UserDiarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],  
  totalCalories: { type: Number, required: true },  
  totalProteins: { type: Number, required: true },  
  totalCarbs: { type: Number, required: true },    
  totalFats: { type: Number, required: true },     
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserDiary = mongoose.model('UserDiary', UserDiarySchema);

module.exports = UserDiary;
