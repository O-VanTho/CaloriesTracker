import axios from 'axios'
import React, { useEffect, useState } from 'react'

function DiaryMeal({ diaryDate, mealType, dataDiary, onOpenAddFood }) {
  const [mealData, setMealData] = useState(null);

  useEffect(() => {

    const getMealData = async () => {
      try {
        const res = await axios.post(`http://localhost:5000/get-meal-from-diary`, { diaryId: dataDiary._id, mealType });
        setMealData(res.data.meal);
      } catch (error) {
        console.log("Fetch failed meal", error);
      }
    }

    setMealData(null);

    if (dataDiary) {
      getMealData();
    }
  }, [dataDiary, diaryDate]);

  const editFood = async(foodId) => {

  }

  return (
    <div className="border-t border-gray-200 mb-2">
      <div className="flex justify-between bg-[#77c847] text-white p-2">
        <p className="text-lg font-semibold">{mealType}</p>
        <p className="text-lg font-semibold ">{mealData ? mealData.totalCalories : 0} calo</p>
      </div>
      <ul>
        {mealData &&
          mealData.foods.map((foodItem) => (
            <li
              onClick={() => editFood(foodItem.food._id)}
              key={foodItem._id}
              className="flex justify-between items-center p-2 border-b-2 rounded bg-white"
            >
              <div>
                <h3 className="text-black text-sm">{foodItem.food.name}</h3>
                <p className="text-gray-500 text-xs">
                  {foodItem.quantity} Serving(s),{" "}
                  {foodItem.food.servingSize.size} {foodItem.food.servingSize.unit}
                </p>
              </div>

              <div className='text-green-500'>
                {foodItem.food.nutrients[11].value} calo
              </div>
            </li>
          ))}
      </ul>
      <p onClick={() => onOpenAddFood(mealType)} className="text-[#77c847] cursor-pointer p-2">+ Add Food</p>
    </div>

  )
}

export default DiaryMeal