function NombreTokenAchetee(data, dataRealT, historyData) {
	const arrayHistoryData = []
	historyData.forEach((e) => {
		for (var j = 0; j < e.history.length; j++) {
			if (e.history[j].values.canal === "release") {
				const dateHistory = e.history[j].date
				let annee = parseInt(dateHistory.substring(0, 4))
				let mois = parseInt(dateHistory.substring(4, 6)) - 1
				let jour = parseInt(dateHistory.substring(6, 8))
				const firstDateHistory = new Date(annee, mois, jour)
				arrayHistoryData.push(firstDateHistory)
			}
		}
	})
	const arrayHistory = []
	const dateFirstHistory = new Date(arrayHistoryData[0])
	dateFirstHistory.setDate(1)
	const dateFirstHistoryMonth = dateFirstHistory.getMonth()
	const dateFirstHistoryYear = dateFirstHistory.getFullYear()
	const today = new Date()
	const todayMonth = today.getMonth()
	const todayYear = today.getFullYear()
	const monthHistory = (todayYear - dateFirstHistoryYear) * 12 + (todayMonth - dateFirstHistoryMonth)
	for (var k = 0; k <= monthHistory; k++) {
		const dernierJourMoisHistory = new Date(dateFirstHistory.getFullYear(), dateFirstHistory.getMonth() + 1, 0)
		const MonthHistoryData = arrayHistoryData.filter((field) => {
			const dateInvestment = new Date(field)
			return dateInvestment >= dateFirstHistory && dateInvestment <= dernierJourMoisHistory
		})
		const historyObj = {
			value: MonthHistoryData.length,
			amount: 0,
			token: 0,
			date: new Date(dateFirstHistory.getTime()),
		}
		arrayHistory.push(historyObj)
		dateFirstHistory.setMonth(dateFirstHistory.getMonth() + 1)
	}

	const dateBought = new Date(dataRealT[0].timeBought)
	dateBought.setDate(1)

	const dateBoughtMonth = dateBought.getMonth()
	const dateBoughtYear = dateBought.getFullYear()

	const month = (todayYear - dateBoughtYear) * 12 + (todayMonth - dateBoughtMonth)

	for (var i = 0; i <= month; i++) {
		const dernierJourMois = new Date(dateBought.getFullYear(), dateBought.getMonth() + 1, 0)
		dernierJourMois.setHours(23, 59, 59)
		const MonthBougthData = dataRealT.filter((field) => {
			if (field.rentStartDate !== null) {
				const dateInvestment = new Date(field.timeBought)
				return dateInvestment >= dateBought && dateInvestment <= dernierJourMois
			}
			return false
		})
		let tokenValue = 0
		MonthBougthData.forEach((e) => {
			tokenValue += data.filter((field) => field.token === e.gnosisContract.toLowerCase())[0]?.value
		})
		const findDateArray = arrayHistory.find(
			(e) => e.date.getMonth() === dateBought.getMonth() && e.date.getFullYear() === dateBought.getFullYear()
		)
		findDateArray.amount = MonthBougthData.length
		findDateArray.token = tokenValue
		dateBought.setMonth(dateBought.getMonth() + 1)
	}
	const valueLastMonth = arrayHistory[arrayHistory.length - 1].amount
	const tokenValueLastMonth = arrayHistory[arrayHistory.length - 1].token
	const groupedByYear = arrayHistory.reduce((acc, obj) => {
		const year = new Date(obj.date).getFullYear() // Extrait l'année de la date
		if (!acc[year]) {
			acc[year] = [] // Initialise une liste pour cette année si elle n'existe pas encore
		}
		acc[year].push(obj) // Ajoute l'objet à la liste de l'année correspondante
		return acc
	}, {})
	return { groupedByYear, valueLastMonth, tokenValueLastMonth }
}

export default NombreTokenAchetee
