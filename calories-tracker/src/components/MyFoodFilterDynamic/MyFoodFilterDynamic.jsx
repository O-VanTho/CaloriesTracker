"use client"

import axios from 'axios';
import { FaPlus } from "react-icons/fa6";
import React, { useState } from 'react'
import ViewFoodDetail from '../ViewFoodDetail/ViewFoodDetail';

function MyFoodFilterDynamic({ title, foodItems, onFoodAdded }) {
  const [foodData, setFoodData] = useState(null);

  const handleViewFood = async (foodId) => {
    try {
      const res = await axios.get(`http://localhost:5000/view-food`, {
        params: { foodId }
      })

      const food = res.data;
      const data = {
        id: food.fdcId,
        name: food.description,
        brand: food.brandOwner || 'Unknown Brand',
        servingSize: food.servingSize?.size || 0,
        unit: food.servingSize?.unit || '',
        calories: food.foodNutrients?.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 0,
        carbs: food.foodNutrients?.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference')?.value || 0,
        fat: food.foodNutrients?.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)')?.value || 0,
        protein: food.foodNutrients?.find(nutrient => nutrient.nutrientName === 'Protein')?.value || 0,
      };

      setFoodData(data);
    } catch (error) {
      console.log("Error handle view food");
    }
  }

  const clearFoodData = async () => {
    setFoodData(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg text-[#77c847]">{title}</h2>
        <div></div>
      </div>

      {/* Food List */}
      <ul className="mt-2">
        {foodItems.map((food) => (
          <li key={food.id}
            className={`flex justify-between items-center p-2 mb-2 border rounded bg-gray-100`}>
            <div onClick={() => handleViewFood(food.id)}>
              <h3 className='text-black text-sm'>{food.name}</h3>
              <p className='text-gray-500 text-xs'>{food.calories} calo, {food.servingSize} {food.servingSizeUnit}</p>
            </div>

            <div className='bg-white rounded-full p-2'
              onClick={() => onFoodAdded(food.id)}
            >
              <FaPlus className="text-[#77c847]" size={16} />
            </div>
          </li>
        ))}
      </ul>

      {foodData !== null && (
        <ViewFoodDetail foodItem={foodData} onClearFoodData={clearFoodData}/>
      )}

    </div>
  )
}

export default MyFoodFilterDynamic