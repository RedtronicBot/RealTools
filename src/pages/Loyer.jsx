import React, { useEffect,useRef,useState } from 'react'
import gear_icon from '../images/icons/gear-solid.svg'
import LineChart from '../components/Line'
import InteretCompose from '../components/InteretCompose'
import InteretComposeReel from '../components/InteretComposeReel'
function Loyer({data,dataRealT,setKey}) {
    const [rondayStat,setRondayStat] = useState(null)
    const [rondayProperties,setRondayProperties] =useState('week')
    const [date,setDate] = useState([])
    const [walletMenu,setWalletmenu] = useState(false)
    const [rentData,setRentData] =useState([])
    const [rentStat,setRentStat] = useState(null)
    const [investmentWeek,setInvestmentWeek] = useState(50)
    const [monthInvestment,setMonthInvestment] = useState(12)
    const [interestData,setInterestData] = useState([])
    const [interestDataProj,setInterestDataProj] = useState([])
    const [realData,setRealData] = useState([])
    const [investmentWeekReal,setInvestmentWeekReal] = useState(0)
    const [monthInvestmentReal,setMonthInvestmentReal] = useState(12)
    const investmentRef = useRef(null)
    useEffect(()=>{
        var today = new Date()
        var dateArray = []
        if(rondayProperties === 'week')
        {
            var dayOfWeek = today.getDay()
            var nextDate = new Date(today)
            var daysUntilNext
            if(dayOfWeek === 1)
            {
                daysUntilNext = 7
            }
            else
            {
                daysUntilNext = (8 - dayOfWeek) % 7
            }
            nextDate.setDate(today.getDate()+ daysUntilNext)
            for (let i = 0; i < 5; i++) 
            {
                dateArray.push(new Date(nextDate))
                nextDate.setDate(nextDate.getDate()+ 7)
                
            }
            setDate(dateArray)
        }
        else if(rondayProperties === 'month')
        {
            let currentMonth = today.getMonth()+1
            let currentYear = today.getFullYear()
            for (let i = 0; i < 5; i++) 
            {
                const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
                const dayOfWeek = firstDayOfMonth.getDay()
                const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 
                firstDayOfMonth.setDate(firstDayOfMonth.getDate() + daysUntilMonday)
                dateArray.push(new Date(firstDayOfMonth))
                currentMonth++
                if (currentMonth > 11) 
                {
                    currentMonth = 0
                    currentYear++
                }   
            }
            setDate(dateArray)
        }
        else if(rondayProperties === 'year')
            {
                let currentYear = today.getFullYear()+1
                for (let i = 0; i < 5; i++) 
                {
                    const firstDayOfYear = new Date(currentYear, 0, 1)
                    const dayOfWeek = firstDayOfYear.getDay()
                    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 
                    firstDayOfYear.setDate(firstDayOfYear.getDate() + daysUntilMonday)
                    dateArray.push(new Date(firstDayOfYear))
                    currentYear++   
                }
                setDate(dateArray)
            }
        
        const RondayObj = 
        {
            first:0,
            second:0,
            third:0,
            fourth:0,
            fifth:0
        }
        function getRonday(properties,dateRonday)
        {
            dataRealT.filter((field) => {
                if (field.rentStartDate !== null) {
                    const dateFrist = new Date(dateRonday)
                    const date = field.rentStartDate.date
                    const newDate = date.replace(' ', 'T')
                    const rentDate = new Date(newDate)
                    return dateFrist >= rentDate.getTime()
                }
                return false
            }).forEach(loc => {
                let rentYear = parseFloat((loc.netRentYearPerToken).toFixed(2)*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value)
                RondayObj[properties] += rentYear
            })
        }
        getRonday('first',dateArray[0])
        getRonday('second',dateArray[1])
        getRonday('third',dateArray[2])
        getRonday('fourth',dateArray[3])
        getRonday('fifth',dateArray[4])
        setRondayStat(RondayObj)
        const RentObj =
        {
            rentYearly:0,
            rentMonthly:0,
            rentWeekly:0,
            rentDaily:0
        }
        dataRealT.filter((field)=>field.rentStartDate !== null).forEach(loc => {
            /*Filtrage des location qui rapporte des loyers*/
            if(loc.rentalType.trim().toLowerCase() === 'pre_construction' || (loc.rentedUnits !== 0 && loc.rentalType.trim().toLowerCase() !== 'pre_construction') || loc.productType === "loan_income")
            {
                let rentYear = parseFloat((loc.netRentYearPerToken).toFixed(2)*(data.filter((field) => field.token === loc.gnosisContract.toLowerCase()))[0]?.value)
                RentObj.rentWeekly += rentYear /52
                RentObj.rentYearly += rentYear
                RentObj.rentMonthly += rentYear /12
                RentObj.rentDaily += (rentYear /52)/7
            }
        })
        setRentStat(RentObj)
    },[data,dataRealT,rondayProperties])
    /*Formatage des nombres à virgules*/
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
    const onSetKey = (key) =>
    {
        setKey(key)
        setTimeout(() => {
            setWalletmenu(!walletMenu)
        }, 10)
    }
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
                date:`${firstdate.getDate().toString().padStart(2,"0")}/${(firstdate.getMonth()+1).toString().padStart(2,"0")}/${firstdate.getFullYear()}`
            }
            arrayGraph.push(rentGraphObj)
            firstdate.setDate(firstdate.getDate() + 7)
        }
        setRentData(arrayGraph)
    },[dataRealT,data])
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
            dataRealT.filter((field) => {
                if (field.rentStartDate !== null) {
                    const date = field.rentStartDate.date
                    const newDate = date.replace(' ', 'T')
                    const rentDate = new Date(newDate)
                    return dateGraph >= rentDate.getTime()
                }
                return false
            }).forEach(loc => {
                let price = loc.tokenPrice*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
                capital += price
            })
            dataRealT.filter((field)=>field.rentStartDate !== null).forEach(loc=>{
                yieldRent += loc.annualPercentageYield
            })
            capital -= parseFloat(rentData[rentData.length-1].rentCumulated)
            yieldRent = yieldRent/dataRealT.filter((field)=>field.rentStartDate !== null).length
            capitalReinvest = capital + parseFloat(rentData[rentData.length-1].rentCumulated)
            rent = parseFloat(rentData[rentData.length-1].rent)
            cumulatedRent = parseFloat(rentData[rentData.length-1].rentCumulated)
            date = `${dateGraph.getDate().toString().padStart(2,"0")}/${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
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
                date = `${dateGraph.getDate().toString().padStart(2,"0")}/${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
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
            setInterestData(arrayInterest)
        }
    },[dataRealT,data,rentData,investmentWeek,monthInvestment])
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
            const arrayGraph = []
            dataRealT.filter((field)=>field.rentStartDate !== null).forEach(loc=>{
                let price = loc.tokenPrice*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
                moyenne += price
            })
            moyenne /= weeks
            if(investmentWeekReal === 0)
            {
                setInvestmentWeekReal(Math.round(moyenne))
                investmentRef.current.defaultValue = Math.round(moyenne)
            }
            for(var j=0;j <parseInt(weeks);j++)
            {
                
                date = `${dateGraph.getDate().toString().padStart(2,"0")}/${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
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
                            const date = field.rentStartDate.date
                            const newDate = date.replace(' ', 'T')
                            const rentStartedDate = new Date(newDate)
                            return dateGraph >= rentDate.getTime() && dateGraph >= rentStartedDate.getTime()
                        }
                        return false
                    }).forEach(loc => {
                        let rentYear = parseFloat((loc.netRentYearPerToken).toFixed(2)*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value)
                        let price = loc.tokenPrice*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
                        rentLoop += rentYear /52
                        capitalLoop += price - rentLoop
                        yieldLoop += loc.annualPercentageYield
                    })
                    date = `${dateGraph.getDate().toString().padStart(2,"0")}/${(dateGraph.getMonth()+1).toString().padStart(2,"0")}/${dateGraph.getFullYear()}`
                    yieldLoop = yieldLoop/dataRealT.filter((field) => {
                        if (field.rentStartDate !== null) 
                        {
                            const rentDate = new Date(field.timeBought)
                            const date = field.rentStartDate.date
                            const newDate = date.replace(' ', 'T')
                            const rentStartedDate = new Date(newDate)
                            return dateGraph > rentDate.getTime() && dateGraph > rentStartedDate.getTime()
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
            setInterestDataProj(arrayInterest)
            setRealData(arrayGraph)
        }
    },[dataRealT,data,rentData,investmentWeekReal,monthInvestmentReal])
    return(
        <div className='loyer'>
            <h1 className='dashboard_title'>Loyers</h1>
            <div className='dashboard_settings' >
				<img src={gear_icon} alt='filter' width={24} height={24} className='icon' onClick={()=>setWalletmenu(!walletMenu)} />
			</div>
            <div className={`dashboard_settings_key ${walletMenu ? "open":""}`} >
                <div className='map_settings_key'>
                    <input type='text' onChange={(e)=>onSetKey(e.target.value)} />
                    <span>Portefeuille</span>
                </div>
            </div>
            <div className='dashboard_bloc_stats'>
                <div className='dashboard_text_stats'>
                    <div className='dashboard_text_stats_inline_text'>
                        <h2>Prochain Loyer</h2>
                        <select onChange={(e)=>setRondayProperties(e.target.value)} defaultValue='week' className='dashboard_text_stats_select'>
                            <option value='week'>Semaine</option>
                            <option value='month'>Mois</option>
                            <option value='year'>Année</option>
                        </select>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[0].getDate().toString().padStart(2,"0")}/${(date[0].getMonth()+1).toString().padStart(2,"0")}/${date[0].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.first === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.first/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.first/52,2)} $ - ${formatNumber(rondayStat.first/12,2)} $`):(`${formatNumber(rondayStat.first/52,2)} $ - ${formatNumber(rondayStat.first,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[1].getDate().toString().padStart(2,"0")}/${(date[1].getMonth()+1).toString().padStart(2,"0")}/${date[1].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.second === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.second/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.second/52,2)} $ - ${formatNumber(rondayStat.second/12,2)} $`):(`${formatNumber(rondayStat.second/52,2)} $ - ${formatNumber(rondayStat.second,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[2].getDate().toString().padStart(2,"0")}/${(date[2].getMonth()+1).toString().padStart(2,"0")}/${date[2].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.third === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.third/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.third/52,2)} $ - ${formatNumber(rondayStat.third/12,2)} $`):(`${formatNumber(rondayStat.third/52,2)} $ - ${formatNumber(rondayStat.third,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[3].getDate().toString().padStart(2,"0")}/${(date[3].getMonth()+1).toString().padStart(2,"0")}/${date[3].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.fourth === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.fourth/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.fourth/52,2)} $ - ${formatNumber(rondayStat.fourth/12,2)} $`):(`${formatNumber(rondayStat.fourth/52,2)} $ - ${formatNumber(rondayStat.fourth,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[4].getDate().toString().padStart(2,"0")}/${(date[4].getMonth()+1).toString().padStart(2,"0")}/${date[4].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.fifth === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.fifth/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.fifth/52,2)} $ - ${formatNumber(rondayStat.fifth/12,2)} $`):(`${formatNumber(rondayStat.fifth/52,2)} $ - ${formatNumber(rondayStat.fifth,2)}$`))))}</p>
                    </div>
                </div>
                <div className='dashboard_text_stats'>
                    <h2>Loyers</h2>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Journaliers</p>
                        <p>{rentStat &&(rentStat.rentDaily === 0 ?("-"):(`${formatNumber(rentStat.rentDaily,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Hebdomadaires</p>
                        <p>{rentStat &&(rentStat.rentWeekly === 0 ?("-"):(`${formatNumber(rentStat.rentWeekly,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Mensuels</p>
                        <p>{rentStat &&(rentStat.rentMonthly === 0 ?("-"):(`${formatNumber(rentStat.rentMonthly,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Annuels</p>
                        <p>{rentStat &&(rentStat.rentYearly === 0 ?("-"):(`${formatNumber(rentStat.rentYearly,2)} $`))}</p>
                    </div>
                </div>
            </div>
            <div className='dashboard_bloc_stats'>
                <div className='dashboard_chart_loyer'>
                    <LineChart datachart={rentData} />
                </div>
                <div className='dashboard_chart_loyer'>
                    <div className='dashboard_chart_loyer_input_bloc'>
                        <div className='dashboard_chart_loyer_input'>
                            <p>Investissement par semaine</p>
                            <div className='dashboard_chart_loyer_input_components'>
                                <p>$</p>
                                <input type='number' defaultValue={50} onChange={(e)=>setInvestmentWeek(e.target.value)}/>
                            </div>
                        </div>
                        <div className='dashboard_chart_loyer_input'>
                            <p>Nombre de mois</p>
                            <input type='number' defaultValue={12} onChange={(e)=>setMonthInvestment(e.target.value)}/>
                        </div>
                    </div>
                    <InteretCompose datachart={interestData}/>
                </div>
                <div className='dashboard_chart_loyer'>
                    <div className='dashboard_chart_loyer_input_bloc'>
                        <div className='dashboard_chart_loyer_input'>
                            <p>Investissement par semaine</p>
                            <div className='dashboard_chart_loyer_input_components'>
                                <p>$</p>
                                <input type='number' ref={investmentRef} onChange={(e)=>setInvestmentWeekReal(e.target.value)}/>
                            </div>
                        </div>
                        <div className='dashboard_chart_loyer_input'>
                            <p>Nombre de mois</p>
                            <input type='number' defaultValue={12} onChange={(e)=>setMonthInvestmentReal(e.target.value)}/>
                        </div>
                    </div>
                    <InteretComposeReel datachart={interestDataProj} datareal={realData}/>
                </div>
            </div>
        </div>
    )
}

export default Loyer