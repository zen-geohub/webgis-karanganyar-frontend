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
import { contextData } from "../contexts/DataContext";

ChartJS.register({
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
});

function BarChart({maintainAspectRatio, legendDisplay}) {
  const data = useContext(contextData);

  const barData = {
    Aspirations: data.length,
    Complete: data.filter((item) => item.properties["Kelengkapan"] === "Lengkap").length,
    Incomplete: data.filter((item) => item.properties["Kelengkapan"] === "Tidak Lengkap").length,
    Accurate: data.filter((item) => item.properties["Akurasi Alamat dan Wewenang OPD"] === "Akurat").length,
    Inaccurate: data.filter((item) => item.properties["Akurasi Alamat dan Wewenang OPD"] === "Tidak Akurat").length,
  };

  const barChart = {
    // labels: [...new Set(data.map(item => item.properties["OPD Tujuan Akhir"]))],
    labels: Object.keys(barData),
    datasets: [
      {
        // label: "Jumlah Usulan per OPD",
        // data: [...new Set(data.map(item => item.properties["OPD Tujuan Akhir"]))].map(kategori => {
        //   return data.filter(item => item.properties["OPD Tujuan Akhir"] === kategori).length
        // }),
        data: Object.values(barData),
        backgroundColor: [
          "#de2d26",
          "#31a354",
          "#a1d99b",
          "#e6550d",
          "#fdae6b",
        ],
        borderColor: ["#de2d26", "#31a354", "#a1d99b", "#e6550d", "#fdae6b"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: maintainAspectRatio,
    plugins: {
      legend: {
        display: legendDisplay ? legendDisplay : false,
      },
      title: {
        display: true,
        text: "Aspirations Completeness and Accuracy",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        display: true,
      },
    },
  };
  
  return (
    <Bar options={barOptions} data={barChart} />
  )
}

export default BarChart;