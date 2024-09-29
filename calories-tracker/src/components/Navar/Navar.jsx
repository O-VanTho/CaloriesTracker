import React from 'react'
import { FaHome, FaBook, FaQrcode, FaUtensils, FaCog } from 'react-icons/fa';
import styles from "./navar.module.css"

function Navar() {
  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-between items-center h-[4.25rem] max-w-md mx-auto gap-[12px]">
        
        <button className={styles.btn_nav}>
          <FaHome className="mx-auto text-xl" />
        </button>

        <button className={styles.btn_nav}>
          <FaBook className="mx-auto text-xl" />
        </button>

        <button className={styles.camera_btn}>
          <FaQrcode className="mx-auto text-xl" />
        </button>

        <button className={styles.btn_nav}>
          <FaUtensils className="mx-auto text-xl" />
        </button>

        <button className={styles.btn_nav}>
          <FaCog className="mx-auto text-xl" />
        </button>

      </div>
    </nav>
  )
}


export default Navar