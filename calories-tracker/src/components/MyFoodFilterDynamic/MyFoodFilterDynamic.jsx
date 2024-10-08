"use client"

import axios from 'axios';
import { FaPlus } from "react-icons/fa6";
import React, { useState } from 'react'

function MyFoodFilterDynamic({ title, foodItems, onFoodAdded }) {

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg text-[#77c847]">{title}</h2>
        <div> </div>
      </div>

      {/* Food List */}
      <ul className="mt-2">
        {foodItems.map((food) => (
          <li key={food.id}
            className={`flex justify-between items-center p-2 mb-2 border rounded bg-gray-100`}>
            <div>
              <h3 className='text-black text-sm'>{food.name}</h3>
              <p className='text-gray-500 text-xs'>{food.calories} calo, {food.servingSize} {food.servingSizeUnit}</p>
            </div>

            <div className='bg-white rounded-full p-2'
              onClick={onFoodAdded(food.id)}
            >
              <FaPlus className="text-[#77c847]" size={16} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MyFoodFilterDynamic