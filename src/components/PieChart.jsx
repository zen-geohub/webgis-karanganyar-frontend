import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext } from "react";
import { contextData } from "../contexts/DataContext";

ChartJS.register({
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
})

function PieChart({maintainAspectRatio, legendPosition, legendAlign}) {
  const data = useContext(contextData);

  const pieData = {
    "Complete, Accurate, Priority 1": data.filter((item) => item.properties["Prioritas"] === "Wajib Dasar").length,
    "Complete, Accurate, Priority 2": data.filter((item) => item.properties["Prioritas"] === "Wajib Tidak Dasar").length,
    "Complete, Accurate, Not Priority": data.filter((item) => item.properties["Prioritas"] === "Tidak Wajib dan Tidak Dasar").length,
    "Complete and Inaccurate": data.filter((item) => item.properties["Prioritas"] === "Tidak Akurat dan Bukan Prioritas").length,
    "Incomplete": data.filter((item) => item.properties["Prioritas"] === "Tidak Lengkap, Tidak Akurat, dan Bukan Prioritas").length,
  };

  const pieChart = {
    labels: Object.keys(pieData),
    datasets: [
      {
        data: Object.values(pieData),
        backgroundColor: [
          "#08519c",
          "#3182bd",
          "#6baed6",
          "#bdd7e7",
          "#eff3ff",
        ],
      },
    ],
  };

  const pieOptios = {
    maintainAspectRatio: maintainAspectRatio,
    plugins: {
      legend: { 
        position: legendPosition ? legendPosition : "right", 
        align: legendAlign ? legendAlign : "center",
      },
      title: { display: true, text: "Aspirations Quality" },
    },
  };

  return (
    <Pie options={pieOptios} data={pieChart}/>
  )
}

export default PieChart;