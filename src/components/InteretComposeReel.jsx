import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend)

function InteretComposeReel({datachart,datareal}){
    const data = {
        labels: datachart.map(field=>field.date), 
        datasets: [
            {
                label: 'Capital Réinvesti',
                data: datachart.map(field=>field.capitalReinvest), 
                borderColor: '#FB773C', 
                backgroundColor: '#FB773C', 
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#FB773C',
                pointBorderColor: '#FB773C',
            },
            {
                label: 'Capital',
                data: datachart.map(field=>field.capital),
                borderColor: '#00712D', 
                backgroundColor: '#00712D',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#00712D',
                pointBorderColor: '#00712D',
            },
            {
                label: 'Loyers Cumulés',
                data: datachart.map(field=>field.cumulatedRent),
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
            },
            {
                label: 'Capital Réinvesti Réel',
                data: datareal.map(field=>field.capitalReinvest), 
                borderColor: '#FFEB00', 
                backgroundColor: '#FFEB00', 
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#FFEB00',
                pointBorderColor: '#FFEB00',
            },
            {
                label: 'Capital Réel',
                data: datareal.map(field=>field.capital),
                borderColor: '#FF8A8A', 
                backgroundColor: '#FF8A8A',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#FF8A8A',
                pointBorderColor: '#FF8A8A',
            },
            {
                label: 'Loyers Cumulés Réel',
                data: datareal.map(field=>field.cumulatedRent),
                borderColor: '#0F2C67', 
                backgroundColor: '#0F2C67',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#0F2C67',
                pointBorderColor: '#0F2C67',
            },
            {
                label: 'Loyers Réel',
                data: datareal.map(field=>field.rent), 
                borderColor: '#F5004F', 
                backgroundColor: '#F5004F', 
                yAxisID: 'y2',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#F5004F',
                pointBorderColor: '#F5004F',
            },
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
                    label += context.parsed.y.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                boxWidth: 10,
                padding: 10,
                color: '#fff',
                font: 
                {
                    size: 14, 
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
                callback: function (value, index, values) 
                {
                    const totalLabels = values.length  
                    const step = Math.ceil(totalLabels / 10) 
                    if (index % step === 0) 
                    {
                        return this.getLabelForValue(value)
                    }
                    return ''
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
                text: 'Capital Réinvesti',
                color: 'white'
            },
            grid: {
                drawOnChartArea: false
            },
            ticks: {
                color:'white',
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
                stepSize: 5,
            },
            border: {
                color: 'white'
            }
        }
      }
    }

  return <Line data={data} options={options} />
}

export default InteretComposeReel
