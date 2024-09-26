import { useState,useEffect} from 'react'
import axios from 'axios'
function Data() {
	const [data, setData] = useState([])
	const [dataRealT,setDataRealT] = useState([])
	const [key,setKey] = useState('')
    const [load,setLoad] = useState(0)
	const [valueRmm,setValueRmm] = useState(0) 
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
			var rmm = 0
			axios.get(`https://api.gnosisscan.io/api?module=account&action=tokentx&address=${key}&startblock=0&endblock=99999999&sort=asc&apikey=W1G4J7RANJ8IM5NYF31QZW24J149STFCVE`)
			.then(response => {
				const filteredTokens = response.data.result
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
								if(token.to !== "0xf71ac0a975b66b90b9d21da72498da748a4d46a3")
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
								
								const dataObj ={
									token:token.contractAddress,
									value:tokenValue,
								}
								array.push(dataObj)
							}	
						}
						else
						{
							const dataObj ={
								token:token.contractAddress,
								value:tokenValue,
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
						/*if(array[i].token !== '0x0675e8f4a52ea6c845cb6427af03616a2af42170')
						{*/
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
						/*}*/
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
	return {data,dataRealT,load,key,setKey,valueRmm}
}

export default Data
