import { useEffect, useState } from "react"
import axios from "axios"
function InvestissementMensuel(historyData, data, dataRealT, key) {
	const [investment, setInvestment] = useState(null)
	useEffect(() => {
		axios
			.get(
				`https://api.gnosisscan.io/api?module=account&action=tokentx&address=${key}&startblock=0&endblock=99999999&sort=asc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`
			)
			.then((response) => {
				const gnosisData = response.data.result
				const filteredData = gnosisData.filter(
					(loc) =>
						loc.tokenName.toLowerCase().startsWith("realtoken") &&
						loc.tokenName !== "RealToken RWA Holdings SA, Neuchatel, NE, Suisse"
				)
				const dateRent = new Date(parseInt(filteredData[0].timeStamp) * 1000)
				dateRent.setDate(1)
				const dateRentMonth = dateRent.getMonth()
				const dateRentYear = dateRent.getFullYear()
				const today = new Date()
				const todayMonth = today.getMonth()
				const todayYear = today.getFullYear()
				const month = (todayYear - dateRentYear) * 12 + (todayMonth - dateRentMonth)
				const array = []
				for (var i = 0; i <= month; i++) {
					const dernierJour = new Date(dateRent.getFullYear(), dateRent.getMonth() + 1, 0)
					dernierJour.setHours(23, 59, 59)
					const monthInvestmentData = filteredData.filter((field) => {
						const dateInvestment = new Date(parseInt(field.timeStamp) * 1000)
						return dateInvestment >= dateRent && dateInvestment <= dernierJour
					})
					let investment = 0
					monthInvestmentData.forEach((element) => {
						const data = dataRealT.find(
							(loc) => loc.gnosisContract.toLowerCase() === element.contractAddress.toLowerCase()
						)

						const dataHistory = historyData.find(
							(loc) => loc.uuid.toLowerCase() === element.contractAddress.toLowerCase()
						)
						const value = parseInt(element.value) / Number(1000000000000000000n)
						if (element.to === key) {
							if (data !== undefined) {
								investment += parseFloat(data.tokenPrice) * value
							} else if (dataHistory !== undefined) {
								investment += parseFloat(dataHistory.history[0].values.tokenPrice) * value
							}
						} else {
							if (element.tokenName !== "RealToken Ecosystem Governance") {
								if (data !== undefined) {
									investment -= parseFloat(data.tokenPrice) * value
								} else if (dataHistory !== undefined) {
									investment -= parseFloat(dataHistory.history[0].values.tokenPrice) * value
								}
							}
						}
					})
					const arrayObj = {
						invest: investment.toFixed(2),
						date: `${(dateRent.getMonth() + 1).toString().padStart(2, "0")}/${dateRent.getFullYear()}`,
					}
					array.push(arrayObj)
					dateRent.setMonth(dateRent.getMonth() + 1)
				}
				setInvestment(array)
			})
			.catch((err) => console.error(err))
	}, [dataRealT, key, historyData, data])
	return { investment }
}

export default InvestissementMensuel
