import { useState,useEffect} from 'react'

function InteretComposeAlternate(dataRealT,data,rentData,investmentWeek,monthInvestment) {
    const [interestDataAlternate,setInterestDataAlternate] = useState([])
    /*Données pour le graph intéret composé*/
    useEffect(()=>{
        let yieldRent = 0
        let capital = 0
        let capitalReinvest = 0
        let cumulatedRent = 0
        let rent = 0
        let date = ''
        const arrayInterest = []
        let dateGraph = new Date()
        const dayGraph = dateGraph.getDay()
        var daysBefore
        daysBefore = dayGraph === 0 ? 6:dayGraph - 1
        dateGraph.setDate(dateGraph.getDate()-daysBefore)
        if(rentData.length >0)
        {
            /*Récupération des données actuel*/
            dataRealT.filter((field)=>field.rentStartDate !== null).forEach(loc => {
                let price = loc.tokenPrice*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
                capital += price
            })
            dataRealT.filter((field)=>field.rentStartDate !== null).forEach(loc=>{
                yieldRent += loc.annualPercentageYield
            })
            capital -= parseFloat(rentData[rentData.length-1].rentCumulated)
            yieldRent = yieldRent/dataRealT.filter((field)=>field.rentStartDate !== null).length
            capitalReinvest = capital + parseFloat(rentData[rentData.length-1].rentCumulated)
            rent = capitalReinvest*(yieldRent/100)/52
            cumulatedRent = parseFloat(rentData[rentData.length-1].rentCumulated)
            date = `${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
            const rentObj =
            {
                capital:capital,
                capitalReinvest:capitalReinvest,
                rent:rent,
                cumulatedRent:cumulatedRent,
                date:date
            }
            arrayInterest.push(rentObj)
            /*Calcul du nombre de semaine selon le nombre de mois choisi*/
            const lastInterestDate = new Date(dateGraph)
            lastInterestDate.setMonth(lastInterestDate.getMonth()+parseInt(monthInvestment))
            const oneDayInMs = 1000 * 60 * 60 * 24
            const oneWeekInMs = oneDayInMs * 7
            const diffInMs = Math.abs(dateGraph - lastInterestDate)
            const weeks = diffInMs / oneWeekInMs
            /*projection sur chaque semaine des données*/
            for(var j=0;j <parseInt(weeks);j++)
            {
                dateGraph.setDate(dateGraph.getDate()+7)
                date = `${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
                capital += parseInt(investmentWeek) 
                capitalReinvest = capitalReinvest * (1+(yieldRent/100)/52) + parseInt(investmentWeek) 
                cumulatedRent += rent
                rent = capitalReinvest*(yieldRent/100)/52 
                const rentObj =
                {
                    capital:capital,
                    capitalReinvest:capitalReinvest,
                    rent:rent,
                    cumulatedRent:cumulatedRent,
                    date:date
                }
                arrayInterest.push(rentObj)  
            }
            setInterestDataAlternate(arrayInterest)
        }
    },[dataRealT,data,rentData,investmentWeek,monthInvestment])
    return {interestDataAlternate}
}

export default InteretComposeAlternate