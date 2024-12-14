import { useEffect, useState } from "react"
function EvolutionYield(historyData, dataRealT) {
	const [yieldChart, setYieldChart] = useState(null)
	useEffect(() => {
		const firstDate = new Date(dataRealT[0].timeBought)
		const firstDateDay = firstDate.getDay()
		const daysBeforefirstDate = firstDateDay === 0 ? 6 : firstDateDay - 1
		firstDate.setDate(firstDate.getDate() - daysBeforefirstDate)
		const firstDateAfter = new Date(dataRealT[0].timeBought)
		const firstDateAfterDay = firstDateAfter.getDay()
		const daysBeforefirstDateAfter = firstDateAfterDay === 0 ? 6 : firstDateAfterDay - 1
		firstDateAfter.setDate(firstDateAfter.getDate() - daysBeforefirstDateAfter)
		firstDateAfter.setDate(firstDateAfter.getDate() + 6)
		const today = new Date()
		const todayDay = today.getDay()
		const daysBeforeToday = todayDay === 0 ? 6 : todayDay - 1
		today.setDate(today.getDate() - daysBeforeToday)
		const oneDayInMs = 1000 * 60 * 60 * 24
		const oneWeekInMs = oneDayInMs * 7
		const diffInMs = Math.abs(firstDate - today)
		const weeks = diffInMs / oneWeekInMs
		const array = []
		for (var i = 0; i < weeks; i++) {
			const filteredDataRealT = dataRealT.filter((field) => {
				if (field.rentStartDate !== null) {
					const dateRentToken = new Date(field.timeBought)
					return dateRentToken <= firstDateAfter
				}
				return false
			})
			let yieldInitial = 0
			let yieldActuel = 0
			let yieldAnnuel = 0
			let yieldLocationPleine = 0
			const locationBought = dataRealT.filter((field) => {
				const dateRentToken = new Date(field.timeBought)
				return dateRentToken <= firstDateAfter
			})
			filteredDataRealT.forEach((field) => {
				const data = historyData.find((loc) => field.gnosisContract.toLowerCase() === loc.uuid.toLowerCase())
				if (data !== undefined) {
					let closestIndex = 0
					let closestDate = null
					data.history.forEach((field, index) => {
						const dateFirst = field.date
						let annee = parseInt(dateFirst.substring(0, 4))
						let mois = parseInt(dateFirst.substring(4, 6)) - 1
						let jour = parseInt(dateFirst.substring(6, 8))
						const currentDate = new Date(annee, mois, jour)
						if (currentDate <= firstDateAfter) {
							const diff = Math.abs(currentDate - firstDateAfter)
							if (!closestDate || diff < Math.abs(closestDate - firstDateAfter)) {
								closestDate = currentDate
								closestIndex = index
							}
						}
					})
					if (
						field.rentalType.trim().toLowerCase() === "pre_construction" ||
						(field.rentedUnits !== 0 && field.rentalType.trim().toLowerCase() !== "pre_construction") ||
						field.productType === "loan_income"
					) {
						const rentStartDate = new Date(field.rentStartDate.date)
						yieldInitial +=
							(data.history[0].values.netRentYear / data.history[0].values.totalInvestment) * 100
						if (firstDateAfter >= rentStartDate) {
							if (
								data.history[closestIndex].values.netRentYear === undefined ||
								field.rentalType === "pre_construction"
							) {
								yieldActuel +=
									(data.history[0].values.netRentYear / data.history[0].values.totalInvestment) * 100
							} else {
								yieldActuel +=
									(data.history[closestIndex].values.netRentYear /
										data.history[0].values.totalInvestment) *
									100
							}
						}
						if (
							data.history[closestIndex].values.netRentYear === undefined ||
							field.rentalType === "pre_construction"
						) {
							yieldAnnuel +=
								(data.history[0].values.netRentYear / data.history[0].values.totalInvestment) * 100
						} else {
							yieldAnnuel +=
								(data.history[closestIndex].values.netRentYear /
									data.history[0].values.totalInvestment) *
								100
						}
						for (var j = data.history.length - 1; j >= 0; j--) {
							if (
								(data.history[j].values.rentedUnits !== undefined &&
									data.history[j].values.rentedUnits === field.totalUnits &&
									data.history[j].values.netRentYear !== undefined) ||
								(data.history[j].values.rentedUnits === undefined &&
									data.history[j].values.netRentYear !== undefined) ||
								(field.rentalType === "pre_construction" &&
									data.history[j].values.netRentYear !== undefined) ||
								(field.productType === "loan_income" &&
									data.history[j].values.netRentYear !== undefined)
							) {
								if (field.rentalType === "pre_construction") {
									yieldLocationPleine +=
										(data.history[0].values.netRentYear / data.history[0].values.totalInvestment) *
										100
								} else {
									yieldLocationPleine +=
										(data.history[j].values.netRentYear / data.history[0].values.totalInvestment) *
										100
								}
								break
							}
						}
					}
				}
			})
			const FilteredData = dataRealT.filter((field) => {
				if (field.rentStartDate !== null) {
					const rentDate = new Date(field.rentStartDate.date)
					return firstDateAfter >= rentDate && firstDateAfter >= field.timeBought
				}
				return false
			})
			const yieldObj = {
				yieldInitial: (
					yieldInitial / locationBought.filter((field) => field.rentStartDate !== null).length
				).toFixed(2),
				yieldActuel: FilteredData.length === 0 ? null : (yieldActuel / FilteredData.length).toFixed(2),
				yieldAnnuel: (
					yieldAnnuel / locationBought.filter((field) => field.rentStartDate !== null).length
				).toFixed(2),
				yieldLocationPleine: (
					yieldLocationPleine / locationBought.filter((field) => field.rentStartDate !== null).length
				).toFixed(2),
				date: `${firstDate.getDate().toString().padStart(2, "0")}/${(firstDate.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${firstDate.getFullYear()}`,
			}
			array.push(yieldObj)
			firstDate.setDate(firstDate.getDate() + 7)
			firstDateAfter.setDate(firstDateAfter.getDate() + 7)
		}
		setYieldChart(array)
	}, [dataRealT, historyData])
	return { yieldChart }
}
export default EvolutionYield
