"use client"

import SignUpStep1 from '@/components/SignUpStep1/SignUpStep1';
import SignUpStep2 from '@/components/SignUpStep2/SignUpStep2';
import React, { useState } from 'react';

const page = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const nextStep = (data) => {
        setFormData(data);
        setStep(2);
    }

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="fixed z-10 w-[-webkit-fill-available] flex justify-center items-center h-screen bg-gradient-to-r from-green-400 to-green-500">
            {step === 1 ? (
                <SignUpStep1 nextStep={nextStep}/>
            ) : (
                <SignUpStep2 formData={formData} prevToStep1={prevStep}/>
            )}
        </div>
    );
};

export default page;
