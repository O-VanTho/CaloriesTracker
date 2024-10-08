"use client"

import React, { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaFemale, FaMale } from "react-icons/fa";
import { FaRightLong, FaPlus, FaMinus, FaCheck } from "react-icons/fa6";
import axios from 'axios';

const SignUpStep2 = ({ formData, prevToStep1 }) => {

    const [userInfo, setUserInfor] = useState({
        username: '',
        gender: '',
        age: '0',
        height: '',
        weight: '0',
        activeLevel: '0',
        goal: ''
    });
    const [step, setStep] = useState(1);

    const handleChangeUserInfo = (e) => {
        setUserInfor({ ...userInfo, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post('http://localhost:5000/create-user', {formData, userInfo});
        } catch (error) {
            console.error('Error creating user: ', error);            
        }
    };

    const nextStep = () => {
        setStep(step + 1);
    }

    const prevStep = () => {
        setStep(step - 1);
    }
    return (
        <div className='fixed bg-white w-full h-full p-2 text-black'>
            {step === 1 && (
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <button onClick={prevToStep1}>
                            <IoIosArrowRoundBack size={40} />
                        </button>
                        <h2 className='text-2xl font-semibold ml-4'>Choose One</h2>
                    </div>

                    <div className='flex justify-around border-gray-200'>
                        <div className={`border-[2px] rounded-full py-14 ${userInfo.gender === "Female" ? "text-white bg-pink-500" : "text-gray-200 border-transparent"}`}>
                            <FaFemale size={140} />
                        </div>

                        <div className={`border-[2px] rounded-full py-14 ${userInfo.gender === "Male" ? "text-white bg-blue-500" : "text-gray-200 border-transparent"}`}>
                            <FaMale size={140} />
                        </div>
                    </div>

                    <div className='relative self-center w-[260px] bg-gray-300 rounded-3xl flex'>
                        <button
                            onClick={() => setUserInfor({ ...userInfo, gender: "Female" })}
                            className={`w-[150px] text-lg py-3 px-11 bg-white border rounded-[26px] ${userInfo.gender === "Female" ? "border-pink-500 text-pink-600 z-10" : "border-gray-200 text-gray-400"
                                }`}
                        >
                            Female
                        </button>

                        <button
                            onClick={() => setUserInfor({ ...userInfo, gender: "Male" })}
                            className={`absolute right-0 w-[150px] text-lg py-3 px-11 bg-white border rounded-[26px] ${userInfo.gender === "Male" ? "border-blue-500 text-blue-600" : "border-gray-200 text-gray-400"
                                }`}
                        >
                            Male
                        </button>
                    </div>

                    <button onClick={nextStep} className={`bg-green-500 rounded-full w-fit p-3 text-white self-center mb-4 ${userInfo.gender === '' ? 'pointer-events-none' : ''}`}>
                        <FaRightLong size={35} />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <button onClick={prevStep}>
                            <IoIosArrowRoundBack size={40} />
                        </button>
                        <h2 className='text-2xl font-semibold ml-4'>Your body information</h2>
                    </div>

                    <div className='flex justify-between text-white'>
                        <div className='flex flex-col items-center bg-green-500 p-5 px-8'>
                            <span>Age</span>
                            <input
                                className='w-[80px] p-4 text-3xl text-center font-thin bg-transparent'
                                name='age'
                                type='number'
                                value={userInfo.age}
                                onChange={handleChangeUserInfo}
                            />
                            <div className='flex justify-aounrd items-center text-green-400 gap-6'>
                                <button className='bg-white rounded-full p-2'><FaMinus size={28} /></button>
                                <button className='bg-white rounded-full p-2'><FaPlus size={28} /></button>
                            </div>
                        </div>

                        <div className='flex flex-col items-center bg-green-500 p-5 px-8'>
                            <span>Weight</span>
                            <input
                                className='w-[80px] p-4 text-3xl text-center font-thin bg-transparent'
                                name='weight'
                                type='number'
                                value={userInfo.weight}
                                onChange={handleChangeUserInfo}
                            />
                            <div className='flex justify-around items-center text-green-400 gap-6'>
                                <button className='bg-white rounded-full p-2'><FaMinus size={28} /></button>
                                <button className='bg-white rounded-full p-2'><FaPlus size={28} /></button>
                            </div>
                        </div>
                    </div>

                    <div></div>

                    <button onClick={nextStep} className='bg-green-500 rounded-full w-fit p-3 text-white self-center mb-4'>
                        <FaRightLong size={35} />
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className='flex flex-col justify-between h-full items-center'>

                    <button className='self-start' onClick={prevStep}>
                        <IoIosArrowRoundBack size={40} />
                    </button>


                    <div className='w-[200px] text-center'>
                        <h1 className='text-2xl font-semibold mb-6'>Enter your username</h1>
                        <div className='text-3xl flex flex-col'>
                            <label className='text-lg mb-1'>Hi,</label>
                            <input
                                className='w-full p-2 text-4xl border-b-2 border-gray-300 focus:outline-none focus:border-green-500 transition-all duration-300'
                                type='text'
                                name='username'
                                value={userInfo.username}
                                onChange={handleChangeUserInfo}
                            />
                        </div>
                    </div>

                    <button onClick={handleSubmit} className='bg-green-500 rounded-full w-fit p-3 text-white mb-4'>
                        <FaCheck size={35} />
                    </button>
                </div>
            )}

        </div>

    );
};

export default SignUpStep2;
