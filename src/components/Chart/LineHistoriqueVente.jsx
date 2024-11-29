import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend)

function LineHistoriqueVente({datachart}){
    const partialLabels = datachart.map(field => {
        let annee = field.date.substring(6, 10)
        let mois = field.date.substring(3, 5)

        return `${mois}/${annee}`
    })
    const data = {
        labels: partialLabels, 
        datasets: [
            {
                label: 'Tokens restants',
                data: datachart.map(field=>field.value),
                borderColor: '#E85C0D', 
                backgroundColor: '#E85C0D',
                yAxisID: 'y1',
                pointStyle: 'circle',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: '#E85C0D',
                pointBorderColor: '#E85C0D',
            }
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
                        label += context.parsed.y.toFixed(2)
                    }
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
                        const step = Math.floor(totalLabels / 12) 
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
                    text: 'Historique des ventes',
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
            }
        }
    }

  return <Line data={data} options={options} />
}

export default LineHistoriqueVente
