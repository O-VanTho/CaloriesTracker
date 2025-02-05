'use client';
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function page() {
  const [postId, setPostId] = useState(null);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [likedPost, setLikedPost] = useState(false);

  useEffect(() => {
    if (window === undefined) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setPostId(params.get("postId"));

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
  }, []);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/get-post/${postId}`);
      setPost(res.data.post);

      if(res.data.post.likes.includes(user._id)){
        setLikedPost(true);
      }else{
        setLikedPost(false);
      }
    } catch (error) {
      console.log("Error fetch post content", error);
    }
  }
  useEffect(() => {
    if (!postId || !user) {
      return;
    }

    fetchPost();
  }, [postId, user])

  const onClose = () => {
    window.history.back();
  }

  const handleLikePost = async () => {
    try {
      const res = await axios.post("http://localhost:5000/like-post",{postId: postId, userId: user._id});
      
      if(res.status === 200){
        fetchPost();
      }
    } catch (error) {
      console.log("Error handle like post", error);
    }
  }

  if (post) {
    return (
      <div>
        <div className='relative h-[245px] rounded-b-[2rem] overflow-hidden'>
          <button onClick={onClose} className='absolute left-2 top-2'>
            <IoMdArrowBack className="text-gray-500" size={35} />
          </button>

          <img alt='' src={post.image} loading='lazy' className='w-full h-full object-cover' />
        </div>
        <div className="px-5 pt-8 flex flex-col gap-5 text-black">
          <div className=" font-normal flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h1 className='text-2xl'>{post.title}</h1>

              <button onClick={handleLikePost}>
                <FaHeart className={`${likedPost ? 'text-red-500' : 'text-gray-200'}`} size={30} />
              </button>
            </div>

            <div className="flex gap-3">
              <span className="text-gray-400 text-xl">Recipie</span>
              <span className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                {post.rate}
              </span>
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-400 pt-5">
            <p>Time Cost: {post.timeCost} minutes</p>
            <p>Difficulty: {post.difficulty}</p>
          </div>

          <div className="border-t border-gray-400 pt-5">
            {post.content}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}

export default page