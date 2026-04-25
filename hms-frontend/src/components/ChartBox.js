import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import API from "../api";
import { Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function ChartBox() {

    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        API.get("dashboard/")
        .then(res => {
            setChartData(res.data.charts.appointments_last_7_days);
        });
    }, []);

    if (!chartData) return <p>Loading chart...</p>;

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Appointments",
                data: chartData.data,
                borderColor: "blue",
                tension: 0.4
            }
        ]
    };

    return (
        <div className="card p-3 mt-3">
            <h5>Appointments Analytics</h5>
            <Line data={data} />
        </div>
    );
}

export default ChartBox;