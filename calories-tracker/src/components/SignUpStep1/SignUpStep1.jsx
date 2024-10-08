import axios from 'axios';
import React, { useState } from 'react'

function SignUpStep1({nextStep}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckEmail = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        
        try {
            const res = await axios.post('http://localhost:5000/check-email', {email : formData.email});

            if(res.data.exists){
                console.log('Email already exists');
            } else {
                nextStep(formData);
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg text-gray-500 w-full max-text-gray-500 max-w-xs">
            <div className="text-center mb-6">
                <a className="text-[#77c847] px-3 py-2 font-semibold border-b-2 border-[#77c847] focus:outline-none">
                    Sign Up
                </a>
                <a href="/login" className="text-gray-500 px-3 py-2 font-semibold focus:outline-none">
                    Login In
                </a>
            </div>

            <form onSubmit={handleCheckEmail}>
                {/* <div className="mb-4">  
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77c847]"
                        required
                    />
                </div> */}

                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77c847]"
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
                        className="text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77c847]"
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className="text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77c847]"
                        required
                    />
                </div>

                <div className="flex justify-center">
                    <button type='submit'
                        className="bg-[#77c847] text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-green-600 transition duration-200"
                    >
                        SIGN UP
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignUpStep1