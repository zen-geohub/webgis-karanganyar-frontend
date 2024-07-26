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

ChartJS.register({
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
});

function Gradient({ legendType }) {
  const accuracy = {
    labels: ["Data"],
    datasets: [
      {
        label: "Accuracy",
        data: [1],
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "#3182bd"),
            gradient.addColorStop(0.5, "#9ecae1"),
            gradient.addColorStop(1, "#deebf7");
          return gradient;
        },
      },
    ],
  };

  const priority = {
    labels: ["Data"],
    datasets: [
      {
        label: "Quality",
        data: [1],
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "#d95f0e"),
            gradient.addColorStop(0.5, "#fec44f"),
            gradient.addColorStop(1, "#fff7bc");
          return gradient;
        },
      },
    ],
  };

  const barOptions = {
    maintainAspectRatio: false,
    events: [],
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        stacked: true,
        ticks: {
          format: {
            style: "percent",
          },
        },
      },
    },
  };

  return (
    <Bar
      options={barOptions}
      data={legendType === "priority" ? priority : accuracy}
    />
  );
}

export default Gradient;
