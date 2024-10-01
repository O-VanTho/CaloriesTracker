import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaArrowLeft } from 'react-icons/fa';

const FoodScannerCam = ({onClose}) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFlash, setIsFlash] = useState(false); // Flash state

  const videoConstraints = {
    width: 720,
    height: 1280,
    facingMode: 'environment', // Use the back camera on mobile
  };

  const capture = useCallback(() => {
    // Flash effect before taking the photo
    setIsFlash(true);
    
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsFlash(false); // Remove flash after capture
    }, 300); // 300ms delay to simulate flash and delay
  }, [webcamRef]);

  return (
    <div className="relative h-screen bg-gray-900">
      {/* Flash Effect */}
      {isFlash && (
        <div className="absolute inset-0 bg-white opacity-80 transition-opacity duration-300 z-50"></div>
      )}

      {/* Back Button */}
      {!capturedImage && (
        <button
          onClick={onClose} // Call the onClose handler to go back
          className="absolute top-6 left-4 text-white text-2xl bg-gray-800 p-3 rounded-full z-50"
        >
          <FaArrowLeft />
        </button>
      )}
      

      {/* If an image is captured, show it */}
      {capturedImage ? (
        <div className="relative h-full flex flex-col justify-center items-center">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setCapturedImage(null)}
            className="absolute top-6 left-4 text-white text-2xl bg-gray-800 p-2 rounded-full"
          >
            <FaArrowLeft />
          </button>
        </div>
      ) : (
        <div className="relative h-full">
          {/* Webcam Component */}
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

            <p className="absolute bottom-[8rem] w-full text-center text-white text-base">Capture meal inside frame</p>
          </div>


          {/* Capture Button */}
          <div className="absolute bottom-10 w-full flex justify-center items-center">
            <button
              onClick={capture}
              className="bg-white p-1 rounded-full shadow-lg flex justify-center items-center"
            >
              <div className='bg-[#77c847] rounded-full w-[50px] h-[50px] hover:w-[40px] hover:h-[40px] p-[5px]'>

              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodScannerCam;
