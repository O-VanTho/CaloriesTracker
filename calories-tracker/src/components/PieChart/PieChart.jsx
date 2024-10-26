'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({dataSet}) => {
  const total_calories = dataSet.reduce((acc, currentValue) => acc + currentValue, 0);
  
  const data = {
    labels: ['Carbs', 'Fat', 'Protein'],
    datasets: [
      {

        data: dataSet, //Data here
        backgroundColor: [
          'rgba(118, 200, 71, 0.9)', 
          'rgba(255, 99, 44, 0.9)', 
          'rgba(0, 166, 255, 0.9)',  
        ],
        borderColor: [
          'rgba(118, 200, 71, 1)',
          'rgba(255, 99, 44, 1)',
          'rgba(0, 166, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 14,  // Make the legend text larger
            weight: 'bold',  // Bold legend text for modern look
          },
          boxWidth: 20, 
        },
      },
      tooltip: {
        enabled: true,
        titleFont: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div style={{ padding: '5px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: 'black' }}>
        Today Macros
      </h3>
      <p className='text-black text-center mb-3'>{total_calories} calo</p>
      <div className='' style={{ width: '100%', height: '200px'}}> {/* Chart size */}
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
