"use client"

import React, { useState } from 'react';

const page = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <div className="fixed z-10 w-[-webkit-fill-available] flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-green-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
                <div className="text-center mb-6">
                    <a href="/sign-up" className="text-gray-500 px-3 py-2 font-semibold focus:outline-none">
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
        </div>
    );
};

export default page;
