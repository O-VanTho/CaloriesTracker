const mongoose = require('mongoose');

const NutrientSchema = new mongoose.Schema({
  name: { type: String, required: true },        
  unit: { type: String, required: true },        
  value: { type: Number, required: true },      
});

const FoodSchema = new mongoose.Schema({
  foodId: {type: String, required: true},
  name: { type: String, required: true },        
  brand: { type: String },                      
  description: { type: String },               
  category: { type: String },                   
  servingSize: {                                
    size: { type: Number, required: true },      
    unit: { type: String, required: true },      
  },
  nutrients: [NutrientSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }, 
});

const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;