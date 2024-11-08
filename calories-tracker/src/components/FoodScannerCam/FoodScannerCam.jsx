import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { foodItems } from '@/dataset/foodItems';
import { RxUpload } from "react-icons/rx";

const FoodScannerCam = ({ onClose }) => {
  const [model, setModel] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [detectedFood, setDetectedFood] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store uploaded image file
  const [detectedImageSrc, setDetectedImageSrc] = useState(null); // Store the captured image for display

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
        console.log('Nutritional facts:', response.data.foods);
      }
    } catch (error) {
      console.error('Error fetching nutrition facts:', error);
    }
  };

  const processFoodDetection = async (imageSrc) => {
    if (imageSrc) {

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
          .filter(item => item.probability > 0.5) // Set a threshold for detection
          .sort((a, b) => b.probability - a.probability); // Sort by probability

        if (detectedFoodItems.length > 0) {
          const foodName = detectedFoodItems[0].className;
          setDetectedFood(foodName);
          setDetectedImageSrc(imageSrc);
          fetchNutritionFacts(foodName);
        } else {
          console.log("No food detected");
        }
      } catch (error) {
        console.error('Error detecting food:', error);
      }
    }
  };

  const logFood = async () => {
    try {
      const res = await axios.post();
      clearDetectedFood();

    } catch (error) {
      console.log("Error Log Food")
    }
  }

  const clearDetectedFood = () => {
    setDetectedFood(null);
    setImageFile(null);
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
        processFoodDetection(imageSrc); // Pass webcam screenshot to detection function
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [model, detectedFood, imageFile]);

  return (
    <div className="relative h-screen bg-gray-900">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-4 text-white text-2xl bg-gray-800 p-3 rounded-full z-50"
      >
        <FaArrowLeft />
      </button>

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
      {detectedFood && (
        <div className="absolute flex bg-white bottom-20 z-20 w-full p-1 gap-3">
          {/* Display the captured image */}
          <div className='w-[180px] relative'>
            {detectedImageSrc && (
              <img alt={detectedFood} src={detectedImageSrc} className='absolute w-full h-full object-cover' />
            )}
          </div>

          <div className='flex justify-between w-full'>
            <div className='flex flex-col gap-2 text-black'>
              <h1 className='font-semibold'>Name: {detectedFood}</h1>
              <ul className='text-gray-400'>
                <li>Calories: </li>
                <li>Carbs: </li>
                <li>Fat: </li>
                <li>Protein: </li>
              </ul>
            </div>

            <div className='flex flex-col gap-3'>
              <button onClick={logFood} className='h-[40px] w-[83px] px-2 text-center bg-white text-black rounded border-black border-2 text-sm font-semibold'>Log Food</button>
              <button onClick={clearDetectedFood} className='h-[40px] w-[83px] px-2 text-center bg-white text-gray-500 rounded border-gray-500 border-2 text-sm font-semibold'>Cancel</button>
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
