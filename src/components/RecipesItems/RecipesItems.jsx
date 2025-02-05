import Image from 'next/image';
import React from 'react'
import { IoIosTimer } from "react-icons/io";
import { PiBowlFood } from "react-icons/pi";
import { IoLayers } from "react-icons/io5";

function RecipiesItems({title, author, categoryFood, timeCost, difficulty, rate, image}) {
  return (
    <div className='flex mx-3 rounded-xl overflow-hidden relative border-[5px] mb-3'>
        <div className='relative flex-1 h-[230px] min-w-[163px] max-w-[163px]'>
            <Image src={image} alt='' fill />
        </div>

        <div className='flex flex-col text-black py-4 gap-3 p-2'>
            <h1 className='text-xl font-semibold overflow-hidden text-ellipsis max-h-[60px] max-w-[162px]'>{title}</h1>
            <label className='font-mono text-gray-500'>{author}</label>

            <ul className='flex flex-col gap-2'>
                <li className='flex gap-1 items-center'>
                    <PiBowlFood />{categoryFood}
                </li>
                <li className='flex gap-1 items-center'>
                    <IoIosTimer />{timeCost} min
                </li>
                <li className='flex gap-1 items-center'>
                    <IoLayers />{difficulty}
                </li>
            </ul>
        </div>

        <div className='absolute bottom-[8px] right-[12px] flex items-center space-x-1'>
          <span className='text-white'>⭐</span>
          <span className='text-black font-medium'>{rate}</span>
        </div>
    </div>
  )
}

export default RecipiesItems