'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { IoMdClose } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";

function Page() {
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dialog, setDialog] = useState(false);

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

    const [postData, setPostData] = useState({
        title: '',
        category: '',
        timeCost: '',
        content: '',
        difficulty: '',
        image: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
    
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result; 
                setPostData({ ...postData, image: base64String });
            };
    
            reader.readAsDataURL(file); 
        }
    };

    const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    }

    const addPost = async () => {
        try {
            const res = await axios.post('http://localhost:5000/create_post', {postData, userId: user._id});

            setPostData(res.data.post);
        } catch (error) {
            console.log("Error fetching add Post", error);
        }
    }

    return (
        <div className='px-4 py-6 flex flex-col gap-8'>
            <div className='flex justify-between text-black'>
                <h1 className='text-3xl w-[220px]'>Share your own Recipe</h1>

                <a href='/recipesPage/recipesMeal' >
                    <IoMdClose className='text-black' size={25} />
                </a>
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Name of Food</label>
                <input name='title' value={postData.title} onChange={handleChange} className='text-gray-500 py-3 px-4' placeholder='Enter a name for your recipe' />
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Category</label>
                <input name='category' value={postData.category} onChange={handleChange} className='text-gray-500 py-3 px-4' placeholder='Enter type of food (pancake, oatmeal, etc...)' />
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Time to cook</label>
                <input name='timeCost' value={postData.timeCost} onChange={handleChange} className='text-gray-500 py-3 px-4' placeholder='Time required (in minutes)' />
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Difficulty</label>
                <select name='difficulty' value={postData.difficulty} onChange={handleChange} className='text-gray-500 py-3 px-4'>
                    <option hidden>Select cooking difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Upload Image Thumbnail</label>
                <input type='file' onChange={handleImageChange} className='text-gray-500 py-3 px-4' accept="image/*" />

                <div className='mt-2 w-full h-48 rounded border-dashed border-[5px] flex justify-center'>
                    {preview && <img src={preview} alt='Thumbnail preview' className='h-full object-fill' />}
                </div>
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Description</label>
                <textarea
                    name='content' value={postData.content} onChange={handleChange}
                    className='text-gray-500 py-3 px-4 h-32'
                    placeholder='Write your recipe instructions here...'
                />
            </div>

            <button className='flex justify-center' onClick={addPost}>
                <FaCirclePlus className='text-green-400' size={45} />
            </button>

            {dialog && (
                <div className='flex flex-col justify-center items-center fixed h-screen w-full bg-white'>
                    <FaCircleCheck />
                </div>
            )}
        </div>
    )
}

export default Page;