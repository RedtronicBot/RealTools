import { useEffect,useState } from 'react'
function LoyerCumules(data,dataRealT) {
    function formatNumber(number, decimals) 
	{
		if (Number.isInteger(number)) 
		{
			return number.toString()
		} 
		else 
		{
			return number.toFixed(decimals)
		}
	}
    const [rentData,setRentData] =useState([])
    /*Découpage selon les semaine du loyer perçu*/
    useEffect(()=>{
        var firstdate = new Date(dataRealT[0].timeBought)
        var dayOfWeek = firstdate.getDay()
        var today = new Date()
        var todayDay = today.getDay()
        var daysUntilNext = dayOfWeek === 1 ? 7:(8 - dayOfWeek) % 7
        var daysBefore = todayDay === 0 ? 6:todayDay - 1
        /*vérification du jour et décalage au lundi suivant(précédant pour daysbefore)*/
        firstdate.setDate(firstdate.getDate()+ daysUntilNext)
        today.setDate(today.getDate() - daysBefore)
        const oneDayInMs = 1000 * 60 * 60 * 24
        const oneWeekInMs = oneDayInMs * 7
        const diffInMs = Math.abs(today - firstdate)
        const weeks = diffInMs / oneWeekInMs
        const arrayGraph = []
        var rentCumulated = 0
        /*Récupération des loyer de chaque semaine + cumul des loyers*/
        for(var i = 0; i < weeks; i++)
        {
            let rentGraph = 0
            dataRealT.filter((field) => {
                if (field.rentStartDate !== null) {
                    const rentDate = new Date(field.timeBought)
                    const date = field.rentStartDate.date
                    const newDate = date.replace(' ', 'T')
                    const rentStartedDate = new Date(newDate)
                    return firstdate >= rentDate.getTime() && firstdate >= rentStartedDate.getTime()
                }
                return false
            }).forEach(loc => {
                let rentYear = parseFloat((loc.netRentYearPerToken).toFixed(2)*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value)
                rentGraph += rentYear /52
            })
            rentCumulated += rentGraph
            const rentGraphObj = 
            {
                rent:formatNumber(rentGraph,2),
                rentCumulated:formatNumber(rentCumulated,2),
                date:`${(firstdate.getMonth()+1).toString().padStart(2,"0")}/${firstdate.getFullYear()}`
            }
            arrayGraph.push(rentGraphObj)
            firstdate.setDate(firstdate.getDate() + 7)
        }
        setRentData(arrayGraph)
    },[dataRealT,data])
    return {rentData}
}
export default LoyerCumules