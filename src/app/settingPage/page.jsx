'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import UserInfo from '@/components/UserInfo/UserInfo';
import { IoSettingsOutline, IoLogInOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io"

function page() {
  const [user, setUser] = useState(null);
  const [openSetting, setOpenSetting] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    // Check if the token is present in localStorage
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log("Error token");
        window.location.href = './login';
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
          window.location.href = './login';
        } else {
          console.log("Other error:", error);
        }
      }
    }

    fetchUser();
  }, [])

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
    setIsChanged(true);
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, image: reader.result }); // Set the Base64 string as the user's image
        setIsChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChange = async () => {
    try {
      const res = await axios.post('http://localhost:5000/update-user', {user: user})
    } catch (error) {
      
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = './login';
  };

  return (
    <div className='min-h-full h-fit'>

      {openSetting ? (
        <div className='absolute bg-white w-full z-30 top-0 flex flex-col gap-4 min-h-screen'>
          <div className='w-full flex flex-col justify-center items-center pb-2'>
            <button className='self-start p-2' onClick={() => setOpenSetting(false)}>
              <IoMdArrowBack size={35} className='text-black ' />
            </button>
            <div className=' w-[150px] h-[150px] gap-2 overflow-hidden rounded-full relative'>
              <Image src={user ? user.image : '/images/AVATA.jpg'} alt='' fill />
            </div>

            <p className='text-black text-lg'>{user ? user.username : "Van Tho"}</p>

            <label className="w-[90%] rounded-md bg-green-400 text-white py-2 text-center cursor-pointer">
              Edit your Avatar
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <div className='text-black p-4 flex flex-col gap-3'>
            <label className="flex flex-col">
              <span>Height (cm):</span>
              <input
                type="number"
                name="height"
                value={user ? user.height : 0}
                onChange={handleChange}
                className="border rounded p-2"
              />
            </label>

            <label className="flex flex-col">
              <span>Weight (kg):</span>
              <input
                type="number"
                name="weight"
                value={user ? user.weight : 0}
                onChange={handleChange}
                className="border rounded p-2"
              />
            </label>

            <label className="flex flex-col">
              <span>Age:</span>
              <input
                type="number"
                name="age"
                value={user ? user.age : 0}
                onChange={handleChange}
                className="border rounded p-2"
              />
            </label>

            <label className="flex flex-col">
              <span>Calories Intake (BMR):</span>
              <input
                type="number"
                name="BMR"
                value={user ? user.BMR : 0}
                onChange={handleChange}
                className="border rounded p-2"
              />
            </label>

            <label className="flex flex-col">
              <span>Goal:</span>
              <select
                name="goal"
                value={user ? user.goal : ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value={"Weight Loss"}>Weight Loss</option>
                <option value={"Maintenance"}>Maintenance</option>
                <option value={"Weight Gain"}>Weight Gain</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span>Active Level</span>
              <select
                name="activeLevel"
                value={user ? user.activeLevel : ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value={"1"}>Not Active</option>
                <option value={"2"}>Medium</option>
                <option value={"3"}>Hard</option>
              </select>
            </label>

            <label onClick={handleLogout} className='flex justify-between items-center rounded border px-2 py-1 text-[#77c847]'>
              <span className='text-[16px]'>Logout</span>
              <IoLogInOutline size={30} />
            </label>
          </div>

          <button onClick={saveChange} className={`w-auto py-2 text-center border m-2 rounded-[35px] ${isChanged ? 'bg-white text-[#77c847]' : 'text-gray-500 bg-gray-200'}`}>Save Change</button>
        </div>
      ) : (
        <div>
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
            <button onClick={() => setOpenSetting(true)} className='absolute z-[1px] top-2 right-2 p-1 px-1 rounded-lg bg-[#77c847] '>
              <IoSettingsOutline size={35} />
            </button>
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
      )}
    </div>

  )
}

export default page