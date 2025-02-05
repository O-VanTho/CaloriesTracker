"use client";

import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { FaCamera, FaBarcode } from 'react-icons/fa';
import OptionScan from '../OptionScan/OptionScan';
import MyFoodFilterDynamic from '../MyFoodFilterDynamic/MyFoodFilterDynamic';
import axios from 'axios';

function AddFoodToDiary({ diaryDate, mealType, user, fetchDataDiary, onClose }) {

    const [foodItems, setFoodItems] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [successDiag, setSuccessDiag] = useState(false);

    useEffect(() => {
        if(successDiag){
            const timer = setTimeout(() => {
                setSuccessDiag(false);
            }, 3000)

            fetchDataDiary();
            
            return () => clearTimeout(timer);
        }
    }, [successDiag])

    

    const handleFilter = async (filter) => {
        try {
            const res = await axios.get(`http://localhost:5000/get-${filter}`);
            
            if(res.status === 200){
                setActiveFilter(filter);
            }
        } catch (error) {
            console.log(error, "Filter Food data fail");            
        }
    }

    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchInput.trim()) {
            return;
        }

        setActiveFilter(null);
        setLoading(true);

        try {
            const apiKey = '20FnJUBnx3LNNqhalYcz5x7ZZfvFYImjXtcarKwF';
            const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchInput}&api_key=${apiKey}`;
            const res = await axios.get(url);
            const foods = res.data.foods.map(food => {
                const calories = food.foodNutrients?.find(nutrient => nutrient.nutrientName === "Energy")?.value || 0;

                return {
                    id: food.fdcId,
                    name: food.description,
                    servingSize: food.servingSize,
                    servingSizeUnit: food.servingSizeUnit,
                    calories: calories
                };
            });

            setActiveFilter("search");
            setFoodItems(foods);
        } catch (error) {
            console.log("handle search fetch fail", error)
        } finally {
            setLoading(false);
        }
    }

    const handleAddFood = async (foodId, quantity) => {
        try {
            if(!user){
                console.log("user not available");
                return;
            }

            const response = await axios.post(`http://localhost:5000/add-food-by-id/${foodId}`, {userId : user._id});

            if (response.status === 200) {
                try {
                    const addFoodRes = await axios.post(`http://localhost:5000/add-food-to-diary/${diaryDate}/${mealType}`, {userId: user._id, foodId, quantity});

                    if(addFoodRes.status === 200){
                        setSuccessDiag(true);
                    }
                } catch (error) {
                    console.log("Error to handle log food to Diary", error);
                }
                
            } else {
                console.log("Failed to add food: ", response.data.message);
            }
        } catch (error) {
            console.log("Error to handle add food", error);
        }
    }

    return (
        <div className=''>
            {/* Header */}
            <div className='flex justify-between items-center p-3 text-[#77c847] text-lg'>
                <button onClick={() => onClose(false)}>
                    <IoMdArrowBack size={25} />
                </button>
                <p className='font-semibold'>{mealType} </p>
                <div></div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="p-4 pb-0">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700"
                    placeholder=" Search for a food"
                />
            </form>

            {/* Filter */}
            <div className="flex justify-around text-sm font-semibold py-4">
                <button onClick={() => handleFilter('all')} className={`p-1 border-b-2 border-white ${activeFilter === 'all' ? 'text-[#60a637] border-[#77c847]' : ''}`}>
                    All
                </button>
                <button onClick={() => handleFilter('my meals')} className={`p-1 border-b-2 border-white ${activeFilter === 'my meals' ? 'text-[#60a637] border-[#77c847]' : ''}`}>
                    My Meals
                </button>
                <button onClick={() => handleFilter('my recipies')} className={`p-1 border-b-2 border-white ${activeFilter === 'my recipies' ? 'text-[#60a637] border-[#77c847]' : ''}`}>
                    My recipies
                </button>
            </div>

            {/* Scan options */}
            <div className="flex justify-between p-4" style={{ backgroundColor: 'rgba(118, 200, 71, 0.2)' }}>
                <OptionScan
                    IconComponent={FaCamera}
                    title="Scan a Meal"
                />
                <OptionScan
                    IconComponent={FaBarcode}
                    title="Scan a Barcode"
                />
            </div>

            {/* Food Display */}
            <div className="p-4">
                {loading && (
                    <div className='text-gray-500 text-lg'>Loading...</div>
                )}
                {activeFilter === 'all' && (
                    <MyFoodFilterDynamic title="All" foodItems={foodItems} />
                )}
                {activeFilter === 'search' && (
                    <MyFoodFilterDynamic title="Search" foodItems={foodItems} onFoodAdded={handleAddFood} />
                )}
                {activeFilter === 'my meals' && (
                    <MyFoodFilterDynamic title="My Meals" foodItems={foodItems}/>
                )}
                {activeFilter === 'my recipies' && (
                    <MyFoodFilterDynamic title="My recipies" foodItems={foodItems}/>
                )}
            </div>

            
        </div>
    )
}

export default AddFoodToDiary