'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io"
import styles from '../../recipesPage/recipes.module.css'
import RecipiesItems from '@/components/RecipesItems/RecipesItems';
import { CiCirclePlus } from "react-icons/ci";
import axios from 'axios';

function page() {

    const [category, setcategory] = useState(null);
    const [urlImage, setUrlImage] = useState(null);
    const [listPost, setListPost] = useState(null);

    useEffect(() => {
        if (window === undefined) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        setcategory(params.get("category"));
        setUrlImage(params.get("urlImage"));
    }, []);


    useEffect(() => {
        const fetchListPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/get-posts/${category}`);
                setListPost(res.data.posts);
            } catch (error) {
                console.log("Fetch list post failed", error);
            }
        }

        if (!category) {
            return;
        }

        fetchListPost();
    }, [category]);


    const onClose = () => {
        window.history.back();
    }

    if (!category || !urlImage) {
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

                    <label className='text-black text-2xl'>{category}</label>
                </div>

                <div className='w-[100px] relative'>
                    <Image src={urlImage} alt='' fill />
                </div>
            </div>

            <div className='flex justify-end'>
                <a href={`/recipesPage/recipesMeal/newPost?category=${encodeURIComponent(category)}`} className='w-fit'>
                    <CiCirclePlus size={40} className='text-gray-500 mr-3 hover:text-green-600' />
                </a>
            </div>

            <ul className={styles.photos}>

                {listPost && listPost.map((post) => (
                    <li key={post._id} className={styles.photo}>
                        <a href={`/recipesPage/recipesMeal/postContent?postId=${encodeURIComponent(post._id)}`} className='w-full'>
                            <RecipiesItems title={post.title} author={post.author.username} categoryFood={post.category} timeCost={post.timeCost} difficulty={post.difficulty} rate={post.rate} image={post.image} />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default page