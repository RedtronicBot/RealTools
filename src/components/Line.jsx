import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend)

function LineChart({datachart}){
    const data = {
        labels: datachart.map(field=>field.date), 
        datasets: [
            {
                label: 'Loyers Cumulés',
                data: datachart.map(field=>field.rentCumulated),
                borderColor: 'rgba(75, 192, 192, 1)', 
                backgroundColor: 'rgba(75, 192, 192, 1)',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Loyers',
                data: datachart.map(field=>field.rent), 
                borderColor: 'rgba(153, 102, 255, 1)', 
                backgroundColor: 'rgba(153, 102, 255, 1)', 
                yAxisID: 'y2',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                pointBorderColor: 'rgba(153, 102, 255, 1)',
            }
        ]
    }

  const options = {
    tension:0.2,
    responsive: true,
    plugins: {
        tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
            label: function (context) {
                let label = context.dataset.label || ''

                if (label) 
                {
                    label += ': '
                }
                if (context.parsed.y !== null) 
                {
                    label += context.parsed.y.toFixed(2)
                }
                label += ' $'
                return label
            },
            labelColor: function(context) 
            {
                return {
                    backgroundColor: context.dataset.borderColor,
                    borderRadius: 5,
                }
            }
            }
        },
        legend: 
        {
            display: true,
            position:'top',
            labels: {
                boxWidth: 15,
                padding: 10,
                color: '#fff',
                font: 
                {
                    size: 16, 
                    weight: 'bold',
                }
            }
        },
        datalabels: {
            display: false,
        }
    },
    interaction: {
        mode: 'index',
        intersect: false,
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false
            },
            ticks: {
                callback: function (value, index) {
                    return index % 3 === 0 ? this.getLabelForValue(value) : ''
                },
                color: 'white'
            },
            border: {
                color: 'white'
            }
        },
        y1: {
            type: 'linear',
            position: 'left',
            title: {
                display: true,
                text: 'Loyers Cumulée',
                color: 'white'
            },
            grid: {
                drawOnChartArea: false
            },
            ticks: {
                color:'white',
                stepSize: 10,
                beginAtZero: true
            },
            border: {
                color: 'white'
            }
        },
        y2: {
            type: 'linear',
            position: 'right',
            title: {
                display: true,
                text: 'Loyers',
                color: 'white'
            },
            grid: {
                drawOnChartArea: false
            },
            ticks: {
                color:'white',
                stepSize: 1,
                beginAtZero: true
            },
            border: {
                color: 'white'
            }
        }
      }
    }

  return <Line data={data} options={options} />
}

export default LineChart
