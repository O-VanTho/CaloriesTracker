import React from 'react'
import { IoSearch } from "react-icons/io5";
import styles from './recipes.module.css'
import RecipesOption from '@/components/RecipesOption/RecipesOption';

function page() {
  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center p-5 pt-6">
        <h2 className='text-3xl font-semibold'>Cook Book</h2>
        <label className='rounded-full bg-white p-[6px]'>
          <IoSearch className='text-black text-xl'/>
        </label>
      </div>

      <RecipesOption title={"Oat Meal for Breakfast"} image={'/images/oat_meal/m.jpg'} rating={'112'}/>
      <RecipesOption title={"Idea for Healthy Breakfast"} image={'/images/breakfast/main.jpg'} rating={'251'}/>
      <RecipesOption title={"Healthy Homemade Snack"} image={'/images/snack/s-1.jpg'} rating={'119'}/>
    </div>
  )
}

export default page