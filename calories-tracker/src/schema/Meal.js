const mongoose = require('mongoose');
const Food = require('./Food'); 

const MealSchema = new mongoose.Schema({
  mealType: { type: String, required: true },
  foods: [{ 
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, required: true }, 
  }],
  totalCalories: { type: Number, required: true },  
  totalProteins: { type: Number, required: true },  
  totalCarbs: { type: Number, required: true },    
  totalFats: { type: Number, required: true },   
});

const Meal = mongoose.model('Meal', MealSchema);

module.exports = Meal;
