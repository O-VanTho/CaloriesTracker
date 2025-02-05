'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StackedBarChart = ({dataCarb, dataFat, dataProtein}) => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Carb',
        data: dataCarb,
        backgroundColor: 'rgba(118, 200, 71, 0.9)', 
      },
      {
        label: 'Fat',
        data: dataFat,
        backgroundColor: 'rgba(255, 99, 44, 0.9)', 
      },
      {
        label: 'Protein',
        data: dataProtein,
        backgroundColor: 'rgba(0, 166, 255, 0.9)', 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Daily Nutrient Intake',
        font: {
          size: 20,
          family: 'Arial, sans-serif',
          weight: 'bold',
        },
        color: '#333',
      },
    },
    scales: {
      x: {
        stacked: true, 
        grid: {
          display: false, 
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, sans-serif',
          },
        },
      },
      y: {
        stacked: true, 
        grid: {
          color: '#e2e2e2', 
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', padding: '20px', borderRadius: '8px', background: '#f9f9f9', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;
