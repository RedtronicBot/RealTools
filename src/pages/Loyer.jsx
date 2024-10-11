import React, { useRef,useState } from 'react'
import gear_icon from '../images/icons/gear-solid.svg'
import LineChart from '../components/Chart/Line'
import InteretCompose from '../components/Chart/InteretCompose'
import InteretComposeReel from '../components/Chart/InteretComposeReel'
import LoyerCumules from '../function/LoyerCumules'
import ProchainLoyer from '../function/LoyerData'
import InteretComposeData from '../function/InteretComposeData'
import InteretRealData from '../function/InteretRealData'
import InteretRealAlternateData from '../function/InteretRealAlternateData'
function Loyer({data,dataRealT,setKey}) {
    const [rondayProperties,setRondayProperties] =useState('week')
    const [walletMenu,setWalletmenu] = useState(false)
    const [investmentWeek,setInvestmentWeek] = useState(50)
    const [monthInvestment,setMonthInvestment] = useState(12)
    const [investmentWeekReal,setInvestmentWeekReal] = useState(0)
    const [monthInvestmentReal,setMonthInvestmentReal] = useState(12)
    const [investmentWeekRealAlternative,setInvestmentWeekRealAlternative] = useState(0)
    const [monthInvestmentRealAlternative,setMonthInvestmentRealAlternative] = useState(12)
    const investmentRef = useRef(null)
    const investmentRefAlternative = useRef(null)
    const {rentData} = LoyerCumules(data,dataRealT)
    const {rondayStat,date,rentStat} = ProchainLoyer(data,dataRealT,rondayProperties)
    const {interestData} = InteretComposeData(dataRealT,data,rentData,investmentWeek,monthInvestment)
    const {interestDataProj,realData} = InteretRealData(dataRealT,data,rentData,investmentWeekReal,monthInvestmentReal,setInvestmentWeekReal,investmentRef)
    const {interestDataProjAlternate,realDataAlternate} = InteretRealAlternateData(dataRealT,data,rentData,investmentWeekRealAlternative,monthInvestmentRealAlternative,setInvestmentWeekRealAlternative,investmentRefAlternative)
    /*Formatage des nombres à virgules*/
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
    const onSetKey = (key) =>
    {
        setKey(key)
        setTimeout(() => {
            setWalletmenu(!walletMenu)
        }, 10)
    }
    return(
        <div className='loyer'>
            <h1 className='dashboard_title'>Loyers</h1>
            <div className='dashboard_settings' >
				<img src={gear_icon} alt='filter' width={24} height={24} className='icon' onClick={()=>setWalletmenu(!walletMenu)} />
			</div>
            <div className={`dashboard_settings_key ${walletMenu ? "open":""}`} >
                <div className='map_settings_key'>
                    <input type='text' onChange={(e)=>onSetKey(e.target.value)} />
                    <span>Portefeuille</span>
                </div>
            </div>
            <div className='dashboard_bloc_stats'>
                <div className='dashboard_text_stats'>
                    <div className='dashboard_text_stats_inline_text'>
                        <h2>Prochain Loyer</h2>
                        <select onChange={(e)=>setRondayProperties(e.target.value)} defaultValue='week' className='dashboard_text_stats_select'>
                            <option value='week'>Semaine</option>
                            <option value='month'>Mois</option>
                            <option value='year'>Année</option>
                        </select>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[0].getDate().toString().padStart(2,"0")}/${(date[0].getMonth()+1).toString().padStart(2,"0")}/${date[0].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.first === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.first/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.first/52,2)} $ - ${formatNumber(rondayStat.first/12,2)} $`):(`${formatNumber(rondayStat.first/52,2)} $ - ${formatNumber(rondayStat.first,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[1].getDate().toString().padStart(2,"0")}/${(date[1].getMonth()+1).toString().padStart(2,"0")}/${date[1].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.second === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.second/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.second/52,2)} $ - ${formatNumber(rondayStat.second/12,2)} $`):(`${formatNumber(rondayStat.second/52,2)} $ - ${formatNumber(rondayStat.second,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[2].getDate().toString().padStart(2,"0")}/${(date[2].getMonth()+1).toString().padStart(2,"0")}/${date[2].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.third === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.third/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.third/52,2)} $ - ${formatNumber(rondayStat.third/12,2)} $`):(`${formatNumber(rondayStat.third/52,2)} $ - ${formatNumber(rondayStat.third,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[3].getDate().toString().padStart(2,"0")}/${(date[3].getMonth()+1).toString().padStart(2,"0")}/${date[3].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.fourth === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.fourth/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.fourth/52,2)} $ - ${formatNumber(rondayStat.fourth/12,2)} $`):(`${formatNumber(rondayStat.fourth/52,2)} $ - ${formatNumber(rondayStat.fourth,2)}$`))))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>{date.length > 0 && (`${date[4].getDate().toString().padStart(2,"0")}/${(date[4].getMonth()+1).toString().padStart(2,"0")}/${date[4].getFullYear().toString().padStart(2,"0")}`)}</p>
                        <p>{rondayStat &&(rondayStat.fifth === 0 ?("-"):(rondayProperties === 'week' ?(`${formatNumber(rondayStat.fifth/52,2)} $`):(rondayProperties === 'month' ?(`${formatNumber(rondayStat.fifth/52,2)} $ - ${formatNumber(rondayStat.fifth/12,2)} $`):(`${formatNumber(rondayStat.fifth/52,2)} $ - ${formatNumber(rondayStat.fifth,2)}$`))))}</p>
                    </div>
                </div>
                <div className='dashboard_text_stats'>
                    <h2>Loyers</h2>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Journaliers</p>
                        <p>{rentStat &&(rentStat.rentDaily === 0 ?("-"):(`${formatNumber(rentStat.rentDaily,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Hebdomadaires</p>
                        <p>{rentStat &&(rentStat.rentWeekly === 0 ?("-"):(`${formatNumber(rentStat.rentWeekly,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Mensuels</p>
                        <p>{rentStat &&(rentStat.rentMonthly === 0 ?("-"):(`${formatNumber(rentStat.rentMonthly,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Annuels</p>
                        <p>{rentStat &&(rentStat.rentYearly === 0 ?("-"):(`${formatNumber(rentStat.rentYearly,2)} $`))}</p>
                    </div>
                </div>
                <div className='dashboard_text_stats'>
                    <h2>Loyers Cumulés</h2>
                    <div className='loyer_graph_loyer_cumule'>
                        {rentData.length > 0 && <LineChart datachart={rentData} />}
                    </div>
                </div>
            </div>
            <div className='dashboard_bloc_stats'>
                <div className='loyer_chart'>
                    <div className='loyer_chart_input_bloc'>
                        <h2>Intéret Composés</h2>
                        <div className='loyer_chart_input_bloc_components'>
                            <div className='loyer_chart_input'>
                                <p>Investissement par semaine</p>
                                <div className='loyer_chart_input_components'>
                                    <p>$</p>
                                    <input type='number' defaultValue={50} onChange={(e)=>setInvestmentWeek(e.target.value)}/>
                                </div>
                            </div>
                            <div className='loyer_chart_input'>
                                <p>Nombre de mois</p>
                                <input type='number' defaultValue={12} onChange={(e)=>setMonthInvestment(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                   <div className='loyer_graph_interet'>
                        <InteretCompose datachart={interestData}/>
                    </div>
                </div>
                <div className='loyer_chart'>
                    <div className='loyer_chart_input_bloc'>
                        <h2>Titre</h2>
                        <div className='loyer_chart_input_bloc_components'>
                            <div className='loyer_chart_input'>
                                <p>Investissement par semaine</p>
                                <div className='loyer_chart_input_components'>
                                    <p>$</p>
                                    <input type='number' ref={investmentRef} onChange={(e)=>setInvestmentWeekReal(e.target.value)}/>
                                </div>
                            </div>
                            <div className='loyer_chart_input'>
                                <p>Nombre de mois</p>
                                <input type='number' defaultValue={12} onChange={(e)=>setMonthInvestmentReal(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className='loyer_graph_interet'>
                        <InteretComposeReel datachart={interestDataProj} datareal={realData}/>
                    </div>
                </div>
                <div className='loyer_chart'>
                    <div className='loyer_chart_input_bloc'>
                        <h2>Titre</h2>
                        <div className='loyer_chart_input_bloc_components'>
                            <div className='loyer_chart_input'>
                                <p>Investissement par semaine</p>
                                <div className='loyer_chart_input_components'>
                                    <p>$</p>
                                    <input type='number' ref={investmentRefAlternative} onChange={(e)=>setInvestmentWeekRealAlternative(e.target.value)}/>
                                </div>
                            </div>
                            <div className='loyer_chart_input'>
                                <p>Nombre de mois</p>
                                <input type='number' defaultValue={12} onChange={(e)=>setMonthInvestmentRealAlternative(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className='loyer_graph_interet'>
                        <InteretComposeReel datachart={interestDataProjAlternate} datareal={realDataAlternate}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loyer