import React, { useState,useRef,useEffect } from 'react'
import Map from './pages/Map'
import Data from './function/Data'
/*import house from './images/house-solid.svg'
import chart from './images/chart-line-solid.svg'
import location_dot from './images/location-dot-solid.svg'*/
function Main() {
    const {data,dataRealT,load,key,setKey} = Data()
    const [openBurger,setOpenBurger] = useState(false)
    const burgerRef = useRef(null)
    useEffect(()=>{
        const positionInfo = burgerRef.current.getBoundingClientRect()
        openBurger ? burgerRef.current.style.transform = `translateX(0px)`: burgerRef.current.style.transform = `translateX(-${positionInfo.width+10}px)`
    },[openBurger])
    return (
        <div className='main'>
            <div className='main_menu_burger'>
                <div className='menu_burger' onClick={()=>setOpenBurger(!openBurger)}>
                    <div className={`menu_burger_components ${openBurger ? "open":""}`}></div>
                </div>
                <div className='menu_burger_content' ref={burgerRef}>
                </div>
            </div>
            <Map data={data} dataRealT={dataRealT} load={load} apiKey={key} setKey={setKey} />
        </div>
    )
}

export default Main