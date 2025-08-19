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
        age: 0,
        height: 100,
        weight: 0,
        activeLevel: '',
        goal: ''
    });
    const [step, setStep] = useState(1);

    const handleChangeUserInfo = (e) => {
        setUserInfor({ ...userInfo, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/create-user', { formData, userInfo });

            if(res.status === 200){
                window.location.href = './login';
            }
        } catch (error) {
            console.error('Error creating user: ', error);
        }
    };

    const handleMinusBtn = (type) => {
        if (userInfo[type] > 0) {
            setUserInfor({ ...userInfo, [type]: userInfo[type] - 1 });
        }
    };
    
    const handlePlusBtn = (type) => {
        setUserInfor({ ...userInfo, [type]: userInfo[type] + 1 });
    };

    const nextStep = () => {
        setStep(step + 1);
    }

    const prevStep = () => {
        setStep(step - 1);
    }
    return (
        <div className='fixed bg-white w-full h-full p-2 text-black z-10'>
            {step === 1 && (
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <button onClick={prevToStep1}>
                            <IoIosArrowRoundBack size={40} />
                        </button>
                        <h2 className='text-2xl font-semibold ml-4'>Choose One</h2>
                    </div>

                    <div className='flex justify-around'>
                        <div className={`border-[2px] rounded-full py-14 ${userInfo.gender === "Female" ? "text-white bg-pink-500" : "text-gray-200 "}`}>
                            <FaFemale size={140} />
                        </div>

                        <div className={`border-[2px] rounded-full py-14 ${userInfo.gender === "Male" ? "text-white bg-blue-500" : "text-gray-200"}`}>
                            <FaMale size={140} />
                        </div>
                    </div>

                    <div className='relative self-center w-[260px] bg-gray-300 rounded-3xl flex border-gray-200'>
                        <button
                            onClick={() => setUserInfor({ ...userInfo, gender: "Female" })}
                            className={`w-[150px] text-lg py-3 px-11 bg-white border rounded-[26px] ${userInfo.gender === "Female" ? "border-pink-500 text-pink-600 z-10" : "border-transparent text-gray-400"
                                }`}
                        >
                            Female
                        </button>

                        <button
                            onClick={() => setUserInfor({ ...userInfo, gender: "Male" })}
                            className={`absolute right-0 w-[150px] text-lg py-3 px-11 bg-white border rounded-[26px] ${userInfo.gender === "Male" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400"
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

                    <div className='flex justify-around py-2 bg-gradient-to-r from-green-400 to-green-500'>
                        <div className='flex flex-col items-center'>
                            <label className='text-white text-lg'>Active Level</label>
                            <select
                                name="activeLevel"
                                value={userInfo.activeLevel}
                                onChange={handleChangeUserInfo}
                                className="w-fit rounded-2xl p-2"
                            >
                                <option value={"1"}>Not Active</option>
                                <option value={"2"}>Medium</option>
                                <option value={"3"}>Hard</option>
                            </select>
                        </div>
                        <div className='flex flex-col items-center'>
                            <label className='text-white text-lg'>Active Level</label>
                            <select
                                name="goal"
                                value={userInfo.goal}
                                onChange={handleChangeUserInfo}
                                className="w-fit rounded-2xl p-2"
                            >
                                <option value={"Weight Loss"}>Weight Loss</option>
                                <option value={"Maintenance"}>Maintenance</option>
                                <option value={"Weight Gain"}>Weight Gain</option>
                            </select>
                        </div>
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
                                <button onClick={() => handleMinusBtn("age")} className='bg-white rounded-full p-2'>
                                    <FaMinus size={28} />
                                </button>
                                <button onClick={() => handlePlusBtn("age")} className='bg-white rounded-full p-2'
                                    ><FaPlus size={28} />
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col items-center bg-green-500 p-5 px-8'>
                            <span>Weight (kg)</span>
                            <input
                                className='w-[80px] p-4 text-3xl text-center font-thin bg-transparent'
                                name='weight'
                                type='number'
                                value={userInfo.weight}
                                onChange={handleChangeUserInfo}
                            />
                            <div className='flex justify-around items-center text-green-400 gap-6'>
                                <button onClick={() => handleMinusBtn("weight")} className='bg-white rounded-full p-2'>
                                    <FaMinus size={28} />
                                </button>
                                <button onClick={() => handlePlusBtn("weight")} className='bg-white rounded-full p-2'
                                    ><FaPlus size={28} />
                                </button>    
                                
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md p-4 mx-auto text-center">
                        <h2 className="text-xl font-semibold">Height</h2>
                        <p className="text-sm text-gray-500 mb-2">Centimeters</p>

                        <div className="relative w-full slider-container">
                            {/* The input range */}
                            <input
                                type="range"
                                min="100"
                                max="250"
                                step="1"
                                name="height"
                                value={userInfo.height}
                                onChange={handleChangeUserInfo}
                                className="slider"
                            />

                            {/* Custom tick marks */}
                            <div className="w-full flex justify-between text-sm text-gray-500">
                                {['100', '150', '200', '250'].map((value, index) => (
                                    <span key={index} className="tick-label">{value}</span>
                                ))}
                            </div>

                            {/* Custom ticks */}
                            <div className="absolute top-2.5 w-full flex justify-between px-2 tick-marks">
                                {[...Array(13)].map((_, index) => (
                                    <div key={index} className="tick"></div>
                                ))}
                            </div>
                        </div>

                        <p className="mt-10 text-lg font-medium">
                            Your selected height: <span>{userInfo.height} cm</span>
                        </p>
                    </div>

                    <style jsx>{`
                        /* Slider container */
                        .slider-container {
                            position: relative;
                            margin-top: 20px;
                        }

                        /* Range input slider */
                        .slider {
                            -webkit-appearance: none;
                            width: 100%;
                            height: 8px;
                            background: #e5e5e5;
                            border-radius: 10px;
                            outline: none;
                            cursor: pointer;
                        }

                        /* Slider thumb */
                        .slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            background-color: #4caf50;
                            border-radius: 50%;
                            cursor: pointer;
                        }

                        .slider::-moz-range-thumb {
                            width: 20px;
                            height: 20px;
                            background-color: #4caf50;
                            border-radius: 50%;
                            cursor: pointer;
                        }

                        /* Custom tick marks */
                        .tick-marks {
                            position: absolute;
                            top: -10px;
                            width: 100%;
                        }

                        .tick {
                            height: 15px;
                            width: 1px;
                            background: #000;
                        }

                        /* Labels for ticks */
                        .tick-label {
                            position: relative;
                        }
                    `}</style>

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
