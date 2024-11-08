'use client'
import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import styles from './recipes.module.css'
import RecipesOption from '@/components/RecipesOption/RecipesOption';

function page() {


  return (
    <div className={styles.container}>
      <div className="p-5 pt-6">
        <h2 className='text-3xl font-semibold'>Cook Book</h2>
      </div>

      <ul className={styles.photos}>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=${encodeURIComponent('Oat Meal')}&urlImage=${encodeURIComponent('/images/oat_meal/header.png')}`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Oat Meal for Breakfast"} image={'/images/oat_meal/m.jpg'} rating={'112'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=${encodeURIComponent('Breakfast')}&urlImage=${encodeURIComponent('/images/breakfast/ba.png')}`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Idea for Healthy Breakfast"} image={'/images/breakfast/main.jpg'} rating={'251'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=${encodeURIComponent('VietNamese Food')}&urlImage=${encodeURIComponent('/images/vietnam_food/d.png')}`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Traditional Vietnam Food"} image={'/images/vietnam_food/main.jpg'} rating={'251'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=${encodeURIComponent('Dinner')}&urlImage=${encodeURIComponent('/images/dinner/th.jfif')}`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Idea for Dinner"} image={'/images/dinner/main.jpg'} rating={'251'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=${encodeURIComponent('Snack')}&urlImage=${encodeURIComponent('/images/snack/main.png')}`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Healthy Homemade Snack"} image={'/images/snack/s-1.jpg'} rating={'119'} />
          </a>
        </li>
      </ul>
    </div>
  )
}

export default page