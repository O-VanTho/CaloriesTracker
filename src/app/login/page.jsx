"use client"

import axios from 'axios';
import React, { useState } from 'react';
import styles from './login.module.css'

const page = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/sign-in', { formData })

            if(res.status == 200){
                localStorage.setItem('token', res.data.token);
                window.location.href = './';   
            }
        } catch (error) {
            console.log("Fail to Login", error);
        }
    };

    return (
        <div className={styles.area}>
            
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs text-gray-600 z-10">
                <div className="text-center mb-6">
                    <a href="./sign-up" className="text-gray-500 px-3 py-2 font-semibold focus:outline-none">
                        Sign Up
                    </a>
                    <button className="text-[#77c847] px-3 py-2 font-semibold border-b-2 border-[#77c847] focus:outline-none">
                        Login In
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77c847]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77c847]"
                            required
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-[#77c847] text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-green-600 transition duration-200"
                        >
                            LOG IN
                        </button>
                    </div>
                </form>
            </div>

            <ul className={styles.circles}>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
        </div>
    );
};

export default page;
