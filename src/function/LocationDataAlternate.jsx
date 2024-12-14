import { useEffect, useState } from "react"
function LocationDataAlternate(historyData, dataRealT, contract) {
	const [tokenAlternate, setToken] = useState([])
	const [rentAlternate, setRent] = useState([])
	const [yieldDataAlternate, setYield] = useState([])
	const [yieldInitialAlternate, setYieldInitial] = useState([])
	const [roiAlternate, setRoi] = useState([])
	useEffect(() => {
		var historyState = historyData.find((obj) => obj.uuid.toLowerCase() === contract)
		var dataRealtTFilter = dataRealT.find((loc) => loc.gnosisContract.toLowerCase() === contract)
		const arrayYield = []
		const arrayToken = []
		const arrayHistoryRent = []
		const arrayRent = []
		const arrayRoi = []
		if (historyState !== undefined) {
			const arrayInitial = []
			const YieldObjInitial = {
				yield: parseFloat(
					(
						(historyState.history[0].values.netRentYear / historyState.history[0].values.totalInvestment) *
						100
					).toFixed(2)
				),
			}
			arrayInitial.push(YieldObjInitial)
			setYieldInitial(arrayInitial)
			for (var i = 0; i < historyState.history.length; i++) {
				/*Récupération du prix du token*/
				if (historyState.history[i].values.tokenPrice !== undefined) {
					const date = historyState.history[i].date
					let annee = parseInt(date.substring(0, 4))
					let mois = parseInt(date.substring(4, 6)) - 1
					let jour = parseInt(date.substring(6, 8))
					const dateObject = new Date(annee, mois, jour)
					const TokenObj = {
						tokenPrice: historyState.history[i].values.tokenPrice,
						date: `${dateObject.getDate().toString().padStart(2, "0")}/${(dateObject.getMonth() + 1)
							.toString()
							.padStart(2, "0")}/${dateObject.getFullYear()}`,
					}
					arrayToken.push(TokenObj)
				}
				/*Récupération de l'historique du loyer la location*/
				if (historyState.history[i].values.netRentYear !== undefined) {
					const date = historyState.history[i].date
					let annee = parseInt(date.substring(0, 4))
					let mois = parseInt(date.substring(4, 6)) - 1
					let jour = parseInt(date.substring(6, 8))
					const dateObject = new Date(annee, mois, jour)
					const RentObj = {
						rent: (
							parseFloat(historyState.history[i].values.netRentYear) /
							parseInt(dataRealtTFilter.totalTokens) /
							52
						).toFixed(2),
						date: dateObject,
					}
					arrayHistoryRent.push(RentObj)

					const YieldObj = {
						yield: parseFloat(
							(
								(historyState.history[i].values.netRentYear /
									historyState.history[0].values.totalInvestment) *
								100
							).toFixed(2)
						),
						date: `${dateObject.getDate().toString().padStart(2, "0")}/${(dateObject.getMonth() + 1)
							.toString()
							.padStart(2, "0")}/${dateObject.getFullYear()}`,
					}
					arrayYield.push(YieldObj)
				}
			}
			/*Calcul de la rent depuis la date d'achat*/
			const date = historyState.history[0].date
			let annee = parseInt(date.substring(0, 4))
			let mois = parseInt(date.substring(4, 6)) - 1
			let jour = parseInt(date.substring(6, 8))
			const dateObjectRent = new Date(annee, mois, jour)
			const rentObj = {
				rent: 0,
				date: `${dateObjectRent.getDate().toString().padStart(2, "0")}/${(dateObjectRent.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateObjectRent.getFullYear()}`,
			}
			arrayRent.push(rentObj)
			const RoiObj = {
				roi: 0,
				date: `${dateObjectRent.getDate().toString().padStart(2, "0")}/${(dateObjectRent.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateObjectRent.getFullYear()}`,
			}
			arrayRoi.push(RoiObj)
			const dayOfWeek = dateObjectRent.getDay()
			const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7
			dateObjectRent.setDate(dateObjectRent.getDate() + daysUntilMonday)
			const today = new Date()
			const todayDay = today.getDay()
			const daysBeforeToday = todayDay === 0 ? 6 : todayDay - 1
			today.setDate(today.getDate() - daysBeforeToday)
			const oneDayInMs = 1000 * 60 * 60 * 24
			const oneWeekInMs = oneDayInMs * 7
			const diffInMs = Math.abs(dateObjectRent - today)
			const weeks = diffInMs / oneWeekInMs
			let index = 0
			let rent = 0
			let roi = 0
			const dateObjectRentCopy = new Date(dateObjectRent)
			dateObjectRentCopy.setDate(dateObjectRentCopy.getDate() - 7)
			for (var j = 0; j <= Math.round(weeks); j++) {
				dateObjectRentCopy.setDate(dateObjectRentCopy.getDate() + 7)
				for (let k = 0; k < arrayHistoryRent.length; k++) {
					if (dateObjectRentCopy >= arrayHistoryRent[k].date) {
						index = k
					} else {
						break
					}
				}
				rent += parseFloat(arrayHistoryRent[index].rent)
				roi = ((rent / arrayToken[0].tokenPrice) * 100).toFixed(2)
				const rentObj = {
					rent: parseFloat(rent).toFixed(2),
					date: `${dateObjectRentCopy.getDate().toString().padStart(2, "0")}/${(
						dateObjectRentCopy.getMonth() + 1
					)
						.toString()
						.padStart(2, "0")}/${dateObjectRentCopy.getFullYear()}`,
				}
				arrayRent.push(rentObj)
				const RoiObj = {
					roi: roi,
					date: `${dateObjectRentCopy.getDate().toString().padStart(2, "0")}/${(
						dateObjectRentCopy.getMonth() + 1
					)
						.toString()
						.padStart(2, "0")}/${dateObjectRentCopy.getFullYear()}`,
				}
				arrayRoi.push(RoiObj)
			}
			const dateBought = new Date(dataRealtTFilter.timeBought)
			let closestIndex = 0
			let closestDate = null
			arrayRoi.forEach((field, index) => {
				const [day, month, year] = field.date.split("/").map(Number)
				const currentDate = new Date(year, month - 1, day)
				if (currentDate <= dateBought) {
					const diff = Math.abs(currentDate - dateBought)
					if (!closestDate || diff < Math.abs(closestDate - dateBought)) {
						closestDate = currentDate
						closestIndex = index
					}
				}
			})
			const lineROI =
				arrayRoi.length < 2
					? parseFloat(arrayRoi[closestIndex].roi)
					: (parseFloat(arrayRoi[closestIndex].roi) + parseFloat(arrayRoi[closestIndex + 1].roi)) / 2
			const lineRoiObj = {
				roi: lineROI,
				date: `${dateBought.getDate().toString().padStart(2, "0")}/${(dateBought.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateBought.getFullYear()}`,
				buy: true,
			}

			arrayRoi.splice(closestIndex + 1, 0, lineRoiObj)
			setRoi(arrayRoi)
			const lineRent =
				arrayRoi.length < 2
					? parseFloat(arrayRent[closestIndex].rent)
					: (parseFloat(arrayRent[closestIndex].rent) + parseFloat(arrayRent[closestIndex + 1].rent)) / 2
			const lineRentObj = {
				rent: lineRent.toFixed(2),
				date: `${dateBought.getDate().toString().padStart(2, "0")}/${(dateBought.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateBought.getFullYear()}`,
				buy: true,
			}
			arrayRent.splice(closestIndex + 1, 0, lineRentObj)
			setRent(arrayRent)
			/*Rajout point date aujourd'hui pour avoir une ligne*/
			const TokenObj = {
				tokenPrice: arrayToken[arrayToken.length - 1].tokenPrice,
				date: `${dateObjectRentCopy.getDate().toString().padStart(2, "0")}/${(dateObjectRentCopy.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateObjectRentCopy.getFullYear()}`,
			}
			arrayToken.push(TokenObj)
			closestIndex = 0
			closestDate = null
			arrayToken.forEach((field, index) => {
				const [day, month, year] = field.date.split("/").map(Number)
				const currentDate = new Date(year, month - 1, day)
				if (currentDate <= dateBought) {
					const diff = Math.abs(currentDate - dateBought)
					if (!closestDate || diff < Math.abs(closestDate - dateBought)) {
						closestDate = currentDate
						closestIndex = index
					}
				}
			})
			const lineToken = (arrayToken[closestIndex].tokenPrice + arrayToken[closestIndex + 1].tokenPrice) / 2
			const lineTokenObj = {
				tokenPrice: lineToken,
				date: `${dateBought.getDate().toString().padStart(2, "0")}/${(dateBought.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateBought.getFullYear()}`,
				buy: true,
			}
			arrayToken.splice(closestIndex + 1, 0, lineTokenObj)
			setToken(arrayToken)
			const YieldObj = {
				yield: parseFloat(arrayYield[arrayYield.length - 1].yield),
				date: `${dateObjectRentCopy.getDate().toString().padStart(2, "0")}/${(dateObjectRentCopy.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateObjectRentCopy.getFullYear()}`,
			}
			arrayYield.push(YieldObj)
			closestIndex = 0
			closestDate = null
			arrayYield.forEach((field, index) => {
				const [day, month, year] = field.date.split("/").map(Number)
				const currentDate = new Date(year, month - 1, day)
				if (currentDate <= dateBought) {
					const diff = Math.abs(currentDate - dateBought)
					if (!closestDate || diff < Math.abs(closestDate - dateBought)) {
						closestDate = currentDate
						closestIndex = index
					}
				}
			})
			const lineYieldObj = {
				yield: arrayYield[closestIndex].yield,
				date: `${dateBought.getDate().toString().padStart(2, "0")}/${(dateBought.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${dateBought.getFullYear()}`,
				buy: true,
			}
			arrayYield.splice(closestIndex + 1, 0, lineYieldObj)
			setYield(arrayYield)
		}
	}, [contract, historyData, dataRealT])
	return { tokenAlternate, rentAlternate, yieldDataAlternate, yieldInitialAlternate, roiAlternate }
}
export default LocationDataAlternate
