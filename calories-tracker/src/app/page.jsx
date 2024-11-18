'use client';

import React, { useState, useEffect } from 'react'
import styles from "./home.module.css"
import Banner from '@/components/Banner/Banner'
import { FaCamera } from "react-icons/fa";
import StackedBarChart from '@/components/StackedBarChart/StackedBarChart'
import PieChart from '@/components/PieChart/PieChart';
import axios from 'axios';

function homePage() {
  const [user, setUser] = useState(null);
  const [currentDiary, setCurrentDiary] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [barCarbData, setBarCarbData] = useState(null);
  const [barFatData, setBarFatData] = useState(null);
  const [barProteinData, setBarProteinData] = useState(null);


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

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const diaryDate = new Date();
        const res = await axios.post("http://localhost:5000/get-userdiary", { userId: user._id, date: diaryDate })

        const data = res.data.diary;
        setCurrentDiary(data);
        setPieData([data.totalCarbs, data.totalFats, data.totalProteins]);
      } catch (error) {
        console.log("Error failed fetch current Diary");
      }
    }

    const fetchDiaryWeek = async () => {
      try {
        const res = await axios.post("http://localhost:5000/get-diary-week", { userId: user._id });
        const data = res.data.diaryWeekly;

        const weeklyCarb = Array(7).fill(0);
        const weeklyFat = Array(7).fill(0);
        const weeklyProtein = Array(7).fill(0);

        data.forEach((diary, idx) => {
          if (diary) {
            let carbs = 0;
            let fat = 0;
            let protein = 0;

            if (Array.isArray(diary.meals)) {
              diary.meals.forEach(meal => {
                if (Array.isArray(meal.foods)) {
                  meal.foods.forEach(foodItem => {
                    carbs += foodItem.food.nutrients.find(nutrient => nutrient.name === 'Carbohydrate')?.value || 0;
                    fat += foodItem.food.nutrients.find(nutrient => nutrient.name === 'Fat')?.value || 0;
                    protein += foodItem.food.nutrients.find(nutrient => nutrient.name === 'Protein')?.value || 0;
                  });
                }
              });
            }

            weeklyCarb[idx] = carbs;
            weeklyFat[idx] = fat;
            weeklyProtein[idx] = protein;
          }
        });

        setBarCarbData(weeklyCarb);
        setBarFatData(weeklyFat);
        setBarProteinData(weeklyProtein);

      } catch (error) {
        console.log("Error failed fetch diary week", error);
      }
    }
    if (user) {
      fetchDiary();
      fetchDiaryWeek();
    }

  }, [user])



  return (
    <div className='container'>
      <div className='flex justify-between items-center h-[140px] m-[6px] gap-2'>
        <Banner
          title='My Diary'
          href='/diaryPage'
          backgroundImage='/images/diary-banner.jpg'
          customCss='diary_overlay'
        />
        <Banner
          title='recipies'
          href='/recipesPage'
          backgroundImage='/images/recipes-banner.jpeg'
          customCss='recipies_overlay'
        />
      </div>

      <StackedBarChart dataCarb={barCarbData} dataFat={barFatData} dataProtein={barProteinData} />

      <div className={styles.banner}>
        <div className='flex flex-col justify-start text-white'>
          <h2 className='text-[18px] font-semibold'>Try our cool feature</h2>
          <p className='text-[12px]'>Scan your foodItem and we will retrieve the macro</p>
          <button className='mt-5 text-[13px] text-center rounded bg-white text-black font-bold w-fit p-4 pt-2 pb-2'>Try now</button>
        </div>

        <div className={styles.image}>
          <FaCamera size={55} color='rgba(118, 200, 71, 1)' />
        </div>
      </div>

      <PieChart calo={currentDiary ? currentDiary.totalCalories : 0} dataSet={pieData ? pieData : [40, 35, 30]} />
    </div>
  )
}

export default homePage