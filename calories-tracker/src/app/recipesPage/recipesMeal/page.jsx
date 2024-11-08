'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io"
import styles from '../../recipesPage/recipes.module.css'
import RecipesItems from '@/components/RecipesItems/RecipesItems';
import { CiCirclePlus } from "react-icons/ci";

function page() {
    
    const [mealType, setMealType] = useState(null);
    const [urlImage, setUrlImage] = useState(null);

    useEffect(() => {
        if(window === undefined){
            return;
        }

        const params = new URLSearchParams(window.location.search);
        setMealType(params.get("mealType"));
        setUrlImage(params.get("urlImage"));
    }, []);
    
    const onClose = () => {
        window.history.back();
    }

    if(!mealType || !urlImage){
        return (
            <div className='flex justify-center w-3 items-center'>
                Loading...
            </div>
        )
    }

    return (
        <div className='w-full mb-[60px]'>
            <div className='flex flex-1 justify-between p-4 mb-5'>
                <div className='flex flex-col gap-5'>
                    <button onClick={() => onClose(false)}>
                        <IoMdArrowBack className='text-black' size={25} />
                    </button>

                    <label className='text-black text-2xl'>{mealType}</label>
                </div>

                <div className='w-[100px] relative'>
                    <Image src={urlImage} alt='' fill/>
                </div>
            </div>

            <a href={`/recipesPage/recipesMeal/newPost?mealType=${encodeURIComponent(mealType)}`} className='flex justify-end'>
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