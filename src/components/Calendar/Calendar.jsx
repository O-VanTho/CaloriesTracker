"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import styles from './calendar.module.css';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays } from "date-fns";

function Calendar({ onDateChange, flexDirection = 'row' }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        onDateChange(selectedDate);
    }, [selectedDate]);

    function handlePrevButton() {
        const newDay = subDays(selectedDate, 1);
        setSelectedDate(newDay);
    }

    function handleNextButton() {
        const newDay = addDays(selectedDate, 1);
        setSelectedDate(newDay);
    }

    return (
        <div className={`w-full flex gap-1 justify-between p-2 ${flexDirection}`}>
            <button onClick={handlePrevButton} className={`${styles.button} ${styles.leftBtn}`}>
                <IoMdArrowDropleft size={24} />
            </button>
            {/* Controlled input display */}
            <DatePicker
                className="text-[#77c847] text-center"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="EEE, MMMM d, yyyy"
            />
            <button onClick={handleNextButton} className={`${styles.button} ${styles.rightBtn}`}>
                <IoMdArrowDropright size={24} />
            </button>
        </div>
    );
}

export default Calendar;
