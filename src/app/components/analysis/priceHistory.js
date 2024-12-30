import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function HistoryGraph() {

    const data = {
        labels: ["2/11", "2/12", "2/13", "2/14", "2/15"],
        datasets: [
            {
                label: "Price History",
                data: [400, 500, 1000, 400, 750],
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;

                    if (!chartArea) {
                        // Return a default color while the chart is initializing
                        return "rgba(207,206,247,0.5)";
                    }

                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, "rgba(96,93,235,1)"); // Top color
                    gradient.addColorStop(1, "rgba(207,206,247,0)"); // Bottom color
                    return gradient;
                },
                borderColor: "#605deb",
                pointBorderWidth: 0,
                pointRadius: 0,
                tension: 0.4, // Smooth curves
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
        },
        layout: {
            padding: { bottom: 0 },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 1000, // Set the max value for y-axis
                min: 250,
                ticks: {
                    color: "#7b8caf",
                    font: {
                        size: 12,
                    },
                    stepSize: 250, // Set the step size for the vertical axis
                    callback: function (value) {
                        return `$${value}`; // Add $ sign to y-axis labels
                    },
                },
                grid: {
                    color: "#E9E8FC", // Set horizontal grid lines to gray
                },
            },
            x: {
                ticks: {
                    color: "#FFFF",
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: "transparent", // Disable vertical grid lines
                },
            },
        },
    };

    return <Line width={400} height={192} data={data} options={options} />;
}

export default HistoryGraph;
