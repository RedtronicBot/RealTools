import React from "react"
import { Line } from "react-chartjs-2"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js"

const verticalLinePlugin = {
	id: "verticalLine",
	afterDatasetsDraw(chart, args, options) {
		const {
			ctx,
			chartArea: { top, bottom },
			scales,
		} = chart
		const xScale = scales.x
		const buyIndex = options.buyIndex
		if (buyIndex !== -1 && xScale) {
			const xPosition = xScale.getPixelForValue(buyIndex)
			ctx.save()
			ctx.beginPath()
			ctx.setLineDash([5, 5])
			ctx.moveTo(xPosition, top)
			ctx.lineTo(xPosition, bottom)
			ctx.lineWidth = 2
			ctx.strokeStyle = "rgba(255, 99, 132, 1)"
			ctx.stroke()
			ctx.setLineDash([])
			ctx.restore()
		}
	},
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, verticalLinePlugin)

function LineChartRoi({ datachart }) {
	const buyIndex = datachart.findIndex((item) => item.buy)
	const partialLabels = datachart.map((field) => {
		let annee = field.date.substring(6, 10)
		let mois = field.date.substring(3, 5)

		return `${mois}/${annee}`
	})
	const data = {
		labels: partialLabels,
		datasets: [
			{
				label: "Performance",
				data: datachart.map((field) => field.roi),
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 1)",
				yAxisID: "y1",
				pointStyle: "circle",
				pointRadius: 0,
				pointHoverRadius: 5,
				pointBackgroundColor: "rgba(75, 192, 192, 1)",
				pointBorderColor: "rgba(75, 192, 192, 1)",
			},
		],
	}

	const options = {
		tension: 0.2,
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			verticalLine: {
				buyIndex: buyIndex,
			},
			tooltip: {
				mode: "index",
				intersect: false,
				callbacks: {
					title: function (context) {
						let index = context[0].dataIndex
						return datachart[index].date
					},
					label: function (context) {
						let label = context.dataset.label || ""

						if (label) {
							label += ": "
						}
						if (context.parsed.y !== null) {
							label += context.parsed.y.toFixed(2)
						}
						label += " $"
						return label
					},
					labelColor: function (context) {
						return {
							backgroundColor: context.dataset.borderColor,
							borderRadius: 5,
						}
					},
				},
			},
			legend: {
				display: true,
				position: "bottom",
				align: "start",
				labels: {
					usePointStyle: true,
					pointStyle: "circle",
					boxWidth: 5,
					boxHeight: 5,
					padding: 15,
					color: "#fff",
					font: {
						size: 12,
						weight: "bold",
					},
					generateLabels: function (chart) {
						const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart)
						if (buyIndex !== -1) {
							originalLabels.push({
								text: "Date d'achat",
								fillStyle: "rgba(255, 99, 132, 1)",
								hidden: false,
								lineWidth: 1,
								strokeStyle: "rgba(255, 99, 132, 1)",
								pointStyle: "rect",
								datasetIndex: -1,
							})
						}
						return originalLabels
					},
				},
			},
			datalabels: {
				display: false,
			},
		},
		interaction: {
			mode: "index",
			intersect: false,
		},
		scales: {
			x: {
				display: true,
				grid: {
					display: false,
				},
				ticks: {
					callback: function (value, index, values) {
						const totalLabels = values.length
						const maxTicks = 10
						const step = Math.max(1, Math.floor(totalLabels / maxTicks))

						if (index % step === 0 || index === totalLabels - 1) {
							return this.getLabelForValue(value)
						}
						return ""
					},
					color: "white",
				},
				border: {
					color: "white",
				},
			},
			y1: {
				type: "linear",
				position: "left",
				title: {
					display: true,
					text: "Performance",
					color: "white",
				},
				grid: {
					drawOnChartArea: false,
				},
				ticks: {
					color: "white",
					stepSize: 10,
					beginAtZero: true,
				},
				border: {
					color: "white",
				},
			},
		},
	}

	return <Line data={data} options={options} />
}

export default LineChartRoi
