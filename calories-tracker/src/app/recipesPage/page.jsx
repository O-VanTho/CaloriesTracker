import React from 'react'
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
          <a href={`/recipesPage/recipesMeal?mealType=breakfast&urlImage=/images/oat_meal/m.jpg`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Oat Meal for Breakfast"} image={'/images/oat_meal/m.jpg'} rating={'112'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=breakfast&urlImage=/images/breakfast/ba.png`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Idea for Healthy Breakfast"} image={'/images/breakfast/main.jpg'} rating={'251'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=vn_food&urlImage=/images/oat_meal/m.jpg`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Traditional VietNam Food"} image={'/images/vietnam_food/main.jpg'} rating={'251'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=breakfast&urlImage=/images/dinner/bs.png`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Idea for Healthy Dinner"} image={'/images/dinner/main.jpg'} rating={'251'} />
          </a>
        </li>
        <li className={styles.photo}>
          <a href={`/recipesPage/recipesMeal?mealType=breakfast&urlImage=/images/oat_meal/m.jpg`} className='relative rounded-2xl w-full h-[400px] overflow-hidden mx-4 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out'>
            <RecipesOption title={"Healthy Homemade Snack"} image={'/images/snack/s-1.jpg'} rating={'119'} />
          </a>
        </li>
      </ul>
    </div>
  )
}

export default page