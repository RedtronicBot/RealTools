import {useState,useEffect} from 'react'
import LineHistoriqueVente from '../components/Chart/LineHistoriqueVente'
import Decimal from 'decimal.js'
function HistoriqueVente({dataRealT,tokenBought}) {
    const [tokenBoughtData,setTokenBoughtData] = useState([])
    useEffect(()=>{
        const arrayTokenBought = []
        tokenBought.forEach((item,index)=>{
            const firstDate = new Date(tokenBought[index][0].date*1000)
            firstDate.setHours(0,0,0)
            const today = new Date()
            const diffInMs = today - firstDate
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
            
            const arrayData = []
            var value = dataRealT.find(e=>e.gnosisContract.toLowerCase() === tokenBought[index][0].tokenContract).totalTokens
            for(var i = 0;i<parseInt(diffInDays);i++) {
                
                const filtered = tokenBought[index].slice(1).filter(e=>{
                    const dateTokenBought = new Date(e.date*1000)
                    return firstDate.getDate() === dateTokenBought.getDate() && firstDate.getMonth() === dateTokenBought.getMonth() && firstDate.getFullYear() === dateTokenBought.getFullYear()
                })
                let valueLoop = 0
                console.log(filtered)
                filtered.forEach(e=>{
                    valueLoop += e.value
                })
                value += valueLoop
                const filteredObj = {
                    value:value,
                    date:`${firstDate.getDate()}/${firstDate.getMonth()+1}/${firstDate.getFullYear()}`
                }
                arrayData.push(filteredObj)
                firstDate.setDate(firstDate.getDate()+1)
            }
            const tokenObj = {
                contract:tokenBought[index][0].tokenContract,
                data:arrayData
            }
            if(tokenBought[index][0].tokenContract === '0x1d1ce71366866d0785fa40dd30ea92ca5e7078cc') {
                console.log(arrayData)
            }
            arrayTokenBought.push(tokenObj)
        })
        setTokenBoughtData(arrayTokenBought)
    },[tokenBought,dataRealT])
    return (
        <div className='historique_vente'>
            <h1 className='historique_vente_title'>Historique Des Ventes</h1>
            <div className='historique_vente_bloc_location'> 
                {tokenBoughtData.map(e=>{
                    const data = dataRealT.find(el=>el.gnosisContract.toLowerCase() === e.contract)
                    return(
                        <div className='historique_vente_bloc_location_components'>
                            <img src={data.imageLink[0]} alt='' className='historique_vente_bloc_location_components_img'/>
                            <p>{e.contract}</p>
                            <h3>{data.shortName}</h3>
                            <div className='historique_vente_bloc_location_components_graph'>
                                {<LineHistoriqueVente datachart={e.data}/>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default HistoriqueVente