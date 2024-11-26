import React, { useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

function ViewFoodDetail({ foodItem, onClickAddFood, onClearFoodData }) {

    const [numServing, setNumServing] = useState(1);

    const handleChangeNumServing = (e) => {
        setNumServing(e.target.value);
    }

    return (
        <div className='fixed overflow-scroll w-full h-full top-0 left-0 bg-white z-30'>
            <div className='h-fit'>
                <div className='flex justify-between items-center bg-green-500 p-3'>
                    <button onClick={onClearFoodData}>
                        <IoMdArrowBack size={20} />
                    </button>
                    <p className='font-semibold'>Add Food</p>
                    <button onClick={() => onClickAddFood(foodItem.id, numServing)}>
                        <FaCheck size={20} />
                    </button>
                </div>
                <div className='p-3'>
                    <h2 className='text-black'>{foodItem.name}</h2>
                    <p className='text-gray-500'>{foodItem.brand}</p>
                </div>

                <div className="flex items-center justify-between mb-6 mx-5">
                    <div className="w-[72px] h-[72px] border-4 text-gray-700 border-red-500 rounded-full flex flex-col justify-center items-center">
                        <span className="text-xl font-bold">
                            {foodItem.nutrients
                                .filter(nutrient => nutrient.name === 'Calories')
                                .map(nutrient => nutrient.value)[0] || 0}
                        </span>
                        <span className="text-sm">cal</span>
                    </div>
                    <div className="flex gap-14">
                        <div className="text-blue-500 text-center">
                            <span className="block text-lg">
                                {foodItem.nutrients
                                    .filter(nutrient => nutrient.name === 'Carbohydrates')
                                    .map(nutrient => nutrient.value)[0] || 0} g
                            </span>
                            <span className="block text-sm">Carbs</span>
                        </div>
                        <div className="text-red-500 text-center">
                            <span className="block text-lg">
                                {foodItem.nutrients
                                    .filter(nutrient => nutrient.name === 'Fat')
                                    .map(nutrient => nutrient.value)[0] || 0} g
                            </span>
                            <span className="block text-sm">Fat</span>
                        </div>
                        <div className="text-green-500 text-center">
                            <span className="block text-lg">
                                {foodItem.nutrients
                                    .filter(nutrient => nutrient.name === 'Protein')
                                    .map(nutrient => nutrient.value)[0] || 0} g
                            </span>
                            <span className="block text-sm">Protein</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Serving Size */}
                <div className="mb-5 mx-5">
                    <div className="flex justify-between mb-3">
                        <div>
                            <span className="text-gray-600">Serving Size</span>
                            <span className="block text-xl font-semibold text-gray-500">{foodItem.servingSize.size} {foodItem.servingSize.unit}</span>
                        </div>
                        <div>
                            <label className="block text-gray-600">Number of Servings</label>
                            <input value={numServing} onChange={handleChangeNumServing} min={0} type="number" className="border p-2 rounded w-16 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Nutrition Facts */}
                <div className="border-t pt-5 mx-5 text-black">
                    <h3 className="text-lg font-semibold">Nutrition Facts</h3>

                    {foodItem.nutrients
                        .filter(nutrient => nutrient.name !== 'Protein' && nutrient.name !== 'Fat' && nutrient.name !== 'Calories' && nutrient.name !== "Carbohydrates")
                        .map(nutrient => (
                            <div className="flex justify-between py-2">
                                <span>{nutrient.name}</span>
                                <span>{nutrient.value} {nutrient.unit}</span>
                            </div>
                        ))}


                    <div className="flex justify-between py-2">
                        <span>Calories</span>
                        <span>130</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>Total Fat</span>
                        <span>2.5 g</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>Saturated Fat</span>
                        <span>0.5 g</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>Cholesterol</span>
                        <span>0 mg</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewFoodDetail