import { useState,useEffect} from 'react'
import axios from 'axios'
function Data() {
	const [data, setData] = useState([])
	const [dataRealT,setDataRealT] = useState([])
	const [key,setKey] = useState('')
    const [load,setLoad] = useState(0)
	/*Récupération du wallet*/
	useEffect(() => {
		const keys = JSON.parse(localStorage.getItem('key'))
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
			axios.get(`https://api.gnosisscan.io/api?module=account&action=tokentx&address=${key}&startblock=0&endblock=99999999&sort=desc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`)
			.then(response => {
				const filteredTokens = response.data.result
				filteredTokens.forEach((token)=>{
					let tokenValue = Number(token.value)/1000000000000000000
					tokenValue = parseFloat(tokenValue.toFixed(4))
					/*Filtrage et ajout des données */
					if(token.tokenName.startsWith("RealToken") && token.tokenName !== "RealToken RWA Holdings SA, Neuchatel, NE, Suisse" && token.tokenName !== "RealToken Ecosystem Governance")
					{
						if (array.length > 0)
						{
							const index = array.findIndex(arrays => token.contractAddress === arrays.token)
							if(index !== -1)
							{
								if(token.to === "0x0000000000000000000000000000000000000000")
								{
									array[index].to = token.to
								}	
								array[index].value += tokenValue		
							}
							else
							{	
								const dataObj ={
									token:token.contractAddress,
									value:tokenValue,
									to:token.to
								}
								array.push(dataObj)
							}	
						}
						else
						{
							const dataObj ={
								token:token.contractAddress,
								value:tokenValue,
								to:token.to
							}
							array.push(dataObj)	
						}	
					}
				})
				const new_array = array.filter(arrays => arrays.to !== "0x0000000000000000000000000000000000000000")
				array = new_array
				setData(array)
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
		}
	}, [key])
	/*Stockage de la clée publique*/
	useEffect(() => {
		localStorage.setItem('key', JSON.stringify(key))
	}, [key])
	return {data,dataRealT,load,key,setKey}
}

export default Data
