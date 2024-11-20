import { useEffect,useState } from 'react'
function LocationData(historyData,data,dataRealT,contract) {
    const [token,setToken] = useState([])
    const [rent,setRent] = useState([])
    const [yieldData,setYield] = useState([])
    const [yieldInitial,setYieldInitial] = useState([])
    const [roi,setRoi] = useState([])
    const [value,setValue] = useState([])
    useEffect(()=>{
        var historyState = historyData.find(obj => obj.uuid.toLowerCase() === contract)
        var dataRealtTFilter = dataRealT.find(loc => loc.gnosisContract.toLowerCase() === contract)
        if(historyState !== undefined) {
            const arrayToken = []
            const arrayHistoryRent = []
            const arrayRent = []
            const arrayYield = []
            const arrayValue = []
            let closestIndex = - 1
            let closestDate = null
            const targetDate = new Date(dataRealtTFilter.timeBought)
            historyState.history.forEach((field,index) => {
                const dateFirst = field.date
                let annee = parseInt(dateFirst.substring(0, 4))
                let mois = parseInt(dateFirst.substring(4, 6)) - 1
                let jour = parseInt(dateFirst.substring(6, 8))
                const currentDate = new Date(annee, mois, jour)
                if (currentDate <= targetDate) {
                    const diff = Math.abs(currentDate - targetDate)

                    if (!closestDate || diff < Math.abs(closestDate - targetDate)) {
                        closestDate = currentDate
                        closestIndex = index
                    }
                }
            })
            const dateObject = new Date(dataRealtTFilter.timeBought)
            const YieldObjFirst = {
                yield:parseFloat(((historyState.history[closestIndex].values.netRentYear/historyState.history[0].values.totalInvestment)*100).toFixed(2)),
                date:`${dateObject.getDate().toString().padStart(2,"0")}/${(dateObject.getMonth()+1).toString().padStart(2,"0")}/${dateObject.getFullYear()}`
            }
            arrayYield.push(YieldObjFirst)
            const arrayInitial = []
            const YieldObjInitial = {
                yield:parseFloat(((historyState.history[0].values.netRentYear/historyState.history[0].values.totalInvestment)*100).toFixed(2)),
            }
            arrayInitial.push(YieldObjInitial)
            setYieldInitial(arrayInitial)
            for(var i = 0; i < historyState.history.length;i++) {
                /*Récupération du prix du token*/
                if(historyState.history[i].values.tokenPrice !== undefined) {
                    const dateBought = new Date(dataRealtTFilter.timeBought)
                    const dayOfWeek = dateBought.getDay()
                    const daysUntilMonday = (dayOfWeek === 0) ? 1 : (8 - dayOfWeek) % 7
                    dateBought.setDate(dateBought.getDate()+daysUntilMonday)
                    const TokenObj = {
                        tokenPrice:historyState.history[i].values.tokenPrice,
                        date:`${dateObject.getDate().toString().padStart(2,"0")}/${(dateObject.getMonth()+1).toString().padStart(2,"0")}/${dateObject.getFullYear()}`
                    }
                    const ValueObj = {
                        tokenPrice:historyState.history[i].values.tokenPrice*(data.filter((field) => field.token === contract)[0]?.value),
                        date:`${dateObject.getDate().toString().padStart(2,"0")}/${(dateObject.getMonth()+1).toString().padStart(2,"0")}/${dateObject.getFullYear()}`
                    }
                    arrayToken.push(TokenObj)
                    arrayValue.push(ValueObj)
                }
                /*Récupération de l'historique du loyer la location*/
                if(historyState.history[i].values.netRentYear !== undefined) {
                    const date = historyState.history[i].date
                    const dateBought = new Date(dataRealtTFilter.timeBought)
                    const dayOfWeek = dateBought.getDay()
                    const daysUntilMonday = (dayOfWeek === 0) ? 1 : (8 - dayOfWeek) % 7
                    dateBought.setDate(dateBought.getDate()+daysUntilMonday)
                    let annee = parseInt(date.substring(0, 4))
                    let mois = parseInt(date.substring(4, 6)) - 1
                    let jour = parseInt(date.substring(6, 8))
                    const dateObject = new Date(annee, mois, jour)
                    const RentObj = {
                        rent:((parseFloat(historyState.history[i].values.netRentYear)/parseInt(dataRealtTFilter.totalTokens))/52).toFixed(2),
                        date:dateObject
                    }
                    arrayHistoryRent.push(RentObj)
                    if(dateObject >= dateBought) {
                        const YieldObj = {
                            yield:parseFloat(((historyState.history[i].values.netRentYear/historyState.history[0].values.totalInvestment)*100).toFixed(2)),
                            date:`${dateObject.getDate().toString().padStart(2,"0")}/${(dateObject.getMonth()+1).toString().padStart(2,"0")}/${dateObject.getFullYear()}`
                        }
                        arrayYield.push(YieldObj)
                    }
                    
                }
                    
            }
            if(arrayYield.length === 0) {
                const dateBought = new Date(dataRealtTFilter.timeBought)
                const YieldObj = {
                    yield:parseFloat(((historyState.history[0].values.netRentYear/historyState.history[0].values.totalInvestment)*100).toFixed(2)),
                    date:`${dateBought.getDate().toString().padStart(2,"0")}/${(dateBought.getMonth()+1).toString().padStart(2,"0")}/${dateBought.getFullYear()}`
                }
                arrayYield.push(YieldObj)    
            }
            /*Calcul de la rent depuis la date d'achat*/
            const date = new Date(dataRealtTFilter.timeBought)
            const rentObj = {
                rent:0,
                date:`${date.getDate().toString().padStart(2,"0")}/${(date.getMonth()+1).toString().padStart(2,"0")}/${date.getFullYear()}`
            }
            arrayRent.push(rentObj)
            const dayOfWeek = date.getDay()
            const daysUntilMonday = (dayOfWeek === 0) ? 1 : (8 - dayOfWeek) % 7
            date.setDate(date.getDate()+daysUntilMonday)
            const today = new Date()
            const todayDay = today.getDay()
            const daysBeforeToday = todayDay === 0 ? 6:todayDay - 1
            today.setDate(today.getDate() - daysBeforeToday)
            const oneDayInMs = 1000 * 60 * 60 * 24
            const oneWeekInMs = oneDayInMs * 7
            const diffInMs = Math.abs(date - today)
            const weeks = diffInMs / oneWeekInMs
            let index = 0
            let rent = 0
            let roi = 0
            const arrayRoi = []
            const dateObjectRentCopy = new Date(date)
            dateObjectRentCopy.setDate(dateObjectRentCopy.getDate()-7)
            for(var j = 0; j <= Math.round(weeks);j++) {
                dateObjectRentCopy.setDate(dateObjectRentCopy.getDate()+7)
                for (let k = 0; k < arrayHistoryRent.length; k++) {
                    if (dateObjectRentCopy >= arrayHistoryRent[k].date) {
                        index = k
                    } else {
                        break
                    }
                }
                rent += parseFloat(arrayHistoryRent[index].rent)*(data.filter((field) => field.token === contract)[0]?.value)
                roi = ((rent/(arrayToken[0].tokenPrice*(data.filter((field) => field.token === contract)[0]?.value)))*100).toFixed(2)
                const rentObj = {
                    rent:parseFloat(rent).toFixed(2),
                    date:`${dateObjectRentCopy.getDate().toString().padStart(2,"0")}/${(dateObjectRentCopy.getMonth()+1).toString().padStart(2,"0")}/${dateObjectRentCopy.getFullYear()}`
                }
                arrayRent.push(rentObj)
                const RoiObj = {
                    roi:roi,
                    date:`${dateObjectRentCopy.getDate().toString().padStart(2,"0")}/${(dateObjectRentCopy.getMonth()+1).toString().padStart(2,"0")}/${dateObjectRentCopy.getFullYear()}`
                }
                arrayRoi.push(RoiObj)
            }
            setRoi(arrayRoi)
            setRent(arrayRent)
            /*Rajout point date aujourd'hui pour avoir une ligne*/
            const TokenObj = {
                tokenPrice:arrayToken[arrayToken.length-1].tokenPrice,
                date:`${dateObjectRentCopy.getDate().toString().padStart(2,"0")}/${(dateObjectRentCopy.getMonth()+1).toString().padStart(2,"0")}/${dateObjectRentCopy.getFullYear()}`
            }
            const ValueObj = {
                tokenPrice:arrayToken[arrayToken.length-1].tokenPrice*(data.filter((field) => field.token === contract)[0]?.value),
                date:`${dateObjectRentCopy.getDate().toString().padStart(2,"0")}/${(dateObjectRentCopy.getMonth()+1).toString().padStart(2,"0")}/${dateObjectRentCopy.getFullYear()}`
            }
            arrayToken.push(TokenObj)
            arrayValue.push(ValueObj)
            setToken(arrayToken)
            setValue(arrayValue)
            const YieldObj = {
                yield:parseFloat(arrayYield[arrayYield.length-1].yield),
                date:`${dateObjectRentCopy.getDate().toString().padStart(2,"0")}/${(dateObjectRentCopy.getMonth()+1).toString().padStart(2,"0")}/${dateObjectRentCopy.getFullYear()}`
            }
            arrayYield.push(YieldObj)
            setYield(arrayYield)
        }
    },[contract,historyData,dataRealT,data])
    return {token,rent,yieldData,yieldInitial,roi,value}
}
export default LocationData