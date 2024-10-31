import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend)

function InteretComposeReel({datachart,datareal,dataloyer}){
    const partialLabels = datachart.map(field => {
        let annee = field.date.substring(6, 10)
        let mois = field.date.substring(3, 5)

        return `${mois}/${annee}`
    })
    const data = {
        labels: partialLabels, 
        datasets: [
            {
                label: 'Capital Réinvesti',
                data: datachart.map(field=>field.capitalReinvest), 
                borderDash: [5, 5],
                borderColor: 'rgba(251, 119, 60, .7)', 
                backgroundColor: 'rgba(251, 119, 60, .7)', 
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(251, 119, 60, .7)',
                pointBorderColor: 'rgba(251, 119, 60, .7)',
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
                label: 'Capital',
                data: datachart.map(field=>field.capital),
                borderDash: [5, 5],
                borderColor: 'rgba(0, 113, 45, .7)', 
                backgroundColor: 'rgba(0, 113, 45, .7)',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(0, 113, 45, .7)',
                pointBorderColor: 'rgba(0, 113, 45, .7)',
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
                label: 'Loyers Cumulés',
                data: datachart.map(field=>field.cumulatedRent),
                borderDash: [5, 5],
                borderColor: 'rgba(75, 192, 192, .7)', 
                backgroundColor: 'rgba(75, 192, 192, .7)',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(75, 192, 192, .7)',
                pointBorderColor: 'rgba(75, 192, 192, .7)',
            },
            {
                label: 'Loyers Cumulés Réel',
                data: dataloyer.map(field=>field.rentCumulated),
                borderColor: '#EAAC7F', 
                backgroundColor: '#EAAC7F',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#EAAC7F',
                pointBorderColor: '#EAAC7F',
            },
            {
                label: 'Loyers',
                data: datachart.map(field=>field.rent),
                borderDash: [5, 5], 
                borderColor: 'rgba(153, 102, 255, .7)', 
                backgroundColor: 'rgba(153, 102, 255, .7)', 
                yAxisID: 'y2',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: 'rgba(153, 102, 255, .7)',
                pointBorderColor: 'rgba(153, 102, 255, .7)',
            },
            {
                label: 'Loyers Réel',
                data: dataloyer.map(field=>field.rent), 
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
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
            title: function (context) {
                let index = context[0].dataIndex
                return datachart[index].date
            },
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
            position:'bottom',
            align:'start',
            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 5,
                boxHeight: 5,
                padding: 15,
                color: '#fff',
                font: 
                {
                    size: 12, 
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
