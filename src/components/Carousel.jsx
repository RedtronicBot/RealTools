import React, { useState, useRef } from "react"
import chevron from "../images/icons/chevron.svg"
function Carousel({ img, name, selectedLocation, onIndexLocation }) {
	const carouselRef = useRef(null)
	const [index, setIndex] = useState(0)
	const [indexLocation, setIndexLocation] = useState(0)
	const prevContent = () => {
		const positionInfo = carouselRef.current.getBoundingClientRect()
		const newIndex = index === 0 ? img.length - 1 : index - 1
		carouselRef.current.style.transform = `translateX(-${newIndex * positionInfo.width}px)`
		setIndex(newIndex)
	}
	const afterContent = () => {
		const positionInfo = carouselRef.current.getBoundingClientRect()
		const newIndex = index === img.length - 1 ? 0 : index + 1
		carouselRef.current.style.transform = `translateX(-${newIndex * positionInfo.width}px)`
		setIndex(newIndex)
	}
	const prevLocation = () => {
		const newIndex = indexLocation === 0 ? selectedLocation.length - 1 : indexLocation - 1
		setIndexLocation(newIndex)
		onIndexLocation(newIndex)
	}
	const nextLocation = () => {
		const newIndex = indexLocation === selectedLocation.length - 1 ? 0 : indexLocation + 1
		setIndexLocation(newIndex)
		onIndexLocation(newIndex)
	}
	return (
		<div className="map_carousel">
			<div onClick={() => prevContent()} className="map_carousel_bouton">
				<img src={chevron} alt="chevron" height={16} />
			</div>
			{selectedLocation.length > 1 && (
				<div className="map_carousel_same_location">
					<div onClick={() => prevLocation()} className="map_carousel_same_location_compontents">
						<img src={chevron} alt="chevron" height={12} />
					</div>
					<div className="map_carousel_same_location_compontents">
						<p>{indexLocation + 1}</p>
					</div>
					<div onClick={() => nextLocation()} className="map_carousel_same_location_compontents">
						<img src={chevron} alt="chevron" height={12} />
					</div>
				</div>
			)}
			<div className="map_carousel_bloc_components">
				<div className="map_carousel_components" ref={carouselRef}>
					{img.map((images, index) => (
						<img key={index} src={images} alt={name} className="map_marker_details_img" />
					))}
				</div>
			</div>
			<div onClick={() => afterContent()} className="map_carousel_bouton">
				<img src={chevron} alt="chevron" height={16} />
			</div>
		</div>
	)
}

export default Carousel
