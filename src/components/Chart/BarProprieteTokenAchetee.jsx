import React from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Configuration de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
function BarProprieteTokenAchetee({ datachart }) {
	const data = {
		labels: datachart.map((field) => {
			const date = new Date(field.date)
			const month = String(date.getMonth() + 1).padStart(2, "0") // Mois (01 à 12)
			const year = date.getFullYear() // Année
			return `${month}/${year}`
		}),
		datasets: [
			{
				label: "Propriétés Vendu par RealT",
				data: datachart.map((field) => field.value),
				backgroundColor: "rgba(75, 192, 192, 1)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
			{
				label: "Propriétés achetées",
				data: datachart.map((field) => field.amount),
				backgroundColor: "rgba(153, 102, 255, 1)",
				borderColor: "rgba(153, 102, 255, 1))",
				borderWidth: 1,
			},
		],
	}
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		layout: {
			padding: {
				top: 30,
			},
		},
		plugins: {
			legend: {
				position: "bottom",
				display: true,
				labels: {
					color: "#FFFFFF",
				},
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
				formatter: (value) => `${value}`,
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

export default BarProprieteTokenAchetee
