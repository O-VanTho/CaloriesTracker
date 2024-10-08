"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import styles from './calendar.module.css';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns";

function Calendar({ onDateChange, flexDirection = 'row' }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        onDateChange(selectedDate);
        formatDisplayDate();
    }, [selectedDate]);

    function handlePrevButton() {
        const newDay = subDays(selectedDate, 1);
        setSelectedDate(newDay);
    }

    function handleNextButton() {
        const newDay = addDays(selectedDate, 1);
        setSelectedDate(newDay);
    }

    // Function to format the selected date for display
    const formatDisplayDate = () => {
        console.log("format run")
        if (isToday(selectedDate)) {
            return "Today";
        } else if (isTomorrow(selectedDate)) {
            return "Tomorrow";
        } else if (isYesterday(selectedDate)) {
            return "Last day";
        } else {
            return selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };

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
                customInput={<CustomInput value={formatDisplayDate()}  />}
            />
            <button onClick={handleNextButton} className={`${styles.button} ${styles.rightBtn}`}>
                <IoMdArrowDropright size={24} />
            </button>
        </div>
    );
}

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly
      className="text-[#77c847] text-center border-none bg-transparent focus:outline-none"
  />
));

export default Calendar;
