// PieChart.js
import React from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

function PieChart({ datachart, dataLength }) {
	const data = {
		labels: datachart
			.sort((a, b) => b.quantity - a.quantity)
			.map((data) => (data.type === null ? (data.type = "Non Défini") : data.type)),
		datasets: [
			{
				label: "",
				data: datachart.sort((a, b) => b.quantity - a.quantity).map((data) => data.quantity),
				backgroundColor: [
					"#3A6D8C",
					"#590995",
					"#331D2C",
					"#03C4A1",
					"#EB3678",
					"#FB773C",
					"#6B8A7A",
					"#FFEB00",
					"#FF8A8A",
					"#00712D",
					"#F5004F",
					"#6C0345",
					"#FFDD95",
					"#0F2C67",
					"#C147E9",
					"#93ABD3",
					"#EAAC7F",
					"#6F5A7E",
					"#674636",
				],
				borderColor: [
					"#3A6D8C",
					"#590995",
					"#331D2C",
					"#03C4A1",
					"#EB3678",
					"#FB773C",
					"#6B8A7A",
					"#FFEB00",
					"#FF8A8A",
					"#00712D",
					"#F5004F",
					"#6C0345",
					"#FFDD95",
					"#0F2C67",
					"#C147E9",
					"#93ABD3",
					"#EAAC7F",
					"#6F5A7E",
					"#674636",
				],
				borderWidth: 1,
			},
		],
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			tooltip: {
				callbacks: {
					title: () => "",
					label: function (tooltipItem) {
						const label = tooltipItem.label
						const value = tooltipItem.raw

						return [`${label} : ${value} (${((value / dataLength) * 100).toFixed(0)} %)`]
					},
				},
				usePointStyle: true,
			},
			legend: {
				position: "right",
				labels: {
					boxWidth: 15,
					padding: 10,
					color: "#fff",
					font: {
						size: 16,
						weight: "bold",
					},
				},
			},
			datalabels: {
				color: "white",
				anchor: "center",
				align: "end",
				font: {
					size: 16,
					weight: "bold",
				},
				formatter: (value) => {
					if (value >= 5) {
						return `${((value / dataLength) * 100).toFixed(0)} %`
					} else {
						return ""
					}
				},
			},
		},
	}
	return <Pie data={data} options={options} />
}

export default PieChart
