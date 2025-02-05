"use client";

import AddFoodToDiary from '@/components/AddFoodToDiary/AddFoodToDiary';
import Calendar from '@/components/Calendar/Calendar';
import DiaryMeal from '@/components/DiaryMeal/DiaryMeal';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const diaryPage = () => {

  const [diaryDate, setDiaryDate] = useState(null);
  const [openAddFood, setOpenAddFood] = useState(false);
  const [mealType, setMealType] = useState("");
  const [user, setUser] = useState(null);

  const [dataDiary, setDataDiary] = useState([]);


  // User Auth
  useEffect(() => {
    // Check if the token is present in localStorage
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

  const fetchDataDiary = async () => {
    try {
      const res = await axios.post("http://localhost:5000/get-userdiary", { userId: user._id, date: diaryDate })
      setDataDiary(res.data.diary);
    } catch (error) {
      console.log("Error fetching diary Data", error);
    }
  }

  useEffect(() => {
    if(user){
      fetchDataDiary();
    }
  }, [user, diaryDate])

  const handleDateChange = (date) => {
    setDiaryDate(date);
    setDataDiary(null);
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
      <Calendar onDateChange={handleDateChange} />

      {/* Calories and Remaining Summary */}
      <div className="flex justify-between items-center py-4 px-6 bg-white text-[#77c847]">
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">{user ? user.BMR : 0}</p>
          <p className="text-sm">Goal</p>
        </div>
        <p className="text-lg font-bold">-</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">{dataDiary ? dataDiary.totalCalories : 0}</p>
          <p className="text-sm">Food</p>
        </div>
        
        <p className="text-lg font-bold">=</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">
            {(dataDiary && user && user.BMR) ? user.BMR - (dataDiary.totalCalories || 0) : 0}
          </p>
          <p className="text-sm">Remaining</p>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="">
        {/* Breakfast */}
        <DiaryMeal mealType={"Breakfast"} dataDiary={dataDiary} diaryDate={diaryDate} total_calo={0} onOpenAddFood={handleOpenAddFood} />

        {/* Lunch */}
        <DiaryMeal mealType={"Lunch"} dataDiary={dataDiary} diaryDate={diaryDate} total_calo={0} onOpenAddFood={handleOpenAddFood} />

        {/* Dinner */}
        <DiaryMeal mealType={"Dinner"} dataDiary={dataDiary} diaryDate={diaryDate} total_calo={0} onOpenAddFood={handleOpenAddFood} />

        {/* Snacks */}
        <DiaryMeal mealType={"Snacks"} dataDiary={dataDiary} diaryDate={diaryDate} total_calo={0} onOpenAddFood={handleOpenAddFood} />

      </div>

      {openAddFood && (
        <div className='absolute top-0 h-screen w-screen bg-white'>
          <AddFoodToDiary mealType={mealType} diaryDate={diaryDate} user={user} fetchDataDiary={fetchDataDiary} onClose={setOpenAddFood} />
        </div>
      )}
    </div>
  );
};

export default diaryPage;
