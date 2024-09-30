'use client'

import React from 'react'
import { FaHome, FaBook, FaQrcode, FaUtensils, FaCog } from 'react-icons/fa';
import styles from "./navar.module.css"
import { useLocation } from 'react-router-dom';

function Navar() {
  const location = useLocation();
  const isActive = (path) => location.pathname == path ? "text-[#77c847]" : "text-[rgb(75 85 99 1)]";

  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-between items-center h-[4.25rem] max-w-md mx-auto gap-[12px]">
        
        <a href='/' className={styles.btn_nav}>
          <FaHome className={`mx-auto text-xl ${isActive}`} />
        </a>

        <a href='/diaryPage' className={styles.btn_nav}>
          <FaBook className={`mx-auto text-xl ${isActive}`} />
        </a>

        <button className={styles.camera_btn}>
          <FaQrcode className={`mx-auto text-xl ${isActive}`} />
        </button>

        <a href='/recipesPage' className={styles.btn_nav}>
          <FaUtensils className={`mx-auto text-xl ${isActive}`} />
        </a>

        <a href='/settingPage' className={styles.btn_nav}>
          <FaCog className={`mx-auto text-xl ${isActive}`} />
        </a>

      </div>
    </nav>
  )
}


export default Navar