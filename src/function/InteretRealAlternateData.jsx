import { useState,useEffect} from 'react'

function InteretRealAlternateData(dataRealT,data,rentData,investmentWeekReal,monthInvestmentReal,setInvestmentWeekReal,investmentRef) {
    
    const [interestDataProjAlternate,setInterestDataProjAlternate] = useState([])
    const [realDataAlternate,setRealDataAlternate] = useState([])
    /*Données du graph donnés réel/projeté à partir du premier investissement*/
    useEffect(()=>{
        let yieldRentProj = 0
        let capitalProj = 0
        let capitalReinvestProj = 0
        let cumulatedRentProj = 0
        let rentProj = 0
        let date = ''
        let CumultedRentReal = 0
        let capitalReinvestReal = 0
        let moyenne = 0
        const arrayInterest = []
        let dateGraph
        dateGraph = new Date(dataRealT[0].timeBought)
        const dayGraph = dateGraph.getDay()
        var daysBefore = dayGraph === 0 ? 6:dayGraph - 1
        dateGraph.setDate((dateGraph.getDate()-daysBefore) + 7)
        var today = new Date()
        var todayDay = today.getDay()
        var daysBeforeToday = todayDay === 0 ? 6:todayDay - 1
        today.setDate(today.getDate() - daysBeforeToday)
        if(rentData.length >0)
        {
            
            dataRealT.filter((field)=>field.rentStartDate !== null).forEach(loc=>{
                yieldRentProj += loc.annualPercentageYield
            })
            yieldRentProj = yieldRentProj/dataRealT.filter((field)=>field.rentStartDate !== null).length
            /*Calcul de semaine entre première date d'investissement et le nombre de mois choisi*/
            const lastInterestDate = new Date(dateGraph)
            lastInterestDate.setMonth(lastInterestDate.getMonth()+parseInt(monthInvestmentReal))
            const oneDayInMs = 1000 * 60 * 60 * 24
            const oneWeekInMs = oneDayInMs * 7
            const diffInMs = Math.abs(dateGraph - lastInterestDate)
            const weeks = diffInMs / oneWeekInMs

            const diffInMsMoyenne = Math.abs(dateGraph - today)
            const weeksMoyenne = diffInMsMoyenne / oneWeekInMs
            const arrayGraph = []
            const dateMoyenne = new Date(dateGraph)
            const dateMoyenneBefore = new Date(dateGraph)
            dateMoyenneBefore.setDate(dateMoyenneBefore.getDate()-7)
            for(var k=0;k <parseInt(weeksMoyenne);k++)
            {
                let rentLoop = 0
                let moyenneLoop = 0
                dataRealT.filter((field) => {
                    if (field.rentStartDate !== null) {
                        const date = field.rentStartDate.date
                        const newDate = date.replace(' ', 'T')
                        const rentStartedDate = new Date(newDate)
                        return dateMoyenne >= rentStartedDate.getTime()
                    }
                    return false
                }).forEach(loc => {
                    let rentYear = parseFloat(loc.netRentYearPerToken*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value)
                    if(dateMoyenne >= loc.timeBought)
                    {
                        rentLoop += rentYear / 52
                    }
                })
                dataRealT.filter((field) => {
                    if (field.rentStartDate !== null) {
                        const rentDate = new Date(field.timeBought)
                        return dateMoyenneBefore <= rentDate && dateMoyenne >= rentDate
                    }
                    return false
                }).forEach(loc => {
                    let price = loc.tokenPrice*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
                    moyenneLoop += price - rentLoop
                })
                moyenne += moyenneLoop
                dateMoyenneBefore.setDate(dateMoyenneBefore.getDate()+7)
                dateMoyenne.setDate(dateMoyenne.getDate()+7)
            }
            moyenne /= weeksMoyenne
            if(investmentWeekReal === 0)
            {
                setInvestmentWeekReal(Math.round(moyenne))
                investmentRef.current.defaultValue = Math.round(moyenne)
            }
            for(var j=0;j <parseInt(weeks);j++)
            {
                
                date = `${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
                capitalProj += parseInt(investmentWeekReal) 
                capitalReinvestProj = capitalReinvestProj * (1+(yieldRentProj/100)/52) + parseInt(investmentWeekReal) 
                cumulatedRentProj += rentProj
                rentProj = capitalReinvestProj*(yieldRentProj/100)/52 
                const rentObj =
                {
                    capital:capitalProj,
                    capitalReinvest:capitalReinvestProj,
                    rent:rentProj,
                    cumulatedRent:cumulatedRentProj,
                    date:date
                }
                arrayInterest.push(rentObj)
                let rentLoop = 0
                let capitalLoop = 0
                let yieldLoop = 0
                /*Si la date ne dépasse pas aujourd'hui -> récupération des données réeles*/
                if(dateGraph <= today)
                {
                    dataRealT.filter((field) => {
                        if (field.rentStartDate !== null) 
                        {
                            const rentDate = new Date(field.timeBought)
                            return dateGraph >= rentDate.getTime()
                        }
                        return false
                    }).forEach(loc => {
                        let rentYear = parseFloat((loc.netRentYearPerToken).toFixed(2)*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value)
                        let price = loc.tokenPrice*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
                        rentLoop += rentYear /52
                        capitalLoop += price 
                        yieldLoop += loc.annualPercentageYield
                    })
                    capitalLoop -= rentLoop
                    date = `${dateGraph.getDate().toString().padStart(2,"0")}/${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
                    yieldLoop = yieldLoop/dataRealT.filter((field) => {
                        if (field.rentStartDate !== null) 
                        {
                            const rentDate = new Date(field.timeBought)
                            return dateGraph > rentDate.getTime()
                        }
                        return false
                    }).length
                    CumultedRentReal += rentLoop
                    capitalReinvestReal = capitalLoop + (1+(yieldLoop/100)/52) + rentLoop
                    const rentRealObj =
                    {
                        capital:capitalLoop,
                        capitalReinvest:capitalReinvestReal,
                        rent:rentLoop,
                        cumulatedRent:CumultedRentReal,
                        date:date
                    }
                    arrayGraph.push(rentRealObj) 
                }
                dateGraph.setDate(dateGraph.getDate()+7)
            }
            setInterestDataProjAlternate(arrayInterest)
            setRealDataAlternate(arrayGraph)
        }
    },[dataRealT,data,rentData,investmentWeekReal,monthInvestmentReal,investmentRef,setInvestmentWeekReal])
    return {interestDataProjAlternate,realDataAlternate}
}

export default InteretRealAlternateData