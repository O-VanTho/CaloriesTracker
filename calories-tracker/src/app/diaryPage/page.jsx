'use client'

import AddFoodToDiary from '@/components/AddFoodToDiary/AddFoodToDiary';
import Calendar from '@/components/Calendar/Calendar';
import DiaryMeal from '@/components/DiaryMeal/DiaryMeal';
import React, { useState, useEffect } from 'react';

const diaryPage = () => {

  const [diaryDate, setDiaryDate] = useState(null);
  const [openAddFood, setOpenAddFood] = useState(false);
  const [mealType, setMealType] = useState("");

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
    } else{
      console.log(token);
    }
  }, [])

  const handleDateChange = (date) => {
    setDiaryDate(date);
  }

  const handleOpenAddFood = (mealType) => {
    setMealType(mealType);
    setOpenAddFood(true);
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md relative">
      
      {/* Header */}
      <div className="p-4 bg-[#77c847] text-white flex justify-between items-center">
        <button className="text-lg font-semibold">Edit</button>
        <h2 className="text-xl font-bold">Diary</h2>
        <button className="text-lg font-semibold">...</button>
      </div>

      {/* Calendar */}
      <Calendar onDateChange={handleDateChange}/>

      {/* Calories and Remaining Summary */}
      <div className="flex justify-between items-center py-4 px-6 bg-white text-[#77c847]">
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">1,710</p>
          <p className="text-sm">Goal</p>
        </div>
        <p className="text-lg font-bold">-</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">286</p>
          <p className="text-sm">Food</p>
        </div>
        {/* <p className="text-lg font-bold">+</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">0</p>
          <p className="text-sm">Exercise</p>
        </div> */}
        <p className="text-lg font-bold">=</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">1,424</p>
          <p className="text-sm">Remaining</p>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="">
        {/* Breakfast */}
        <DiaryMeal mealType={"Breakfast"} total_calo={0} onOpenAddFood={handleOpenAddFood}/>

        {/* Lunch */}
        <DiaryMeal mealType={"Lunch"} total_calo={0} onOpenAddFood={handleOpenAddFood}/>

        {/* Dinner */}        
        <DiaryMeal mealType={"Dinner"} total_calo={0} onOpenAddFood={handleOpenAddFood}/>

        {/* Snacks */}        
        <DiaryMeal mealType={"Snacks"} total_calo={0} onOpenAddFood={handleOpenAddFood}/>

      </div>

      {openAddFood && (
        <div className='absolute top-0 h-screen w-screen bg-white'>
          <AddFoodToDiary mealType={mealType} onClose={setOpenAddFood}/>
        </div>
      )}
    </div>
  );
};

export default diaryPage;
