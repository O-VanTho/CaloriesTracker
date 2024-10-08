import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { foodItems } from '@/dataset/foodItems';

const FoodScannerCam = ({ onClose }) => {
  const [listFood, setListFood] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [model, setModel] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 720,
    height: 1280,
    facingMode: 'environment', // Use the back camera on mobile
  };

  const fetchNutritionFacts = async (food) => {
    const apiKey = '20FnJUBnx3LNNqhalYcz5x7ZZfvFYImjXtcarKwF'; 
    console.log("fetchNutritionFacts OUT RUN");
    try {
      console.log("fetchNutritionFacts IN RUN");
      
      const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${apiKey}`);
      if (response.data && response.data.foods) {
        console.log('Nutritional facts:', response.data.foods);
      }
    } catch (error) {
      console.error('Error fetching nutrition facts:', error);
    }
  };

  const processFoodDetection = async () => {

    if (!isProcessing && webcamRef.current && model) {
      setIsProcessing(true);

      const imageSrc = webcamRef.current.getScreenshot();

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
  
          const detectedFood = Array.from(predictions)
            .map((prob, index) => ({
              className: foodItems[index],
              probability: prob,
            }))
            .filter(item => item.probability > 0.1) // Set a threshold for detection
            .sort((a, b) => b.probability - a.probability) // Sort by probability
            .map(item => item.className);
  
          if (detectedFood.length > 0) {
            console.log('Detected food:', detectedFood);
            setListFood(prevFood => {
              const newFoods = detectedFood.filter(food => !prevFood.includes(food));
              return [...prevFood, ...newFoods];
            });
            
            detectedFood.forEach(fetchNutritionFacts);
            console.log("detectedFood Loop RUN");
          }
        } catch (error) {
          console.error('Error detecting food:', error);
        }
      }

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/efficientnet/b1/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.log("Load model fail", error)
      }
    }

    loadModel();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      processFoodDetection();
    }, 2000);

    return () => clearInterval(interval);
  }, [isProcessing]);

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

        <div className="absolute inset-0 z-20 pointer-events-none flex justify-center items-center">
          <div className="flex justify-center items-center h-[250px] w-[250px] relative">
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white"></div>
          </div>

          <p className="absolute bottom-[8rem] w-full text-center text-white text-base">Scan food inside the frame</p>
        </div>
      </div>

      {/* List of detected foods */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
        <h2 className="text-lg font-bold">Detected Foods:</h2>
        <ul>
          {listFood.map((food, index) => (
            <li key={index}>{food}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FoodScannerCam;
