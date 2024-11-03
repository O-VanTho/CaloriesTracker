'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import UserInfo from '@/components/UserInfo/UserInfo';

function page() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the token is present in localStorage
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log("Error token");
        window.location.href = '/login';
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/current-user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Token expired or invalid, redirecting to login...');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.log("Other error:", error);
        }
      }
    }

    fetchUser();
  }, [])

  return (
    <div className='min-h-full h-fit'>
      <div className="flex justify-center items-center relative p-8 overflow-hidden">
        <svg
          className="absolute bottom-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 400"
          height="240"
        >
          <path
            fill="rgb(118, 200, 71, 1)"
            fillOpacity="1"
            d="M0,128L40,122.7C80,117,160,107,240,106.7C320,107,400,117,480,144C560,171,640,213,720,240C800,267,880,277,960,272C1040,267,1120,245,1200,218.7C1280,192,1360,160,1400,144L1440,128L1440,400L1400,400C1360,400,1280,400,1200,400C1120,400,1040,400,960,400C880,400,800,400,720,400C640,400,560,400,480,400C400,400,320,400,240,400C160,400,80,400,40,400L0,400Z"
          />
        </svg>
        <div className='rounded-full border-[6px] border-white relative w-[100px] h-[120px] overflow-hidden'>
          <Image fill alt='' src={'/images/AVATA.jpg'} />
        </div>
      </div>

      <div className='bg-[#77c800] w-full h-fit'>
        <div className='p-8 px-5 bg-white border-[2px] rounded-t-[35px] h-fit flex flex-col gap-6'>
          <UserInfo info={"Height"} value={user ? user.height : 0} unit={'cm'} bg_color={'bg-green-100'} />
          <UserInfo info={"Weight"} value={user ? user.weight : 0} unit={'kg'} bg_color={'bg-red-100'} />
          <UserInfo info={"Age"} value={user ? user.age : 0} unit={''} bg_color={'bg-blue-100'} />
          <UserInfo info={"Calories Intake"} value={user ? user.BMR : 0} unit={'cal'} bg_color={'bg-yellow-100'} />
          <UserInfo info={"Goal"} value={user ? user.goal : 0} unit={''} bg_color={'bg-purple-100'} />
          <UserInfo info={"Active Level"} value={user ? user.activeLevel : 0} unit={''} bg_color={'bg-teal-100'} />
        </div>
      </div>

    </div>

  )
}

export default page