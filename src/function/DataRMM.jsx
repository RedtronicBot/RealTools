import { useEffect, useState } from "react"
function DataTokenBought(key, arrayData) {
	const [arrayRMM, setArrayRMM] = useState([])
	const [dataValue, setDataValue] = useState(null)
	useEffect(() => {
		/*Controller pour gérer les double appel API*/
		const controller = new AbortController()
		const signal = controller.signal
		if (key !== "") {
			var sortedArray
			var dataValueObj
			const fetchData = async () => {
				const storedData = JSON.parse(localStorage.getItem("dataRMM"))
				if (storedData && new Date().getTime() < new Date(storedData.expires)) {
					sortedArray = storedData.arrayRMM
					dataValueObj = storedData.dataValue
				} else {
					localStorage.removeItem("dataRMM")
					const array = []
					const firstPayemnt = new Date(arrayData[0].time)
					const firstPayemntMonth = firstPayemnt.getMonth()
					const firstPayemntYear = firstPayemnt.getFullYear()
					const today = new Date()
					const todayMonth = today.getMonth()
					const todayYear = today.getFullYear()
					const month = (todayYear - firstPayemntYear) * 12 + (todayMonth - firstPayemntMonth)
					for (var i = 0; i <= month; i++) {
						const filtredDataRMM = arrayData.filter((field) => {
							const dateFilter = new Date(field.time)
							return (
								firstPayemnt.getMonth() === dateFilter.getMonth() &&
								firstPayemnt.getFullYear() === dateFilter.getFullYear()
							)
						})
						array.push(filtredDataRMM)
						firstPayemnt.setMonth(firstPayemnt.getMonth() + 1)
					}
					const sortedArray_ = array.map((subArray) =>
						subArray.sort((a, b) => new Date(b.time) - new Date(a.time))
					)
					sortedArray_.sort((a, b) => {
						const latestDateA = a.length ? new Date(a[a.length - 1].time) : new Date(0)
						const latestDateB = b.length ? new Date(b[b.length - 1].time) : new Date(0)
						return latestDateB - latestDateA
					})
					var value = 0
					var valuePos = 0
					var valueNeg = 0
					var interest = 0
					for (var j = 0; j < arrayData.length; j++) {
						value += arrayData[j].value
						if (arrayData[j].value > 0) {
							valuePos += arrayData[j].value
							try {
								if (signal.aborted) return
								const response = await fetch(
									`https://api.gnosisscan.io/api?module=account&action=txlistinternal&txhash=${arrayData[j].hash}&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`,
									{ signal }
								)
								const arrayDataLoop = arrayData[j]
								const data = await response.json()
								if (data.result.length > 1) {
									interest += arrayData[j].value
									const newField = { interest: true }
									sortedArray_.forEach((subArray) => {
										subArray.forEach((obj) => {
											if (obj.hash === arrayDataLoop.hash) {
												Object.assign(obj, newField)
											}
										})
									})
								}
							} catch (err) {
								if (signal.aborted) {
									console.error("Request aborted by AbortController")
								} else {
									console.error(err)
								}
							}
							await new Promise((resolve) => setTimeout(resolve, 220))
						} else {
							valueNeg += arrayData[j].value
						}
					}
					const roi = (interest / valuePos) * 100
					const dataValueObj_ = {
						value: value,
						valuePos: valuePos,
						valueNeg: valueNeg,
						interest: interest,
						roi: roi,
					}
					sortedArray = sortedArray_
					dataValueObj = dataValueObj_

					const now = new Date()
					now.setDate(now.getDate() + 3)
					now.setHours(23, 59, 59, 999)
					localStorage.setItem(
						"dataRMM",
						JSON.stringify({
							arrayRMM: sortedArray,
							dataValue: dataValueObj,
							expires: now,
						})
					)
				}
				setArrayRMM(sortedArray)
				setDataValue(dataValueObj)
			}
			fetchData()
		}
		return () => {
			controller.abort()
		}
	}, [key, arrayData])
	return { arrayRMM, dataValue }
}

export default DataTokenBought
