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
      const labelNutrients = food.labelNutrients || {};
      console.log(labelNutrients);

      const nutrients = [
        { name: 'Fat', value: labelNutrients.fat ? labelNutrients.fat.value : 0, unit: 'g' },
        { name: 'Saturated Fat', value: labelNutrients.saturatedFat ? labelNutrients.saturatedFat.value : 0, unit: 'g' },
        { name: 'Trans Fat', value: labelNutrients.transFat ? labelNutrients.transFat.value : 0, unit: 'g' },
        { name: 'Cholesterol', value: labelNutrients.cholesterol ? labelNutrients.cholesterol.value : 0, unit: 'mg' },
        { name: 'Sodium', value: labelNutrients.sodium ? labelNutrients.sodium.value : 0, unit: 'mg' },
        { name: 'Carbohydrates', value: labelNutrients.carbohydrates ? labelNutrients.carbohydrates.value : 0, unit: 'g' },
        { name: 'Fiber', value: labelNutrients.fiber ? labelNutrients.fiber.value : 0, unit: 'g' },
        { name: 'Sugars', value: labelNutrients.sugars ? labelNutrients.sugars.value : 0, unit: 'g' },
        { name: 'Protein', value: labelNutrients.protein ? labelNutrients.protein.value : 0, unit: 'g' },
        { name: 'Calcium', value: labelNutrients.calcium ? labelNutrients.calcium.value : 0, unit: 'mg' },
        { name: 'Iron', value: labelNutrients.iron ? labelNutrients.iron.value : 0, unit: 'mg' },
        { name: 'Calories', value: labelNutrients.calories ? labelNutrients.calories.value : 0, unit: 'kcal' }
      ];

      const servingSize = {
        size: food.servingSize || 1,
        unit: food.servingSizeUnit || 'g'
      };

      const data = {
        id: food.fdcId,
        name: food.description,
        brand: food.brandOwner || '',
        servingSize,
        nutrients
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
              onClick={() => onFoodAdded(food.id, 1)}
            >
              <FaPlus className="text-[#77c847]" size={16} />
            </div>
          </li>
        ))}
      </ul>

      {foodData !== null && (
        <ViewFoodDetail foodItem={foodData} onClickAddFood={onFoodAdded} onClearFoodData={clearFoodData} />
      )}

    </div>
  )
}

export default MyFoodFilterDynamic