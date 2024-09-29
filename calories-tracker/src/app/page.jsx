import React from 'react'
import styles from "./home.module.css"
import Banner from '@/components/Banner/Banner'
import StackedBarChart from '@/components/StackedBarChart/StackedBarChart'

function page() {
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
          title='Recipes'
          href='/recipesPage'
          backgroundImage='/images/recipes-banner.jpeg'
          customCss='recipes_overlay'
        />
      </div>

      <StackedBarChart/>

      <div className={styles.banner}>
        <div className='flex flex-col justify-start text-white'>
          <h2 className='text-[18px] font-semibold'>Try our cool feature</h2>
          <p className='text-[12px]'>Scan your food and we will retrieve the macro</p>
          <button className='mt-5 text-[13px] text-center rounded bg-white text-black font-bold w-fit p-4 pt-2 pb-2'>Try now</button>
        </div>

        
      </div>
    </div>
  )
}

export default page