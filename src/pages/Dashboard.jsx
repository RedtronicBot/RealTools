import React, { useEffect, useState } from 'react'
import PieChart from '../components/Chart//Pie'
import info from '../images/icons/info-solid.svg'
import Table from "../components/Table/Table"
import chevron from '../images/icons/chevron.svg'
import gear_icon from '../images/icons/gear-solid.svg'
import DashboardData from '../function/DashboardData'
function Dashboard({data,dataRealT,setKey,valueRmm,historyData}) {
    const [propertiesType,setPropertiesType] = useState([])
    const [propertiesDiversity,setPropertiesDiversity] = useState([])
    const [rondayProperties,setRondayProperties] =useState('week')
    const [tableData,setTableData] = useState([])
    const [typeAffichage,setTypeAffichage] = useState('carte')
    const [typeNumber,setTypeNumber] = useState('25')
    const [slicedData,setSlicedData] = useState([])
    const [index,setIndex] = useState(0)
    const [walletMenu,setWalletmenu] = useState(false)
    const [dataLength,setDataLength] = useState(0)
    const {rentStat,propertiesStat,summaryStat,date,rondayStat,yieldStat} = DashboardData(data,dataRealT,valueRmm,historyData,rondayProperties)
    useEffect(()=>{
        /*Filtrage des donées pour les graphiques*/
        let arrayPropertiesType = []
        let arrayPropertiesDiversity = []
        dataRealT.filter(field=>field.rentStartDate !== null).forEach(loc =>{
            const indexPropertiesType = arrayPropertiesType.findIndex(field=>field.type === loc.propertyTypeName)
            if(indexPropertiesType === -1)
            {
                const dataPropertiesType =
                {
                    type:loc.propertyTypeName,
                    quantity:1
                }
                arrayPropertiesType.push(dataPropertiesType)   
            }
            else
            {
                arrayPropertiesType[indexPropertiesType].quantity += 1    
            }
            const indexPropertiesDiversity = arrayPropertiesDiversity.findIndex(field=>field.type === loc.fullName.split(', ')[1]) 
            if(indexPropertiesDiversity === -1)
            {
                const dataPropertiesDiversity =
                {
                    type:loc.fullName.split(', ')[1],
                    quantity:1
                }
                arrayPropertiesDiversity.push(dataPropertiesDiversity)    
            }
            else
            {
                arrayPropertiesDiversity[indexPropertiesDiversity].quantity += 1    
            }
        })
        setPropertiesType(arrayPropertiesType)
        setPropertiesDiversity(arrayPropertiesDiversity)
        setDataLength(dataRealT.filter(field=>field.rentStartDate !== null).length)
    },[dataRealT])
    /*Génération des données pour le tableau et découpage de l'array de la grille/tableau selon le choix*/
    useEffect(()=>{
        let arrayTable = []
        dataRealT.filter((field)=>field.rentStartDate !== null).forEach(loc => {
            const date = new Date(loc.rentStartDate.date)
            const ArrayObj=
            {
                "propriete":loc.fullName.split(', ')[0],
                "valeur":`${formatNumber(loc.tokenPrice*data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value,2)} $`,
                "prix":`${loc.tokenPrice} $`,
                "rendement":`${loc.annualPercentageYield.toFixed(2)} %`,
                "loyerHebdo":`${(loc.netRentYearPerToken / 52).toFixed(2)} $`,
                "loyerAnnuel":`${loc.netRentYearPerToken.toFixed(2)} $`,
                "logementLoues":`${loc.rentedUnits}/${loc.totalUnits} (${formatNumber((loc.rentedUnits/loc.totalUnits)*100,2)} %)`,
                "premierLogement":`${date.getDate().toString().padStart(2,"0")}/${(date.getMonth()+1).toString().padStart(2,"0")}/${date.getFullYear()}`
            }
            arrayTable.push(ArrayObj)
        })
        const result = []
        const resultData = []
        const size = parseInt(typeNumber)
        if(dataRealT.filter(field=>field.rentStartDate !== null).length > size)
        {
            for (let i = 0; i < dataRealT.filter(field=>field.rentStartDate !== null).length; i += size) 
            {
                result.push(arrayTable.slice(i, i + size))
                resultData.push(dataRealT.filter(field=>field.rentStartDate !== null).slice(i,i + size))
            }
            setTableData(result)
            setSlicedData(resultData)
        }
        else
        {
            setTableData(arrayTable)
            setSlicedData(dataRealT.filter(field=>field.rentStartDate !== null))
        }
    },[data,dataRealT,typeNumber])
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
    /*Colonne du tableau*/
    const columns = [
        { label: "Propriété", accessor: "propriete" },
        { label: "Valeur", accessor: "valeur" },
        { label: "Prix", accessor: "prix" },
        { label: "Rendement", accessor: "rendement" },
        { label: "Loyer Hebdo", accessor: "loyerHebdo" },
        { label: "Loyer Annuel", accessor: "loyerAnnuel" },
        { label: "Logement Loués", accessor: "logementLoues" },
        { label: "Date du premier logement", accessor: "premierLogement" },
    ]
    /*Fonction avant/arrière pour les cartes/tableau*/
    const prevContent = () => {
        const newIndex = index === 0 ? tableData.length - 1:index - 1
        setIndex(newIndex) 
    }
    const afterContent = () => {
        const newIndex = index === tableData.length - 1 ? 0:index + 1
        setIndex(newIndex) 
    }
    const onSetTypeNumber = (value) =>
    {
        setTypeNumber(value)
        setIndex(0)
    }
    const onSetKey = (key) =>
    {
        setKey(key)
        setTimeout(() => {
            setWalletmenu(!walletMenu)
        }, 10)
    }
    return (
        <div className='dashboard'>
            <h1 className='dashboard_title'>Realtools Dashboard</h1>
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
                    <h2>Résumé</h2>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Valeur nette</p>
                        <p>{summaryStat &&(summaryStat.netValue === 0 ?("-"):(`${formatNumber(summaryStat.netValue,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>RealTokens</p>
                        <p>{summaryStat &&(summaryStat.realToken === 0 ?("-"):(`${formatNumber(summaryStat.realToken,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Dépôt RMM</p>
                        <p>{valueRmm &&(valueRmm === 0 ?("-"):(`${formatNumber(valueRmm,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>RWA</p>
                        <p>{summaryStat &&(summaryStat.rwa === 0 ?("-"):(`${formatNumber(summaryStat.rwa,2)} $`))}</p>
                    </div>
                </div>
                <div className='dashboard_text_stats'>
                    <h2>Propriétés</h2>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Tokens</p>
                        <p>{propertiesStat &&(propertiesStat.tokens === 0 ?("-"):(formatNumber(propertiesStat.tokens,2)))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Propriétés</p>
                        <p>{propertiesStat &&(propertiesStat.properties === 0 ?("-"):(propertiesStat.properties))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Prix d'achat moyen</p>
                        <p>{propertiesStat &&(propertiesStat.averagePriceBought === 0 ?("-"):(`${formatNumber(propertiesStat.averagePriceBought,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Valeur moyenne</p>
                        <p>{propertiesStat &&(propertiesStat.averageValue === 0 ?("-"):(`${formatNumber(propertiesStat.averageValue,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Loyer annuel moyen</p>
                        <p>{propertiesStat &&(propertiesStat.averageYearlyRent === 0 ?("-"):(`${formatNumber(propertiesStat.averageYearlyRent,2)} $`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <p>Logement loués</p>
                        <p>{propertiesStat &&(propertiesStat.totalUnits === 0 ?("-"):(`${(propertiesStat.rentedUnits)}/${(propertiesStat.totalUnits)} (${formatNumber((propertiesStat.rentedUnits/propertiesStat.totalUnits)*100,2)} %)`))}</p>
                    </div>
                </div>
                <div className='dashboard_text_stats'>
                    <h2>Rendement</h2>
                    <div className='dashboard_text_stats_inline_text'>
                        <div className='dashboard_text_stats_info_bloc'>
                            <p>Rendement annuel actuel</p>
                            <div className='dashboard_text_stats_info_border'>
                                <img src={info} alt='' className='dashboard_text_stats_info' height={14} width={6} />
                                <span>Prends en compte si le logement est louée</span>
                            </div>
                        </div>
                        <p>{yieldStat &&(yieldStat.yieldActual === 0 ?("-"):(`${formatNumber(yieldStat.yieldActual,2)} %`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <div className='dashboard_text_stats_info_bloc'>
                            <p>Rendement annuel</p>
                            <div className='dashboard_text_stats_info_border'>
                                <img src={info} alt='' className='dashboard_text_stats_info' height={14} width={6} />
                                <span>Rendement total sans prendre compte de la date de location</span>
                            </div>
                        </div>
                        <p>{yieldStat &&(yieldStat.yield === 0 ?("-"):(`${formatNumber(yieldStat.yield,2)} %`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <div className='dashboard_text_stats_info_bloc'>
                            <p>Rendement 100% loué</p>
                            <div className='dashboard_text_stats_info_border'>
                                <img src={info} alt='' className='dashboard_text_stats_info' height={14} width={6} />
                                <span>Basée sur le dernier rendement du logement complet ou le rendement initial si jamais louée</span>
                            </div>
                        </div>
                        <p>{yieldStat &&(yieldStat.yieldFull === 0 ?("-"):(`${formatNumber(yieldStat.yieldFull,2)} %`))}</p>
                    </div>
                    <div className='dashboard_text_stats_inline_text'>
                        <div className='dashboard_text_stats_info_bloc'>
                            <p>Rendement initial</p>
                            <div className='dashboard_text_stats_info_border'>
                                <img src={info} alt='' className='dashboard_text_stats_info' height={14} width={6} />
                                <span>Rendement donée par RealT</span>
                            </div>
                        </div>
                        <p>{yieldStat &&(yieldStat.yieldInitial === 0 ?("-"):(`${formatNumber(yieldStat.yieldInitial,2)} %`))}</p>
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
            </div>
            <div className='dashboard_bloc_stats'>
                <div className='dashboard_chart'>
                    <h2>Type de propriété</h2>
                    <PieChart datachart={propertiesType} dataLength={dataLength} />
                </div> 
                <div className='dashboard_chart'>
                    <h2>Localisation des propriétés</h2>
                    <PieChart datachart={propertiesDiversity} dataLength={dataLength} />
                </div>   
            </div>
            <div className='dashboard_bloc_select'>
                <div className='dashboard_bloc_select_component'>
                    <p>Affichage</p>
                    <select defaultValue='carte' onChange={(e)=>setTypeAffichage(e.target.value)} className='dashboard_select'>
                        <option value='carte'>Carte</option>
                        <option value='tableau'>Tableau</option>
                    </select>
                </div>
            </div>
            {typeAffichage === 'carte' ?
                (
                    <div className='dashboard_bloc_stats'>
                        {slicedData.length > 0 && (slicedData[index][0] !== undefined ?slicedData[index]:slicedData).map((field,index)=>{
                            const date = new Date(field.rentStartDate.date)
                            let yieldFull = 0
                            let yieldInitial = 0
                                
                                var history = historyData.find(obj => obj.uuid.toLowerCase() === field.gnosisContract.toLowerCase())
                                for(var j = history.history.length-1;j >= 0;j--)
                                {  
                                    if((history.history[j].values.rentedUnits !== undefined && history.history[j].values.rentedUnits === field.totalUnits && history.history[j].values.netRentYear !== undefined) || (history.history[j].values.rentedUnits === undefined && history.history[j].values.netRentYear !== undefined) || (field.rentalType === 'pre_construction' && history.history[j].values.netRentYear !== undefined) || (field.productType === "loan_income" && history.history[j].values.netRentYear !== undefined))
                                    {
                                        if(field.rentalType === 'pre_construction')
                                        {
                                            yieldFull = (history.history[0].values.netRentYear/history.history[0].values.totalInvestment)*100
                                        }
                                        else
                                        {
                                            yieldFull = (history.history[j].values.netRentYear/history.history[0].values.totalInvestment)*100
                                        }
                                        break 
                                    }
                                }
                                yieldInitial = (history.history[0].values.netRentYear/history.history[0].values.totalInvestment)*100

                            return(<div className='dashboard_grid' key={index}>
                                <img src={field.imageLink[0]} alt='' className='dashboard_grid_img'/>
                                <div className='dashboard_title_bloc'>
                                    <p>{field.fullName.split(', ')[0]}</p>
                                    <p className='dashboard_title_bloc_price'>{formatNumber(field.tokenPrice*data.filter((dataField) => dataField.token === field.gnosisContract.toLowerCase())[0]?.value,2)} $</p>
                                </div>
                                <div className='dashboard_title_bloc_components'>
                                    {formatNumber((parseInt(field.rentedUnits)/parseInt(field.totalUnits))*100,2) === '100' ?(<div className='dashboard_title_bloc_rent'><div className='dashboard_title_bloc_rent_green'></div><p>Louée</p></div>):(formatNumber((parseInt(field.rentedUnits)/parseInt(field.totalUnits))*100,2)>0?(<div className='dashboard_title_bloc_rent'><div className='dashboard_title_bloc_rent_orange'></div><p>Partiellement Louée</p></div>):(<div className='dashboard_title_bloc_rent'><div className='dashboard_title_bloc_rent_red'></div><p>Non Louée</p></div>))}
                                    {field.section8paid > 0 && <p className='dashboard_title_bloc_rent'>Subventionnée</p>}
                                </div>
                                <div className='dashboard_grid_bloc_text'>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Token</p>
                                        <p>{formatNumber((data.filter((dataField) => dataField.token === field.gnosisContract.toLowerCase()))[0]?.value,2)}/{field.totalTokens}</p>
                                    </div>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Rendement Annuel</p>
                                        <p>{formatNumber(field.annualPercentageYield,2)} %</p>
                                    </div>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Loyers hebdomadaires</p>
                                        <p>{formatNumber(parseFloat((field.netRentYearPerToken).toFixed(2)*(data.filter((dataField) => dataField.token === field.gnosisContract.toLowerCase()))[0]?.value)/52,2)} $</p>
                                    </div>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Loyers annuels</p>
                                        <p>{formatNumber(parseFloat((field.netRentYearPerToken).toFixed(2)*(data.filter((dataField) => dataField.token === field.gnosisContract.toLowerCase()))[0]?.value),2)} $</p>
                                    </div>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Logements loués</p>
                                        <p>{field.rentedUnits}/{field.totalUnits} ({formatNumber((parseInt(field.rentedUnits)/parseInt(field.totalUnits))*100,2)} %)</p>
                                    </div>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Date du premier logement</p>
                                        <p>{(date.getDate()).toString().padStart(2,"0")}/{(date.getMonth()+1).toString().padStart(2,"0")}/{date.getFullYear()}</p>
                                    </div>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Rendement 100% louée</p>
                                        <p>{formatNumber(yieldFull,2)} %</p>
                                    </div>
                                    <div className='dashboard_text_stats_inline_text'>
                                        <p>Rendement initial</p>
                                        <p>{formatNumber(yieldInitial,2)} %</p>
                                    </div>
                                </div>
                            </div>
                        )})}    
                    </div>
                ):
                (
                    tableData.length > 0 && <Table columns={columns} tableData1={tableData[index]} key={index} />
                )
            }
            <div className='dashboard_bloc_pagination'>
                {dataRealT.filter(field=>field.rentStartDate !== null).length > parseInt(typeNumber) ?
                    (
                        <div className='dashboard_bloc_pagination_components'>
                            <div className='dashboard_bloc_pagination_components_img rotate'>
                                <img src={chevron} onClick={()=>prevContent()} alt='chevron' height={18} />
                            </div>
                            {slicedData.map((indexNum,idx)=>{
                                return(<p key={indexNum[0].gnosisContract} className={`dashboard_bloc_pagination_components_page ${index === idx && 'selected'}`} onClick={()=>setIndex(idx)}>{idx+1}</p>)
                            })}
                            <div className='dashboard_bloc_pagination_components_img'>
                                <img src={chevron} onClick={()=>afterContent()} alt='chevron' height={18} />
                            </div>
                        </div>
                    ):
                    (
                        <div className='dashboard_bloc_pagination_components'>
                            <div className='dashboard_bloc_pagination_components_img rotate'>
                                <img src={chevron} alt='chevron' height={18} />
                            </div>
                            <p>1</p>
                            <div className='dashboard_bloc_pagination_components_img'>
                                <img src={chevron} alt='chevron' height={18} />
                            </div>
                        </div>    
                    )
                }
                <select defaultValue='25' onChange={(e)=>onSetTypeNumber(e.target.value)} className='dashboard_select'>
                    <option value='25'>25</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                    <option value='200'>200</option>
                </select>
            </div>
        </div>
    )
}

export default Dashboard