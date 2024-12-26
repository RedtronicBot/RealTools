import { useEffect, useState } from "react"

function DashboardData(data, dataRealT, valueRmm, historyData, rondayProperties) {
	const [rentStat, setRentStat] = useState(null)
	const [propertiesStat, setPropertiesStat] = useState(null)
	const [summaryStat, setSummaryStat] = useState(null)
	const [date, setDate] = useState([])
	const [rondayStat, setRondayStat] = useState(null)
	const [yieldStat, setYieldStat] = useState(null)

	useEffect(() => {
		/*Récupération/filtrage des données pour chaque bloc*/
		const RentObj = {
			rentYearly: 0,
			rentMonthly: 0,
			rentWeekly: 0,
			rentDaily: 0,
		}
		const YieldObj = {
			yield: 0,
			yieldFull: 0,
			yieldInitial: 0,
			yieldActual: 0,
		}
		dataRealT
			.filter((field) => field.rentStartDate !== null)
			.forEach((loc) => {
				/*Filtrage des location qui rapporte des loyers*/
				let rentYear = parseFloat(
					loc.netRentYearPerToken *
						data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
				)
				let rentMonth = parseFloat(
					loc.netRentMonthPerToken *
						data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
				)
				let rentDay = parseFloat(
					loc.netRentDayPerToken *
						data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
				)
				RentObj.rentWeekly += rentYear / 52
				RentObj.rentYearly += rentYear
				RentObj.rentMonthly += rentMonth
				RentObj.rentDaily += rentDay
				YieldObj.yield += loc.annualPercentageYield
			})
		YieldObj.yield = YieldObj.yield / dataRealT.filter((field) => field.rentStartDate !== null).length
		setRentStat(RentObj)
		const PropertiesObj = {
			tokens: 0,
			properties: 0,
			averageValue: 0,
			averagePriceBought: 0,
			averageYearlyRent: 0,
			rentedUnits: 0,
			totalUnits: 0,
		}
		dataRealT
			.filter((field) => field.rentStartDate !== null)
			.forEach((loc) => {
				PropertiesObj.tokens += data.filter(
					(field) => field.token === loc.gnosisContract.toLowerCase()
				)[0]?.value
				PropertiesObj.averagePriceBought += loc.tokenPrice
				PropertiesObj.averageYearlyRent +=
					loc.netRentYearPerToken *
					data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
				PropertiesObj.rentedUnits += loc.rentedUnits
				PropertiesObj.totalUnits += loc.totalUnits
			})
		PropertiesObj.properties = dataRealT.filter((field) => field.rentStartDate !== null).length
		PropertiesObj.averageYearlyRent =
			PropertiesObj.averageYearlyRent / dataRealT.filter((field) => field.rentStartDate !== null).length
		PropertiesObj.averagePriceBought =
			PropertiesObj.averagePriceBought / dataRealT.filter((field) => field.rentStartDate !== null).length
		/*Recherche de l'historique des locations*/
		dataRealT
			.filter((field) => field.rentStartDate !== null)
			.forEach((loc) => {
				/*Filtrage des location qui rapporte des rent*/
				if (
					loc.rentalType.trim().toLowerCase() === "pre_construction" ||
					(loc.rentedUnits !== 0 && loc.rentalType.trim().toLowerCase() !== "pre_construction") ||
					loc.productType === "loan_income"
				) {
					var history = historyData.find((obj) => obj.uuid.toLowerCase() === loc.gnosisContract.toLowerCase())
					if (history !== undefined) {
						for (var i = history.history.length - 1; i >= 0; i--) {
							if (history.history[i].values.tokenPrice !== undefined) {
								PropertiesObj.averageValue += history.history[i].values.tokenPrice
								break
							}
						}
						for (var j = history.history.length - 1; j >= 0; j--) {
							if (
								(history.history[j].values.rentedUnits !== undefined &&
									history.history[j].values.rentedUnits === loc.totalUnits &&
									history.history[j].values.netRentYear !== undefined) ||
								(history.history[j].values.rentedUnits === undefined &&
									history.history[j].values.netRentYear !== undefined) ||
								(loc.rentalType === "pre_construction" &&
									history.history[j].values.netRentYear !== undefined) ||
								(loc.productType === "loan_income" &&
									history.history[j].values.netRentYear !== undefined)
							) {
								if (loc.rentalType === "pre_construction") {
									YieldObj.yieldFull +=
										(history.history[0].values.netRentYear /
											history.history[0].values.totalInvestment) *
										100
								} else {
									YieldObj.yieldFull +=
										(history.history[j].values.netRentYear /
											history.history[0].values.totalInvestment) *
										100
								}
								break
							}
						}
						YieldObj.yieldInitial +=
							(history.history[0].values.netRentYear / history.history[0].values.totalInvestment) * 100
					}
				}
			})
		PropertiesObj.averageValue =
			PropertiesObj.averageValue / dataRealT.filter((field) => field.rentStartDate !== null).length
		YieldObj.yieldFull = YieldObj.yieldFull / dataRealT.filter((field) => field.rentStartDate !== null).length
		YieldObj.yieldInitial = YieldObj.yieldInitial / dataRealT.filter((field) => field.rentStartDate !== null).length
		setPropertiesStat(PropertiesObj)
		const SummaryObj = {
			realToken: 0,
			netValue: 0,
			rwa: 0,
		}
		dataRealT
			.filter((field) => field.rentStartDate !== null)
			.forEach((loc) => {
				SummaryObj.realToken +=
					loc.tokenPrice * data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
			})
		let RWAvalue = data.filter((field) => field.token === "0x0675e8f4a52ea6c845cb6427af03616a2af42170")[0]?.value
		let RWAprice = dataRealT.filter((field) => field.rentStartDate === null)[0]?.tokenPrice
		SummaryObj.rwa = parseFloat(RWAvalue) * parseFloat(RWAprice)
		SummaryObj.netValue = SummaryObj.realToken + SummaryObj.rwa + valueRmm
		setSummaryStat(SummaryObj)
		var today = new Date()
		var dateArray = []
		if (rondayProperties === "week") {
			var dayOfWeek = today.getDay()
			var nextDate = new Date(today)
			var daysUntilNext
			if (dayOfWeek === 1) {
				daysUntilNext = 7
			} else {
				daysUntilNext = (8 - dayOfWeek) % 7
			}
			nextDate.setDate(today.getDate() + daysUntilNext)
			for (let i = 0; i < 5; i++) {
				dateArray.push(new Date(nextDate))
				nextDate.setDate(nextDate.getDate() + 7)
			}
			setDate(dateArray)
		} else if (rondayProperties === "month") {
			let currentMonth = today.getMonth() + 1
			let currentYear = today.getFullYear()
			for (let i = 0; i < 5; i++) {
				const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
				const dayOfWeek = firstDayOfMonth.getDay()
				const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7
				firstDayOfMonth.setDate(firstDayOfMonth.getDate() + daysUntilMonday)
				dateArray.push(new Date(firstDayOfMonth))
				currentMonth++
				if (currentMonth > 11) {
					currentMonth = 0
					currentYear++
				}
			}
			setDate(dateArray)
		} else if (rondayProperties === "year") {
			let currentYear = today.getFullYear() + 1
			for (let i = 0; i < 5; i++) {
				const firstDayOfYear = new Date(currentYear, 0, 1)
				const dayOfWeek = firstDayOfYear.getDay()
				const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7
				firstDayOfYear.setDate(firstDayOfYear.getDate() + daysUntilMonday)
				dateArray.push(new Date(firstDayOfYear))
				currentYear++
			}
			setDate(dateArray)
		}

		const RondayObj = {
			first: 0,
			second: 0,
			third: 0,
			fourth: 0,
			fifth: 0,
		}
		function getRonday(properties, dateRonday) {
			dataRealT
				.filter((field) => {
					if (field.rentStartDate !== null) {
						const dateFrist = new Date(dateRonday)
						const date = field.rentStartDate.date
						const newDate = date.replace(" ", "T")
						const rentDate = new Date(newDate)
						return dateFrist > rentDate.getTime()
					}
					return false
				})
				.forEach((loc) => {
					let rentYear = parseFloat(
						loc.netRentYearPerToken.toFixed(2) *
							data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
					)
					RondayObj[properties] += rentYear
				})
		}
		getRonday("first", dateArray[0])
		getRonday("second", dateArray[1])
		getRonday("third", dateArray[2])
		getRonday("fourth", dateArray[3])
		getRonday("fifth", dateArray[4])
		setRondayStat(RondayObj)
		/*Filtrage des logment ou la location à démarée*/
		const FilteredData = dataRealT.filter((field) => {
			if (field.rentStartDate !== null) {
				const dateFrist = new Date()
				const rentDate = new Date(field.rentStartDate.date)
				const timeBought = new Date(field.timeBought)
				return dateFrist >= rentDate.getTime() && dateFrist >= timeBought
			}
			return false
		})
		FilteredData.forEach((loc) => {
			var history = historyData.find((obj) => obj.uuid.toLowerCase() === loc.gnosisContract.toLowerCase())
			let closestIndex = 0
			let closestDate = null
			const today = new Date()
			history.history.forEach((field, index) => {
				const dateFirst = field.date
				let annee = parseInt(dateFirst.substring(0, 4))
				let mois = parseInt(dateFirst.substring(4, 6)) - 1
				let jour = parseInt(dateFirst.substring(6, 8))
				const currentDate = new Date(annee, mois, jour)
				if (currentDate <= today) {
					const diff = Math.abs(currentDate - today)
					if (!closestDate || diff < Math.abs(closestDate - today)) {
						closestDate = currentDate
						closestIndex = index
					}
				}
			})
			if (
				history.history[closestIndex].values.netRentYear === undefined ||
				loc.rentalType === "pre_construction"
			) {
				YieldObj.yieldActual +=
					(history.history[0].values.netRentYear / history.history[0].values.totalInvestment) * 100
			} else {
				YieldObj.yieldActual +=
					(history.history[closestIndex].values.netRentYear / history.history[0].values.totalInvestment) * 100
			}
		})
		YieldObj.yieldActual = FilteredData.length === 0 ? 0 : YieldObj.yieldActual / FilteredData.length
		setYieldStat(YieldObj)
	}, [dataRealT, data, valueRmm, rondayProperties, historyData])

	return { rentStat, propertiesStat, summaryStat, date, rondayStat, yieldStat }
}

export default DashboardData
