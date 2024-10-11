import {useEffect,useState} from 'react'

function ProchainLoyer(data,dataRealT,rondayProperties) {
    const [rondayStat,setRondayStat] = useState(null)
    const [date,setDate] = useState([])
    const [rentStat,setRentStat] = useState(null)
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
    return {rondayStat,date,rentStat}
}

export default ProchainLoyer