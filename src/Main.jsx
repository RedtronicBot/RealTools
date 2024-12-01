import React, { useState,useRef,useEffect } from 'react'
import Data from './function/Data'
import money from './images/icons/money-bill-wave-solid.svg'
import chart from './images/icons/chart-line-solid.svg'
import location_dot from './images/icons/location-dot-solid.svg'
import gear_icon from './images/icons/gear-solid.svg'
import shopping from './images/icons/cart-shopping-solid.svg'
/*Pages*/
import Map from './pages/Map'
import Dashboard from './pages/Dashboard'
import Loyer from './pages/Loyer'
import HistoriqueVente from './pages/HistoriqueVente'
function Main() {
    const {data,dataRealT,key,setKey,valueRmm,history,rentData,tokenBought} = Data()
    const [openBurger,setOpenBurger] = useState(false)
    const burgerRef = useRef(null)
    const [page,setPage] = useState('Dashboard')
    const [walletMenu,setWalletmenu] = useState(false)
    useEffect(()=>{
        if(burgerRef.current)
        {
            const positionInfo = burgerRef.current.getBoundingClientRect()
            openBurger ? burgerRef.current.style.transform = `translateX(0px)`: burgerRef.current.style.transform = `translateX(-${positionInfo.width+10}px)`
        }
    },[openBurger])
    const onSetPage = (page)=>
    {
        setPage(page)
        setOpenBurger(false)
    }
    return (
        <div className='main'>
            <div className='main_menu_burger'>
                <div className='menu_burger' onClick={()=>setOpenBurger(!openBurger)}>
                    <div className={`menu_burger_components ${openBurger ? "open":""}`}></div>
                </div>
                <div className='menu_burger_content' ref={burgerRef}>
                    <div className='menu_burger_icons' onClick={()=>onSetPage('Dashboard')}>
                        <img src={chart} width={32} alt='chart' />
                        <p>Dashboard</p>
                    </div>
                    <div className='menu_burger_icons' onClick={()=>onSetPage('Loyer')}>
                        <img src={money} width={32} alt='money' />
                        <p>Loyer</p>
                    </div>
                    <div className='menu_burger_icons' onClick={()=>onSetPage('Maps')}>
                        <img src={location_dot} width={32} alt='location_dot' />
                        <p>Carte</p>
                    </div>
                    <div className='menu_burger_icons' onClick={()=>onSetPage('Vente')}>
                        <img src={shopping} width={32} alt='location_dot' />
                        <p>Vente</p>
                    </div>
                </div>
            </div>
            <div className='mobile_main'>
                <div className='mobile_menu_burger'>
                    <div className='mobile_menu_burger_icons' onClick={()=>setPage('Dashboard')}>
                        <img src={chart} width={20} alt='chart' />
                        <p>Dashboard</p>
                    </div>
                    <div className='mobile_menu_burger_icons' onClick={()=>setPage('Loyer')}>
                        <img src={money} width={20} alt='money' />
                        <p>Loyer</p>
                    </div>
                    <div className='mobile_menu_burger_icons' onClick={()=>setPage('Maps')}>
                        <img src={location_dot} width={20} alt='location_dot' />
                        <p>Carte</p>
                    </div>
                    <div className='menu_burger_icons' onClick={()=>onSetPage('Vente')}>
                        <img src={shopping} width={20} alt='location_dot' />
                        <p>Vente</p>
                    </div>
                    <div className='mobile_menu_burger_icons' onClick={()=>setWalletmenu(!walletMenu)}>
                        <img src={gear_icon} width={20} alt='gear_icon' />
                        <p>Token</p>
                    </div>
                </div>
                <div className={`mobile_main_key ${walletMenu ? "open":""}`}>
                    <div className='map_settings_key'>
                        <input type='text' onChange={(e)=>setKey(e.target.value)} />
                        <span>Portefeuille</span>
                    </div>
                </div>
            </div>
            {key !== '' ?
                (dataRealT.length > 0?
                (
                    <>
                        {page === 'Dashboard' && (<Dashboard data={data} dataRealT={dataRealT} setKey={setKey} apiKey={key} valueRmm={valueRmm} historyData={history} />)}
                        {page === 'Maps' && (<Map data={data} dataRealT={dataRealT} apiKey={key} setKey={setKey} />)}
                        {page === 'Loyer' && (<Loyer data={data} dataRealT={dataRealT} setKey={setKey} rentData={rentData} />)}
                        {page === 'Vente' && (<HistoriqueVente dataRealT={dataRealT} tokenBought={tokenBought} />)}
                    </>
                ):
                (
                    <div className='map_chargement'>
                        <h2>Chargement</h2>
                        <div className='map_chargement_spinner'></div>
                    </div>
                ))
                :
                (
                    <div className='main_nokey'>
                        <div className='map_marker_details_bloc_settings'>
                            <div className='map_settings'>
                                <img src={gear_icon} alt='filter' width={24} height={24} className='icon' onClick={()=>setWalletmenu(!walletMenu)} />
                            </div>
                            <div className={`map_settings_bloc_key ${walletMenu ? "open":""}`}>
                                <div className='map_settings_key'>
                                    <input type='text' onChange={(e)=>setKey(e.target.value)} />
                                    <span>Portefeuille</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Main