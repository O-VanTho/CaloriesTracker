"use client";

import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { FaCamera, FaBarcode } from 'react-icons/fa';
import OptionScan from '../OptionScan/OptionScan';
import MyFoodFilterDynamic from '../MyFoodFilterDynamic/MyFoodFilterDynamic';
import axios from 'axios';

function AddFoodToDiary({ diaryDate, mealType, totalCalo, onClose }) {

    const [activeFilter, setActiveFilter] = useState("All");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log("Error token");
                window.location.href = '/login';
                return;
            }

            try {
                const res = await axios.get("http://localhost:5000/current-user", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data.user);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Token expired or invalid, redirecting to login...');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    console.log("Other error:", error);
                }
            }
        }

        fetchUser();
    }, [])

    const handleFilter = (filter) => {
        setActiveFilter(filter);
    }

    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [foodItems, setFoodItems] = useState([]);

    const handleSearchHistory = async (e) => {
        e.preventDefault();

        if (!searchInput.trim()) {
            return;
        }

        setLoading(true);

        try {
            const apiKey = '20FnJUBnx3LNNqhalYcz5x7ZZfvFYImjXtcarKwF';
            const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchInput}&api_key=${apiKey}`;
            const res = await axios.get(url);
            console.log(res.data.foods)
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

            setFoodItems(foods);
        } catch (error) {
            console.log("handle search fetch fail", error)
        } finally {
            setLoading(false);
        }
    }

    const handleAddFood = async (foodId) => {
        try {
            const response = await axios(`http://localhost:5000/add-food-by-id/${foodId}`);

            if (response.status === 200) {
                console.log("success log");
                // const foodObject = response.data.food;
                // const addFoodRes = await axios(`http://localhost:5000/add-food-to-diary/${diaryDate}/${mealType}`, {user, foodObject});

            } else {
                console.log("Failed to add food: ", response.data.message);
            }
        } catch (error) {
            console.log("Error to handle add food")
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
            <form onSubmit={handleSearchHistory} className="p-4 pb-0">
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
                <button onClick={() => handleFilter('All')} className={`p-1 border-b-2 border-white ${activeFilter === 'All' ? 'text-[#60a637] border-[#77c847]' : ''}`}>
                    All
                </button>
                <button onClick={() => handleFilter('My Meals')} className={`p-1 border-b-2 border-white ${activeFilter === 'My Meals' ? 'text-[#60a637] border-[#77c847]' : ''}`}>
                    My Meals
                </button>
                <button onClick={() => handleFilter('My Recipes')} className={`p-1 border-b-2 border-white ${activeFilter === 'My Recipes' ? 'text-[#60a637] border-[#77c847]' : ''}`}>
                    My Recipes
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
                {activeFilter === 'All' && (
                    <MyFoodFilterDynamic title="Search" foodItems={foodItems} onFoodAdded={handleAddFood} />
                )}
                {activeFilter === 'My Meals' && (
                    <MyFoodFilterDynamic title="My Meals" foodItems={foodItems}/>
                )}
                {activeFilter === 'My Recipes' && (
                    <MyFoodFilterDynamic title="My Recipes" foodItems={foodItems}/>
                )}
            </div>

            
        </div>
    )
}

export default AddFoodToDiary