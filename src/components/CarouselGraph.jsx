import React, {useState, useRef} from 'react'
import chevron from '../images/icons/chevron.svg'
function CarouselGraph({LineChartToken,LineChartRent,LineChartYield,LineChartRoi,stats,tokenAlternate,token,rentAlternate,rent,value,yieldDataAlternate,yieldData,yieldInitialAlternate,yieldInitial,roiAlternate,roi}) {
    const carouselRef = useRef(null)
    const [index,setIndex] = useState(0)
	const prevContent = () => {
        const positionInfo = carouselRef.current.getBoundingClientRect()
        const newIndex = index === 0 ? 3 : index - 1
        carouselRef.current.style.transform = `translateX(-${newIndex * positionInfo.width}px)`
        setIndex(newIndex) 
    }
    const afterContent = () => {
        const positionInfo = carouselRef.current.getBoundingClientRect()
        const newIndex = index === 3 ? 0 : index + 1
        carouselRef.current.style.transform = `translateX(-${newIndex * positionInfo.width}px)`
        setIndex(newIndex) 
    }
    return (
        <div className='carousel_graph'>
            <div onClick={()=>prevContent()} className='map_carousel_bouton'><img src={chevron} alt='chevron' height={16} /></div>
            <div className='carousel_graph_bloc_components'>
                <div className='carousel_graph_components' ref={carouselRef}>
                    <LineChartToken datachart={stats?tokenAlternate:token}/>
                    <LineChartRent datachart={stats?rentAlternate:rent} datatoken={stats?tokenAlternate:value} />
                    <LineChartYield datachart={stats?yieldDataAlternate:yieldData} datainitial={stats?yieldInitialAlternate:yieldInitial} />
                    <LineChartRoi datachart={stats?roiAlternate:roi} />
                </div>
            </div>
            <div onClick={()=>afterContent()} className='map_carousel_bouton'><img src={chevron} alt='chevron' height={16} /></div>
        </div>
    )
}

export default CarouselGraph