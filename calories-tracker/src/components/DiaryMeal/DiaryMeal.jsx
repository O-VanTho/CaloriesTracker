import React, { useState } from 'react'

function DiaryMeal({diaryDate, mealType, totalCalo, onOpenAddFood}) {

  return (
    <div className="border-t border-gray-200 mb-2">
      <div className="flex justify-between bg-[#77c847] text-white p-2">
          <p className="text-lg font-semibold">{mealType}</p>
          <p className="text-lg font-semibold ">{totalCalo}</p>
      </div>

      <p onClick={() => onOpenAddFood(mealType)} className="text-[#77c847] cursor-pointer p-2">+ Add Food</p>
    </div>
    
  )
}

export default DiaryMeal