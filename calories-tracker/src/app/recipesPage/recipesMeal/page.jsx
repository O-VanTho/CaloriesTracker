'use client'

import Image from 'next/image';
import React from 'react'
import { IoMdArrowBack } from "react-icons/io"
import styles from '../../recipesPage/recipes.module.css'
import RecipesItems from '@/components/RecipesItems/RecipesItems';
import { CiCirclePlus } from "react-icons/ci";
import axios from 'axios';

function page({ mealType, urlImage }) {
    
    const onClose = () => {
        window.history.back();
    }

    return (
        <div className='w-full mb-[60px]'>
            <div className='flex flex-1 justify-between p-4 mb-5'>
                <div className='flex flex-col gap-5'>
                    <button onClick={() => onClose(false)}>
                        <IoMdArrowBack className='text-black' size={25} />
                    </button>

                    <label className='text-black text-2xl'>{mealType}Breakfast</label>
                </div>

                <div className='w-[100px] relative'>
                    <Image src={'/images/breakfast/ba.png'} alt='' fill />
                </div>
            </div>

            <a href='/recipesPage/recipesMeal/newPost' className='flex justify-end'>
                <CiCirclePlus size={40} className='text-gray-500 mr-3 hover:text-green-600'/>
            </a>

            <ul className={styles.photos}>
                <li className={styles.photo}>
                    <RecipesItems/>
                </li>
                <li className={styles.photo}>
                    <RecipesItems/>
                </li>
                <li className={styles.photo}>
                    <RecipesItems/>
                </li>
                <li className={styles.photo}>
                    <RecipesItems/>
                </li>
            </ul>
        </div>
    )
}

export default page