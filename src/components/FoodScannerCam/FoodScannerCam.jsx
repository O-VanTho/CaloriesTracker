import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { foodItems } from '@/dataset/foodItems';
import { RxUpload } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

const FoodScannerCam = ({ onClose }) => {

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

  const [model, setModel] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [detectedFood, setDetectedFood] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store uploaded image file
  const [detectedImageSrc, setDetectedImageSrc] = useState(null); // Store the captured image for display
  const [warnNotFoundFood, setWarnNotFoundFood] = useState(false);
  const [foodData, setFoodData] = useState(null);
  const [mealType, setMealType] = useState("Breakfast");
  const [prevLoggedFood, setPrevLoggedFood] = useState([]);

  const videoConstraints = {
    width: 720,
    height: 1280,
    facingMode: 'environment', // Use the back camera on mobile
  };

  const fetchNutritionFacts = async (food) => {
    const apiKey = '20FnJUBnx3LNNqhalYcz5x7ZZfvFYImjXtcarKwF';
    try {
      const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${apiKey}`);
      if (response.data && response.data.foods) {
        const nutrients = response.data.foods[0].foodNutrients;

        const fetchedData = {
          id: response.data.foods[0].fdcId,
          calories: nutrients.find(n => n.nutrientName === "Energy")?.value || 'N/A',
          carbs: nutrients.find(n => n.nutrientName === "Carbohydrate, by difference")?.value || 'N/A',
          fat: nutrients.find(n => n.nutrientName === "Total lipid (fat)")?.value || 'N/A',
          protein: nutrients.find(n => n.nutrientName === "Protein")?.value || 'N/A',
        };

        setFoodData(fetchedData);
      }
    } catch (error) {
      console.error('Error fetching nutrition facts:', error);
    }
  };

  const processFoodDetection = async (imageSrc) => {
    if (imageSrc) {
      console.log("run 1")
      try {
        const imgElement = new Image();
        imgElement.src = imageSrc;

        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });

        const tensorImg = tf.browser.fromPixels(imgElement)
          .resizeBilinear([224, 224])
          .expandDims(0)
          .div(255.0);

        const predictions = await model.predict(tensorImg).data();
        const detectedFoodItems = Array.from(predictions)
          .map((prob, index) => ({
            className: foodItems[index],
            probability: prob,
          }))
          .filter(item => item.probability > 0.1) // Set a threshold for detection
          .sort((a, b) => b.probability - a.probability); // Sort by probability


        if (detectedFoodItems.length > 0) {
          const foodName = detectedFoodItems[0].className.replace(/_/g, ' ');
          setDetectedFood(foodName);
          setDetectedImageSrc(imageSrc);
          fetchNutritionFacts(foodName);
        } else {
          setWarnNotFoundFood(true);
          setTimeout(() => setWarnNotFoundFood(false), 3000);
        }
      } catch (error) {
        console.error('Error detecting food:', error);
      }
    }
  };

  const prevLogFood = async (foodId, image) => {
    setPrevLoggedFood((prev) => [
      ...prev,
      { foodId: foodId, image: image }
    ])
  }

  const logFood = async () => {
    if (!user || !prevLoggedFood.length) return;

    try {
      const responses = await Promise.all(
        prevLoggedFood.map(async (food) => {
          const addFoodResponse = await axios.post(
            `http://localhost:5000/add-food-by-id/${food.foodId}`,
            { userId: user._id }
          );

          if (addFoodResponse.status === 200) {
            const curDate = new Date().toISOString();
            await axios.post(
              `http://localhost:5000/add-food-to-diary/${curDate}/${mealType}`,
              { userId: user._id, foodId: food.foodId, quantity: 1 }
            );
          }
        })
      );

      console.log("All foods logged successfully");
      setPrevLoggedFood([]);

    } catch (error) {
      console.error("Error logging foods:", error);
    }
  };



  const clearDetectedFood = () => {
    setDetectedFood(null);
    setImageFile(null);
    setFoodData(null);
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(file);
        processFoodDetection(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/model_tfjs/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.log("Load model fail", error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (model && webcamRef.current && !imageFile && !detectedFood) {
        const imageSrc = webcamRef.current.getScreenshot();
        processFoodDetection(imageSrc);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [model, detectedFood, imageFile]);

  return (
    <div className="relative h-screen bg-gray-900">

      {warnNotFoundFood && (
        <div className='text-red-500 px-4 py-2 w-fit absolute z-[1] left-1/2 -translate-x-1/2 top-2 bg-white rounded-3xl'>
          Food can't be found
        </div>
      )}

      <div className='px-2 py-1 w-full bg-[#9ded6e]'>
        <div className='pt-3 flex items-center justify-between'>
          <button onClick={onClose}>
            <IoClose size={25} />
          </button>

          <select value={mealType} onChange={(e) => setMealType(e.target.value)} className='text-white bg-transparent text-lg font-semibold'>
            <option className='bg-[#191b18]' value={'Breakfast'}>Breakfast</option>
            <option className='bg-[#191b18]' value={'Lunch'}>Lunch</option>
            <option className='bg-[#191b18]' value={'Dinner'}>Dinner</option>
            <option className='bg-[#191b18]' value={'Snack'}>Snack</option>
          </select>

          <div>

          </div>
        </div>

        <div className='mt-3 flex items-center justify-between'>
          <div className='flex items-center gap-2 h-[49px] px-[2px] rounded bg-white w-[225px] overflow-x-scroll'>
            {prevLoggedFood.map((food) => (
              <div key={food.id} className='h-[45px] overflow-hidden rounded'>
                <img alt='' src={food.image} className='h-full object-cover' />
              </div>
            ))}
          </div>

          <button onClick={logFood} className='w-auto py-2 px-5 text-center  text-white bg-[#191b18] rounded-3xl border text-sm font-semibold'>
            Log my meal
          </button>
        </div>

      </div>

      {/* Webcam Component */}
      <div className="relative h-full">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={videoConstraints}
        />
      </div>

      {/* Display Detected Food and Image */}
      {foodData && detectedFood && (
        <div className="absolute flex bg-white bottom-20 z-20 w-full p-1 py-3 gap-3 mb-2">
          <div className="w-[180px] relative">
            {detectedImageSrc && (
              <img
                alt={detectedFood}
                src={detectedImageSrc}
                className="absolute w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-2 text-black">
              <h1 className="font-semibold">Name: {detectedFood}</h1>
              <ul className="text-gray-400">
                <li>Calories: {foodData.calories}</li>
                <li>Carbs: {foodData.carbs}</li>
                <li>Fat: {foodData.fat}</li>
                <li>Protein: {foodData.protein}</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => prevLogFood(foodData.id, detectedImageSrc)}
                className="h-[40px] w-[83px] px-2 text-center bg-white text-black rounded border-black border-2 text-sm font-semibold"
              >
                Log Food
              </button>
              <button
                onClick={clearDetectedFood}
                className="h-[40px] w-[83px] px-2 text-center bg-white text-gray-500 rounded border-gray-500 border-2 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => fileInputRef.current.click()} className='absolute bottom-2 left-[50%] -translate-x-[50%] p-3 rounded-full bg-gray-400'>
        <RxUpload className='text-white' size={45} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FoodScannerCam;
