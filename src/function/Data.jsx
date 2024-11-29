import { useState,useEffect,useCallback} from 'react'
import axios from 'axios'
import Decimal from 'decimal.js'
function Data() {
	const [data, setData] = useState([])
	const [dataRealT,setDataRealT] = useState([])
	const [key,setKey] = useState('')
	const [valueRmm,setValueRmm] = useState(0) 
	const [history,setHistory] = useState([])
	const [rentData,setRentData] =useState([])
	const [tokenBought,setTokenBought] = useState([])
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
	const myFunction = useCallback(async () => {	
		const storedData = JSON.parse(localStorage.getItem('realt'))
		if(!storedData) {
			var array = []
			var rmm = 0
			var dataTokenRealT
			var dataGlobalToken
			var dataRealTHistory
			var dataTransaction
			var filteredTokens
			try{
				const responseGnosisPersonnalToken = await axios.get(`https://api.gnosisscan.io/api?module=account&action=tokentx&address=${key}&startblock=0&endblock=99999999&sort=asc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`)
				filteredTokens = responseGnosisPersonnalToken.data.result
				filteredTokens.forEach((token)=>{
					let tokenValue = Number(token.value)/Number(1000000000000000000n)
					if(token.tokenName === 'RealToken RWA Holdings SA, Neuchatel, NE, Suisse')
					{
						tokenValue = Number(token.value)/1000000000	
					}
					tokenValue = parseFloat(tokenValue.toFixed(4))
					/*Filtrage et ajout des données */
					if(token.tokenName.toLowerCase().startsWith("realtoken") && token.tokenName !== "RealToken Ecosystem Governance")
					{
						if (array.length > 0)
						{
							const index = array.findIndex(arrays => token.contractAddress === arrays.token)
							if(index !== -1)
							{
								if(token.to !== key)
								{

									array[index].value -= tokenValue
									
								}	
								else
								{
									array[index].value += tokenValue	
								}		
							}
							else
							{	
								const date = new Date(parseInt(token.timeStamp)*1000)
								const dataObj ={
									token:token.contractAddress,
									value:tokenValue,
									time:date
								}
								array.push(dataObj)
							}	
						}
						else
						{
							const date = new Date(parseInt(token.timeStamp)*1000)
							const dataObj ={
								token:token.contractAddress,
								value:tokenValue,
								time:date
							}
							array.push(dataObj)	
						}	
					}
					else if(token.tokenName === 'RealT RMM V3 WXDAI')
					{
						if(token.to.toLowerCase() === key.toLowerCase())
						{
							rmm += parseInt(token.value) / Number(1000000000000000000n)
						}
						else
						{
							rmm -= parseInt(token.value) / Number(1000000000000000000n)
						}
					}
				})
				const new_array = array.filter(arrays => arrays.value !== 0)
				array = new_array
				const responseTokenRealT = await axios.get(`https://api.realt.community/v1/token`, {headers: {'X-AUTH-REALT-TOKEN': 'b65e9f9f-preprod-14ae-676b-9256697b1e3e'}})
				dataTokenRealT = responseTokenRealT.data
				/*for (let i = 0; i < array.length; i++) 
				{
					try {
						const responseGlobalToken = await axios.get(`https://api.gnosisscan.io/api?module=account&action=tokentx&contractaddress=${array[i].token}&startblock=0&endblock=99999999&page=&offset=10&sort=asc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`)
						dataGlobalToken = responseGlobalToken.data.result
						
					} 
					catch (error)
					{
						console.error(error)
					}
					await new Promise(resolve => setTimeout(resolve, 200))
				}*/
				const responseRealTHistory = await axios.get(`https://api.realt.community/v1/tokenHistory`, {headers: {'X-AUTH-REALT-TOKEN': 'b65e9f9f-preprod-14ae-676b-9256697b1e3e'}})
				dataRealTHistory = responseRealTHistory.data
				const responseGnosisTransaction = await axios.get(`https://api.gnosisscan.io/api?module=account&action=txlistinternal&address=${key}&startblock=0&endblock=99999999&sort=asc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`)
				dataTransaction = responseGnosisTransaction.data.result
			}
			catch(err) {
				console.error(err)
			}
		}
		return {filteredTokens,array,rmm,dataTokenRealT,dataGlobalToken,dataRealTHistory,dataTransaction}
	}, [key])
	/*Récupération du wallet*/
	useEffect(() => {
		const keys = JSON.parse(localStorage.getItem('key'))
		if (keys) 
		{
			setKey(keys.toLowerCase())
		}
		else if(key !== '') {
			localStorage.setItem('key', JSON.stringify(key))
			localStorage.removeItem('tempData')
		}
	}, [key])

	/*Récupération Des données */
	useEffect(() =>  {
		if(key !== '')
		{
			const fetchData = async () => {
				var filteredTokens
				var array
				var rmm
				var dataTokenRealT 
				var dataGlobalToken 
				var dataRealTHistory 
				var dataTransaction
				const storedData = JSON.parse(localStorage.getItem('realt'))
				if (storedData && new Date().getTime() < storedData.expires) {
					filteredTokens = storedData.filteredTokens
					array = storedData.array
					rmm = storedData.rmm
					dataTokenRealT = storedData.dataTokenRealT
					dataGlobalToken = storedData.dataGlobalToken
					dataRealTHistory = storedData.dataRealTHistory
					dataTransaction = storedData.dataTransaction
				}
				else {
					localStorage.removeItem('realt')	
					const {filteredTokens:filteredTokens_,array:array_,rmm:rmm_,dataTokenRealT:dataTokenRealT_,dataGlobalToken:dataGlobalToken_,dataRealTHistory:dataRealTHistory_,dataTransaction:dataTransaction_} = await myFunction()
					filteredTokens = filteredTokens_
					array = array_
					rmm = rmm_
					dataTokenRealT = dataTokenRealT_
					dataGlobalToken = dataGlobalToken_
					dataRealTHistory = dataRealTHistory_
					dataTransaction = dataTransaction_
					const now = new Date()
					localStorage.setItem('realt', JSON.stringify({filteredTokens:filteredTokens,array:array,rmm:rmm,dataTokenRealT:dataTokenRealT,dataGlobalToken:dataGlobalToken,dataRealTHistory:dataRealTHistory,dataTransaction:dataTransaction,expires:now.setHours(23, 59, 59, 999)}))
				}
				setValueRmm(rmm)
				setData(array)
				setHistory(dataRealTHistory)
				var array_realT = []
				for (let i = 0; i < array.length; i++) 
				{
					const currentItem = array[i]
					const dataTokenRealT_ = dataTokenRealT.find(e=>e.gnosisContract && e.gnosisContract.toLowerCase() === currentItem.token.toLowerCase())
					if(dataTokenRealT_ !== undefined) {
						dataTokenRealT_.timeBought = array[i].time
						array_realT.push(dataTokenRealT_)	
					}
				}
				array_realT.sort((a, b) => new Date(a.timeBought) - new Date(b.timeBought))
				setDataRealT(array_realT)
				var arrayTransaction = []
				dataTransaction.forEach(transactions => {
					if(transactions.from === '0xf215af7efd2d90f7492a13c3147defd7f1b41a8e') {
						const date = new Date(parseInt(transactions.timeStamp)*1000)
						const transactionObj = {
							value:transactions.value / Number(1000000000000000000n),
							date:date
						}
						arrayTransaction.push(transactionObj)
					}
				})
				/*Fonction pour regouper les loyer reçu par semaine*/
				var dateRent
				var dateRentBefore
				var dateRentAfter
				var dateWeekBefore
				for(let j = 0;j < filteredTokens.length;j++) {
					if(filteredTokens[j].tokenName.toLowerCase().startsWith("realtoken") && filteredTokens[j].value < Number(1000000000000000000n)) {
						dateRent = new Date(parseInt(filteredTokens[j].timeStamp)*1000)
						dateRent.setHours(0, 0, 0, 0)
						dateRentBefore = new Date(dateRent)
						const dateRentBeforeDay = dateRentBefore.getDay()
						const daysBeforeToday = (dateRentBeforeDay === 0) ? 1 : (8 - dateRentBeforeDay) % 7
						dateRentBefore.setDate(dateRentBefore.getDate()+daysBeforeToday)
						dateRentAfter = new Date(dateRentBefore)
						dateRentAfter.setDate(dateRentAfter.getDate()+6)
						dateRentAfter.setHours(23, 59, 59, 999)
						dateWeekBefore = new Date(dateRentBefore)
						dateWeekBefore.setDate(dateWeekBefore.getDate()-7)
						break
					}	
				}
				const today = new Date()
				const todayDay = today.getDay()
				const daysBeforeToday = todayDay === 0 ? 6:todayDay - 1
				today.setDate(today.getDate() - daysBeforeToday)
				const oneDayInMs = 1000 * 60 * 60 * 24
				const oneWeekInMs = oneDayInMs * 7
				const diffInMs = Math.abs(dateWeekBefore - today)
				const weeks = diffInMs / oneWeekInMs
				const arrayGraph = []
				var rentCumulated = 0
				for(let k = 0;k < Math.round(weeks);k++) {
					const tokenRent = filteredTokens.filter((field) => {
						const dateRentToken = new Date(parseInt(field.timeStamp) * 1000)
						return dateRentToken >= dateRentBefore && dateRentToken <= dateRentAfter
					})
					const transaction = arrayTransaction.find(loc => dateRentBefore.getDate() === loc.date.getDate() && dateRentBefore.getMonth() === loc.date.getMonth() && dateRentBefore.getFullYear() === loc.date.getFullYear())
					const rentNotReinvest = transaction === undefined ? 0 : parseFloat(transaction.value)
					const rentToken = tokenRent.filter(loc => loc.tokenName.toLowerCase().startsWith("realtoken"))
					let rentPrice = 0
					if(rentToken.length > 0)
					{
						rentToken.forEach((tokens) => {
							const data = array_realT.find(loc => loc.gnosisContract.toLowerCase() === tokens.contractAddress.toLowerCase())
							const value = parseInt(tokens.value) / Number(1000000000000000000n)
							if(tokens.tokenName !== 'RealToken RWA Holdings SA, Neuchatel, NE, Suisse') {
								if(!Number.isInteger(value) && tokens.contractAddress !== '0x108f15a6cac5bddf919af07928faa0b7168feff8' && data !== undefined)
								{
									rentPrice += parseFloat(data.tokenPrice)*value
								}
							}
						})
					}
					
					const rentReinvest = rentToken.length === 0 ? 0 : rentPrice
					const rent = rentReinvest + rentNotReinvest
					rentCumulated += rent
					const rentGraphObj = 
					{
						rent:formatNumber(rent,2),
						rentCumulated:formatNumber(rentCumulated,2),
						date:`${dateWeekBefore.getDate().toString().padStart(2,"0")}/${(dateWeekBefore.getMonth()+1).toString().padStart(2,"0")}/${dateWeekBefore.getFullYear()}`
					}
					arrayGraph.push(rentGraphObj)
					dateWeekBefore.setDate(dateWeekBefore.getDate() + 7)
					dateRentBefore.setDate(dateRentBefore.getDate() + 7)
					dateRentAfter.setDate(dateRentAfter.getDate() + 7)
				}
				setRentData(arrayGraph)
				/*let value = 0
				value = new Decimal(response_token.data.result[0].value / Number(1000000000000000000n))
				response_token.data.result.forEach(e=>{
					if(e.from === response_token.data.result[0].to){
						const eValue = new Decimal(e.value / Number(1000000000000000000n))
						value = value.minus(eValue)
					}
				})
				if(value > 0) {
					/*console.log(response_token.data.result[0].tokenName)
					console.log(value)*/
					/*const arrayValue = []
					if(response_token.data.result[0].tokenName !== "RealToken RWA Holdings SA, Neuchatel, NE, Suisse") {
						response_token.data.result.forEach(e=>{
							if(e.from === response_token.data.result[0].to){
								const eValue = new Decimal(e.value / Number(1000000000000000000n))
								const TokenBoughtObj = {
									value:eValue,
									date:e.timeStamp,
									tokenContract:e.contractAddress
								}
								arrayValue.push(TokenBoughtObj)
							}
						})
						arrayTokenBought.push(arrayValue)
					}	
				}*/
			}
			fetchData()
		}
	}, [key,myFunction])
	return {data,dataRealT,key,setKey,valueRmm,history,rentData,tokenBought}
}

export default Data
