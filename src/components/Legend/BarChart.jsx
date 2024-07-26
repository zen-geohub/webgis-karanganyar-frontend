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
import { useContext } from "react";
import { contextData } from "../../contexts/DataContext";

ChartJS.register({
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
});

function BarChart() {
  const data = useContext(contextData);

  const barData = {
    Complete: data.filter((item) => item.properties["Kelengkapan"] === "Lengkap").length,
    Incomplete: data.filter((item) => item.properties["Kelengkapan"] === "Tidak Lengkap").length,
  };

  const barChart = {
    labels: ['Completeness'],
    datasets: [
      {
        label: 'Incomplete',
        data: [barData["Incomplete"]],
        backgroundColor: "#a1d99b"
      },
      {
        label: 'Complete',
        data: [barData["Complete"]],
        backgroundColor: "#31a354"
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 16,
        }
      },
      title: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        stacked: true
      },
      x: {
        display: false,
        stacked: true
      },
    },
  };
  
  return (
    <Bar options={barOptions} data={barChart} />
  )
}

export default BarChart;