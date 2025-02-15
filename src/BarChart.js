import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DummyBarChart = () => {
  // Define data for the bar chart
  const data = {
    labels: ["Category 1", "Category 2", "Category 3"],
    datasets: [
      {
        label: "Values",
        data: [50, 75, 100], // Example values
        backgroundColor: ["#4CAF50", "#2196F3", "#FF5722"],
        borderColor: ["#388E3C", "#1976D2", "#E64A19"],
        borderWidth: 1,
      },
    ],
  };

  // Define options for the bar chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Dummy Bar Chart",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DummyBarChart;

