import { useState,useEffect} from 'react'
import axios from 'axios'
function Data() {
	const [data, setData] = useState([])
	const [dataRealT,setDataRealT] = useState([])
	const [key,setKey] = useState('')
    const [load,setLoad] = useState(0)
	const [valueRmm,setValueRmm] = useState(0) 
	const [history,setHistory] = useState([])
	const [gnosisData,setGnosisData] = useState(null)
	const [internalTransaction,setInternalTransaction] = useState([])
	const [rentData,setRentData] =useState([])
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
	/*Récupération du wallet*/
	useEffect(() => {
		const keys = JSON.parse(localStorage.getItem('key').toLowerCase())
		if (keys) 
		{
			setKey(keys)
		}
	}, [])
	/*Récupération Des données */
	useEffect(() => {
		if(key)
		{
			setData([])
			setDataRealT([])
			/*Récupération des token gnosiss */
			var array = []
			var arrayTransaction = []
			var rmm = 0
			axios.get(`https://api.gnosisscan.io/api?module=account&action=tokentx&address=${key}&startblock=0&endblock=99999999&sort=asc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`)
			.then(response => {
				const filteredTokens = response.data.result
				setGnosisData(filteredTokens)
				filteredTokens.forEach((token)=>{
					let tokenValue = Number(token.value)/Number(1000000000000000000n)
					if(token.tokenName === 'RealToken RWA Holdings SA, Neuchatel, NE, Suisse')
					{
						tokenValue = Number(token.value)/1000000000	
					}
					tokenValue = parseFloat(tokenValue.toFixed(4))
					/*Filtrage et ajout des données */
					if(token.contractAddress.toLowerCase() === "0xE7F4BFA5B66E5dC1Be1d4d424eaBa414f03A295E".toLowerCase())
					{
						var tokenValueTest = Number(token.value)/Number(1000000000000000000n)
						console.log(token.value)
						console.log(tokenValueTest)
					}
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
				setData(array)
				setValueRmm(rmm)
				/*Récupération des données RealT sur les locations*/
				const fetchTokenData = async () => {
					var array_realT = []
					for (let i = 0; i < array.length; i++) 
					{
						try {
							const response = await axios.get(`https://api.realt.community/v1/token/${array[i].token}`, {
								headers: {
									'X-AUTH-REALT-TOKEN': 'b65e9f9f-preprod-14ae-676b-9256697b1e3e'
								}
							})
							if(response.data.length !== 0)
							{
								response.data.timeBought = array[i].time
								array_realT.push(response.data)
							}
						} 
						catch (error)
						{
							console.error(error)
						}
						setLoad(i + 1)
						await new Promise(resolve => setTimeout(resolve, 150))
					}
					setDataRealT(array_realT)
				}
				fetchTokenData()	
			})
			.catch(error => {
				console.error(error)
			})
			axios.get(`https://api.realt.community/v1/tokenHistory`, {
				headers: {
					'X-AUTH-REALT-TOKEN': 'b65e9f9f-preprod-14ae-676b-9256697b1e3e'
				}
			})
			.then(response=>{
				setHistory(response.data)
			})
			.catch(err=>console.error(err))
			axios.get(`https://api.gnosisscan.io/api?module=account&action=txlistinternal&address=${key}&startblock=0&endblock=99999999&sort=asc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`)
			.then(response=>{
				const filteredTransaction = response.data.result
				filteredTransaction.forEach(transactions => {
					if(transactions.from === '0xf215af7efd2d90f7492a13c3147defd7f1b41a8e') {
						const date = new Date(parseInt(transactions.timeStamp)*1000)
						const transactionObj = {
							value:transactions.value / Number(1000000000000000000n),
							date:date
						}
						arrayTransaction.push(transactionObj)
					}
				})
				
			})
			.catch(err=>console.error(err))
			setInternalTransaction(arrayTransaction)
		}
	}, [key])
	useEffect(()=>{
		
		if(gnosisData !== null && dataRealT.length > 0) {
			var dateRent
			var dateRentBefore
			var dateRentAfter
			for(let j = 0;j < gnosisData.length;j++) {
				if(gnosisData[j].tokenName.toLowerCase().startsWith("realtoken") && gnosisData[j].value < Number(1000000000000000000n)) {
					dateRent = new Date(parseInt(gnosisData[j].timeStamp)*1000)
					dateRent.setHours(0, 0, 0, 0)
					dateRentBefore = new Date(dateRent)
					const dateRentBeforeDay = dateRentBefore.getDay()
					const daysBeforeToday = dateRentBeforeDay === 0 ? 6:dateRentBeforeDay - 1
					dateRentBefore.setDate(dateRentBefore.getDate()-daysBeforeToday)
					dateRentAfter = new Date(dateRent)
					dateRentAfter.setDate(dateRentAfter.getDate()+6)
					dateRentAfter.setHours(23, 59, 59, 999)
					break
				}	
			}
			const today = new Date()
			const todayDay = today.getDay()
			const daysBeforeToday = todayDay === 0 ? 6:todayDay - 1
			today.setDate(today.getDate() - daysBeforeToday)
			const oneDayInMs = 1000 * 60 * 60 * 24
			const oneWeekInMs = oneDayInMs * 7
			const diffInMs = Math.abs(dateRentBefore - today)
			const weeks = diffInMs / oneWeekInMs
			const arrayGraph = []
			var rentCumulated = 0
			for(let k = 0;k < Math.round(weeks);k++) {
				const tokenRent = gnosisData.filter((field) => {
					const dateRentToken = new Date(parseInt(field.timeStamp) * 1000)
					return dateRentToken >= dateRentBefore && dateRentToken <= dateRentAfter
				})
				const transaction = internalTransaction.find(loc => dateRentBefore.getDate() === loc.date.getDate() && dateRentBefore.getMonth() === loc.date.getMonth() && dateRentBefore.getFullYear() === loc.date.getFullYear())
				const rentNotReinvest = transaction === undefined ? 0 : parseFloat(transaction.value)
				const rentToken = tokenRent.filter(loc => loc.tokenName.toLowerCase().startsWith("realtoken"))
				let rentPrice = 0
				if(rentToken.length > 0)
				{
					rentToken.forEach((tokens) => {
						const data = dataRealT.find(loc => loc.gnosisContract.toLowerCase() === tokens.contractAddress.toLowerCase())
						const value = parseInt(tokens.value) / Number(1000000000000000000n)
						if(tokens.tokenName !== 'RealToken RWA Holdings SA, Neuchatel, NE, Suisse') {
							if(!Number.isInteger(value) && tokens.contractAddress !== '0x108f15a6cac5bddf919af07928faa0b7168feff8')
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
					date:`${dateRentBefore.getDate().toString().padStart(2,"0")}/${(dateRentBefore.getMonth()+1).toString().padStart(2,"0")}/${dateRentBefore.getFullYear()}`
				}
				arrayGraph.push(rentGraphObj)
				dateRent.setDate(dateRent.getDate() + 7)
				dateRentBefore.setDate(dateRentBefore.getDate() + 7)
				dateRentAfter.setDate(dateRentAfter.getDate() + 7)
			}
			setRentData(arrayGraph)
		}
	},[dataRealT,gnosisData,internalTransaction])
	/*Stockage de la clée publique*/
	useEffect(() => {
		localStorage.setItem('key', JSON.stringify(key))
	}, [key])
	return {data,dataRealT,load,key,setKey,valueRmm,history,rentData}
}

export default Data
