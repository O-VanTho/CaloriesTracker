"use client"

import SignUpStep1 from '@/components/SignUpStep1/SignUpStep1';
import SignUpStep2 from '@/components/SignUpStep2/SignUpStep2';
import React, { useState } from 'react';
import styles from '@/app/login/login.module.css'

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
        <div className={styles.area}>

            {step === 1 ? (
                <SignUpStep1 nextStep={nextStep} />
            ) : (
                <SignUpStep2 formData={formData} prevToStep1={prevStep} />
            )}

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
