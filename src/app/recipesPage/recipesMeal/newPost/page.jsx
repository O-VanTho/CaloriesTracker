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

    const onClose = () => {
        window.history.back();
    }

    useEffect(() => {
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
        food: '',
        timeCost: '',
        content: '',
        difficulty: '',
        image: ''
    });

    useEffect(() => {
        if (window === undefined) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");
        setPostData({ ...postData, category: category });
    }, []);

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
            const res = await axios.post('http://localhost:5000/create_post', { postData, userId: user._id });

            if (res.status === 200) {
                setDialog(true);

                setPostData({
                    title: '',
                    category: '',
                    food: '',
                    timeCost: '',
                    content: '',
                    difficulty: '',
                    image: ''
                });

                setTimeout(() => setDialog(false), 2000);
            }
        } catch (error) {
            console.log("Error fetching add Post", error);
        }
    }

    return (
        <div className='px-4 py-6 flex flex-col gap-8'>
            <div className='flex justify-between text-black'>
                <h1 className='text-3xl w-[220px]'>Share your own recipie</h1>

                <button onClick={onClose}>
                    <IoMdClose className='text-black' size={25} />
                </button>
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Name of Food</label>
                <input name='title' value={postData.title} onChange={handleChange} className='text-gray-500 py-3 px-4' placeholder='Enter a name for your recipie' />
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Category</label>
                <select name='category' value={postData.category} onChange={handleChange} className='text-gray-500 py-3 px-4'>
                    <option hidden>Select category</option>
                    <option value="Oat Meal">Oat Meal</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                </select>
            </div>

            <div className='flex flex-col gap-4 text-sm'>
                <label className='text-black'>Food</label>
                <input name='food' value={postData.food} onChange={handleChange} className='text-gray-500 py-3 px-4' placeholder='Enter type of food (pancake, oatmeal, etc...)' />
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
                    placeholder='Write your recipie instructions here...'
                />
            </div>

            <button className='flex justify-center' onClick={addPost}>
                <FaCirclePlus className='text-green-400' size={45} />
            </button>

            {dialog && (
                <div className='flex flex-col justify-center items-center fixed h-screen w-full bg-white'>
                    <div className='flex flex-col items-center'>
                        <FaCircleCheck className='text-green-500' size={60} />
                        <p className='text-xl mt-4 text-black'>Post added successfully!</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page;