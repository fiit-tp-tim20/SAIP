import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Line } from 'react-chartjs-2';

type data = {
    data: number[];
}



const LineGraph = ({ data }: data) => {
    console.log(data);
    const chartData = {
      labels: Array.from({ length: data.length }, (_, i) => i + 1),
      datasets: [
        {
          label: 'Data',
          data,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1
        }
      ]
    };
    
    const chartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Data Point'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Value'
          },
          suggestedMin: 0
        }
      }
    };
  
    return (
      <Line data={chartData} options={chartOptions} />
    );
  };
  
  export default LineGraph;