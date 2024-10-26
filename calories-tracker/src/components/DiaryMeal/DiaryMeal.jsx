import axios from 'axios'
import React, { useEffect, useState } from 'react'

function DiaryMeal({ diaryDate, mealType, dataDiary, totalCalo, onOpenAddFood }) {
  const [mealData, setMealData] = useState(null);

  useEffect(() => {
    const getMealData = async() => {

      if(!dataDiary){
        return;
      }

      try {
        const res = axios.post(`http://localhost:5000/get-meal-from-diary`, {diaryId: dataDiary._id, mealType});

        setMealData(res.data.meal);
      } catch (error) {
        console.log("Fetch failed meal");
      }
    }

    getMealData();
  },[dataDiary]);

  return (
    <div className="border-t border-gray-200 mb-2">
      <div className="flex justify-between bg-[#77c847] text-white p-2">
        <p className="text-lg font-semibold">{mealType}</p>
        <p className="text-lg font-semibold ">{totalCalo}</p>
      </div>
      <ul>
        {mealData && mealData.foods.map((food) => {
          <li key={food._id} className={`flex justify-between items-center p-2 mb-2 border rounded bg-gray-100`}>
            <div>
              <h3 className='text-black text-sm'>{food.name}</h3>
              <p className='text-gray-500 text-xs'>{food.calories} calo, {food.servingSize} {food.servingSizeUnit}</p>
            </div>

            <div className='bg-white rounded-full p-2'
              onClick={() => onFoodAdded(food.id, 1)}
            >
              <FaPlus className="text-[#77c847]" size={16} />
            </div>
          </li>
        })}
      </ul>
      <p onClick={() => onOpenAddFood(mealType)} className="text-[#77c847] cursor-pointer p-2">+ Add Food</p>
    </div>

  )
}

export default DiaryMeal