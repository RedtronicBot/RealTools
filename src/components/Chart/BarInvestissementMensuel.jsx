import React from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Configuration de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function BarInvestissementMensuel({ datachart }) {
	const data = {
		labels: datachart.map((field) => field.date),
		datasets: [
			{
				label: "",
				data: datachart.map((field) => field.invest),
				backgroundColor: "rgba(75, 192, 192, 1)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	}
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				display: false,
			},
			title: {
				display: false,
				text: "",
			},
			datalabels: {
				anchor: "end",
				align: "top",
				color: "#FFFFFF",
				font: {
					size: 14,
					weight: "bold",
				},
				formatter: (value) => `${value} €`,
			},
		},
		scales: {
			x: {
				grid: {
					color: "rgba(255, 255, 255, 0.5)",
				},
				ticks: {
					color: "#FFFFFF",
				},
			},
			y: {
				grid: {
					color: "rgba(255, 255, 255, 0.5)",
				},
				ticks: {
					color: "#FFFFFF",
				},
			},
		},
	}

	return <Bar data={data} options={options} />
}

export default BarInvestissementMensuel
