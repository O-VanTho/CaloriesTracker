'use client'

import React, { useEffect, useState } from 'react';
import { FaHome, FaBook, FaQrcode, FaUtensils, FaUser } from 'react-icons/fa';
import styles from "./navar.module.css"
import FoodScannerCam from '../FoodScannerCam/FoodScannerCam';

function Navar() {
  const [pathName, setPathName] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathName(window.location.pathname);
    }
  }, []);

  const isActive = (path) => pathName == path ? "text-[#77c847]" : "text-[rgb(75 85 99 1)]";

  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-between items-center h-[4.25rem] max-w-md mx-auto gap-[12px]">
        
        <a href='/' className={styles.btn_nav}>
          <FaHome className={`mx-auto text-xl ${isActive('/')}`} />
        </a>

        <a href='/diaryPage' className={styles.btn_nav}>
          <FaBook className={`mx-auto text-xl ${isActive('/diaryPage')}`} />
        </a>

        <button 
          className={styles.camera_btn}
          onClick={() => setShowScanner(true)}
        >
          <FaQrcode className={`mx-auto text-xl`} />
        </button>

        <a href='/recipesPage' className={styles.btn_nav}>
          <FaUtensils className={`mx-auto text-xl ${isActive('/recipesPage')}`} />
        </a>

        <a href='/settingPage' className={styles.btn_nav}>
          <FaUser className={`mx-auto text-xl ${isActive('/settingPage')}`} />
        </a>

      </div>
      {showScanner && <FoodScannerCam onClose={() => setShowScanner(false)} />}
    </nav>
  )
}


export default Navar