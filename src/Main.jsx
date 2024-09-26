import React, { useState,useRef,useEffect } from 'react'
import Data from './function/Data'
/*import house from './images/icons/house-solid.svg'*/
import chart from './images/icons/chart-line-solid.svg'
import location_dot from './images/icons/location-dot-solid.svg'
/*Pages*/
import Map from './pages/Map'
import Dashboard from './pages/Dashboard'
function Main() {
    const {data,dataRealT,load,key,setKey,valueRmm} = Data()
    const [openBurger,setOpenBurger] = useState(false)
    const burgerRef = useRef(null)
    const [page,setPage] = useState('Dashboard')
    useEffect(()=>{
        if(burgerRef.current)
        {
            const positionInfo = burgerRef.current.getBoundingClientRect()
            openBurger ? burgerRef.current.style.transform = `translateX(0px)`: burgerRef.current.style.transform = `translateX(-${positionInfo.width+10}px)`
        }
    },[openBurger])
    return (
        <div className='main'>
            <div className='main_menu_burger'>
                <div className='menu_burger' onClick={()=>setOpenBurger(!openBurger)}>
                    <div className={`menu_burger_components ${openBurger ? "open":""}`}></div>
                </div>
                <div className='menu_burger_content' ref={burgerRef}>
                    <div className='menu_burger_icons' onClick={()=>setPage('Dashboard')}>
                        <img src={chart} width={32} alt='chart' />
                        <p>Dashboard</p>
                    </div>
                    <div className='menu_burger_icons' onClick={()=>setPage('Maps')}>
                        <img src={location_dot} width={32} alt='chart' />
                        <p>Carte</p>
                    </div>
                </div>
            </div>
            {dataRealT.length > 0 ?
            (
                <>
                    {page === 'Dashboard' && (<Dashboard data={data} dataRealT={dataRealT} apiKey={key} setKey={setKey} valueRmm={valueRmm} />)}
                    {page === 'Maps' && (<Map data={data} dataRealT={dataRealT} apiKey={key} setKey={setKey} />)}
                </>
            ):
            (
                <div className='map_chargement'>
                    <h2>Loading</h2>
                    <div className='map_chargement_spinner'></div>
                    {data.length === 0 ?(<h3>0 %</h3>):(<h3>{parseInt((load/data.length)*100)} %</h3>)}
				</div>
            )}
            
        </div>
    )
}

export default Main