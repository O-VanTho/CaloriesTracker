import Image from 'next/image';
import React from 'react'
import { IoIosTimer } from "react-icons/io";
import { PiBowlFood } from "react-icons/pi";
import { IoLayers } from "react-icons/io5";

function RecipesItems({title, author, categoryFood, timeCost, difficulty, rate, image}) {
  return (
    <div className='w-full flex mx-3 rounded-xl overflow-hidden relative border-[5px] mb-3'>
        <div className='relative flex-1'>
            <Image src={'/images/breakfast/bf-2.jpeg'} alt='' fill />
        </div>

        <div className='flex flex-1 flex-col text-black py-4 gap-3 p-2'>
            <h1 className='text-2xl font-semibold'>Oat OverNight With Fruit</h1>
            <label className='font-mono text-gray-500'>By Mathen</label>

            <ul className='flex flex-col gap-2'>
                <li className='flex gap-1 items-center'>
                    <PiBowlFood />Pancake
                </li>
                <li className='flex gap-1 items-center'>
                    <IoIosTimer />30min
                </li>
                <li className='flex gap-1 items-center'>
                    <IoLayers />Easy
                </li>
            </ul>
        </div>

        <div className='absolute bottom-[8px] right-[12px] flex items-center space-x-1'>
          <span className='text-white'>⭐</span>
          <span className='text-black font-medium'>4.5</span>
        </div>
    </div>
  )
}

export default RecipesItems