
import { useState,useEffect,useRef } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../style/style.css'
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Carousel from '../components/Carousel'
/*Icones */
import red_marker from '../images/icons/red_marker.png'
import filter_icon from '../images/icons/filter-solid.svg'
import gear_icon from '../images/icons/gear-solid.svg'
import cross from '../images/icons/x-solid.svg'
import refresh from '../images/icons/arrows-rotate-solid.svg'
import house from '../images/icons/house-solid.svg'
import search from '../images/icons/magnifying-glass-solid.svg'
/*Marker */
import single_family from '../images/marker/house-user-solid.svg'
import multi_family from '../images/marker/people-roof-solid.svg'
import duplex from '../images/marker/duplex.png'
import portfolio from '../images/marker/portfolio.png'
import building from '../images/marker/building-solid.svg'
import quadplex from '../images/marker/quadplex.png'
import commercial from '../images/marker/store-solid.svg'
function Map({data,dataRealT,load,apiKey,setKey}) {
	const [selectedLocation, setSelectedLocation] = useState(null)
	const [indexLocation,setIndexLocation] = useState(0)
	const [open,setOpen] = useState(false)
	const markerDetailsRef = useRef(null)
	const [filter,setFilter] = useState(false)
	const [walletMenu,setWalletmenu] = useState(false)
	const [rentedUnits,setRentedUnits] = useState('')
	const [yieldRent,setYieldRent] = useState(null)
	const [rentStarted,setRentStarted] = useState(null)
	const [houseNumber,setHouseNumber] = useState([])
	const [adresses,setAdresses] = useState([])
	const [filteredAdresses,setFilteredAdresses] = useState([])
	const searchBarRef = useRef(null)
	const [activeMarkerId, setActiveMarkerId] = useState(null)
	const mapRef = useRef(null)
	const handleIndex = (index) =>{
		setIndexLocation(index)
	}
	/*Fonction gérant l'ajout de marqueur et de leurs détails plus du Marker Renderer*/
	const createClusterCustomIcon = (cluster) => {
		const count = cluster.getChildCount();
		return L.divIcon({
		  	html: `<div>${count}</div>`,
		  	className: 'map_cluster',  
		  	iconSize: L.point(40, 40, true)
		})
	}
	useEffect(()=>{
		let dataRealTFilter = dataRealT
		if (rentedUnits === 'Full') {
		  	dataRealTFilter = dataRealT.filter((field) => field.rentedUnits === field.totalUnits)
		}
		else if(rentedUnits === 'Partial')
		{
			dataRealTFilter = dataRealT.filter((field) => field.rentedUnits < field.totalUnits && field.rentedUnits !== 0)
		}
		else if(rentedUnits === 'Empty')
		{
			dataRealTFilter = dataRealT.filter((field) => field.rentedUnits === 0)	
		}
		if(yieldRent)	
		{
			if(yieldRent >= 0)
			{
				dataRealTFilter = dataRealT.filter((field) => field.annualPercentageYield > yieldRent)
			}
			else
			{
				dataRealTFilter = dataRealT.filter((field) => field.annualPercentageYield < Math.abs(yieldRent))
			}	
				
		}
		if(rentStarted)
		{
			dataRealTFilter = dataRealT.filter((field) => 
			{
				const now = Date.now()
				const date = field.rentStartDate.date
				const newDate = date.replace(' ', 'T')
				const rentDate = new Date(newDate)
				return now > rentDate.getTime()
			})
		}
		else if(!rentStarted && rentStarted !== null)
		{
			dataRealTFilter = dataRealT.filter((field) => 
			{
				const now = Date.now()
				const date = field.rentStartDate.date
				const newDate = date.replace(' ', 'T')
				const rentDate = new Date(newDate)
				return now < rentDate.getTime()
			})	
		}
		setHouseNumber(dataRealTFilter)
	},[rentedUnits,yieldRent,rentStarted,dataRealT])
	// Créer une icône personnalisée pour le marqueur
	const getIcon = (location) => {
		let markerIcon = red_marker
		if (location && location.propertyTypeName) {
			switch (location.propertyTypeName) {
				case "Single Family":
					markerIcon = single_family
					break
				case "Multi Family":
					markerIcon = multi_family 
					break
				case "Duplex":
					markerIcon = duplex 
					break
				case "SFR Portfolio":
					markerIcon = portfolio 
					break
				case "Condominium":
					markerIcon = building 
					break
				case "Quadplex":
					markerIcon = quadplex 
					break
				case "Commercial":
				markerIcon = commercial 
					break
				default:
					markerIcon = red_marker
			}
		}
		return L.divIcon({
			className: ``,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			html: `<img src="${markerIcon}" height="24px" class="${activeMarkerId !== null && location.coordinate.lat === activeMarkerId.lat && location.coordinate.lng === activeMarkerId.lng ? "map_marker" : ""}" />`, 
		})
	}
	
	const handleMarkerClick = (loc) => {
		const array_location = []
		setOpen(true)
		setFilter(false)
		setWalletmenu(false)
		setActiveMarkerId(loc.coordinate)
		const date = new Date(loc.rentStartDate.date)
		const locationObj = {
			price: loc.tokenPrice,
			totalToken: loc.totalTokens,
			name: loc.fullName,
			image: loc.imageLink,
			totalInvestment: loc.totalInvestment,
			netRentYearPerToken: loc.netRentYearPerToken.toFixed(2),
			netRentWeekPerToken: (loc.netRentYearPerToken / 52).toFixed(2),
			annualPercentageYield: loc.annualPercentageYield,
			propertyTypeName: loc.propertyTypeName,
			squareFeet: loc.squareFeet,
			bedroomBath: loc.bedroomBath,
			rentedUnits: loc.rentedUnits,
			totalUnits: loc.totalUnits,
			section8paid: loc.section8paid,
			rentStartDate: date,
			constructionYear: loc.constructionYear,
			rentalType: loc.rentalType,
			contract: loc.gnosisContract,
			ownedToken: (data.filter((field) => field.token === loc.gnosisContract.toLowerCase()))[0]?.value,
			marketplaceLink: loc.marketplaceLink,
		}
		array_location.push(locationObj)
		setSelectedLocation(array_location)
		const map = mapRef.current
		if (map) 
		{
			map.setView([loc.coordinate.lat, loc.coordinate.lng], 20)
		}
	}
	/*Fonction qui formate uniquement les nombres à virgules*/
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
	/*Animation du Détail du marqueur à l'ouverture/fermeture */
	useEffect(()=>{
		const positionInfo = markerDetailsRef.current.getBoundingClientRect()
		if(open)
		{
			markerDetailsRef.current.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)'
		}
		open ? markerDetailsRef.current.style.transform = `translateX(0px)`: markerDetailsRef.current.style.transform = `translateX(${positionInfo.width+10}px)`	
	},[open])

	const onSetKey = (key) =>
	{
		setKey(key)
		setTimeout(() => {
			setWalletmenu(!walletMenu)
		}, 10)
	}
	/*Reset des filtre lors du choix d'un autre filtre */
	const onSetRentStarted = () =>
	{
		if(rentStarted === null)
		{
			setRentStarted(true)
			setRentedUnits('')
			setYieldRent(null)
		}
		else
		{
			setRentStarted(!rentStarted)
		}
	}
	const onSetRentedUnits = (value) =>
	{
		setRentStarted(null)
		setRentedUnits(value)
		setYieldRent(null)
	}
	const onSetYieldRent = (value) =>
	{
		setRentStarted(null)
		setRentedUnits('')
		setYieldRent(value)
	}
	const setReload = () =>
	{
		setRentStarted(null)
		setRentedUnits('')
		setYieldRent(null)
	}
	/*Gestion fermeture de l'autre menu dans la partie Wallet/Filter */
	const onSetWallet = () =>
	{
		setFilter(false)
		setWalletmenu(!walletMenu)
	}
	const onSetFilter = () =>
	{
		setFilter(!filter)
		setWalletmenu(false)
	}
	useEffect(()=>{
		setOpen(false)
		setReload()	
	},[apiKey])
	/*Récupération des adresses des maisons */
	useEffect(()=>{
		let array_adress = []
		if(houseNumber.length > 0)
		{
			houseNumber.forEach((field)=>{
				const adressObj =
				{
					name:field.fullName,
					lat:field.coordinate.lat,
					lng:field.coordinate.lng
				}
				array_adress.push(adressObj)
			})
			setAdresses(array_adress)
		}
	},[houseNumber])
	/*Filtre des adresses */
	const FilteredAdress = (adress) =>
	{
		const filtered = adresses.filter((address) => address.name.toLowerCase().includes(adress.toLowerCase()))
		const filteredSlice = filtered.slice(0,3)
		setFilteredAdresses(filteredSlice)
	}
	/*Fonction zoom vers le marqueur de l'adresse */
	const zoomToCoordinate = (lat,lng) => {
		const latAdress = parseFloat(lat)
		const lngAdress = parseFloat(lng)
		const map = mapRef.current
		if (map) 
		{
			map.setView([latAdress, lngAdress], 20)
			map.on('moveend', () => {
				map.invalidateSize()
			})
			const dataRealTZoom = dataRealT.filter((field)=>field.coordinate.lat === lat && field.coordinate.lng === lng)
			handleMarkerClick(dataRealTZoom[0])
			setFilteredAdresses([])
		}
	}
	const ResetSearch = () =>
	{
		setFilteredAdresses([])
		searchBarRef.current.value = ''
		const map = mapRef.current
		if (map) 
		{
			map.setView([18.808779, -52.150144], 3)
			setOpen(false)
		}
	}
	/*Formatage du Rent Type */
	function formatString(str) 
	{
		return str
			.split('_')
		  	.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		  	.join(' ')
	}
    return (
		<div className='map'>
			<div className='map_google_maps'>
			{apiKey === '' ?
				(
					<MapContainer center={[18.808779, -52.150144]} zoom={3} className='map' zoomControl={false}>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution="&copy; OpenStreetMap contributors"
						/>
					</MapContainer>
				)
				:
				(
					dataRealT.length > 0 ? 
					(
						<MapContainer center={[18.808779, -52.150144]} zoom={3} className='map' zoomControl={false} ref={mapRef}>
							<TileLayer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution="&copy; OpenStreetMap contributors"
							/>
							<MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
								{houseNumber.map((location,index) => (
								<Marker
									key={index}
									icon={getIcon(location)}
									position={[location.coordinate.lat, location.coordinate.lng]}
									eventHandlers={{
									click: () => handleMarkerClick(location)
									}}
								>
								</Marker>
								))}
							</MarkerClusterGroup>
						</MapContainer>
					):
					(
						<div className='map_chargement'>
							<h2>Chargement</h2>
							<div className='map_chargement_spinner'></div>
							{data.length === 0 ?(<h3>0 %</h3>):(<h3>{parseInt((load/data.length)*100)} %</h3>)}
						</div>
					)
				)
			}
			</div>
			{apiKey !== '' &&<div className='map_search'>
				<div className='map_search_bloc'>
					<input className='map_search_search_bar' onChange={(e)=>FilteredAdress(e.target.value)} ref={searchBarRef} />
					<div className='map_search_icons'>
						{searchBarRef.current && searchBarRef.current.value === '' ?
							(<img src={search} alt='search' height={20} />):
							(<img src={cross} alt='cross' height={20} onClick={()=>ResetSearch()} />)
						}
					</div>
				</div>
				{filteredAdresses.length > 0 &&
					<div className='map_search_suggestion'>
						{filteredAdresses.map((address,index)=>(<p className='map_search_text' onClick={()=>zoomToCoordinate(address.lat,address.lng)} key={index}>{address.name}</p>))}
					</div>
				}
			</div>}
			<div className='map_marker_details'>
				<div className='map_marker_details_bloc_settings'>
					<div className='map_settings'>
						<p>{houseNumber.length}</p>
						<img src={house} alt='house' height={24} className='icon' />
					</div>
					<div className='map_settings'>
						<img src={filter_icon} alt='filter' width={24} height={24} className='icon' onClick={()=>onSetFilter()}/>
						<img src={gear_icon} alt='filter' width={24} height={24} className='icon' onClick={()=>onSetWallet()} />
					</div>
					<div className={`map_settings_bloc_key ${walletMenu ? "open":""}`}>
						<div className='map_settings_key'>
							<input type='text' onChange={(e)=>onSetKey(e.target.value)} />
							<span>Wallet</span>
						</div>
					</div>
				</div>
				<div className={`map_filter ${filter ? "open":""}`}>
					<div className='map_filter_components'>
						<p className='map_filter_components_title'>Rented Unit</p>
						<div className='map_filter_components_radio'>
							<div onClick={()=>onSetRentedUnits('Full')} className={`map_filter_components_radio_content`}>
								<p>Full</p>
								<div className={`map_filter_components_radio_button ${rentedUnits === 'Full' ? "checked":""}`}></div>
							</div>
							<div onClick={()=>onSetRentedUnits('Partial')} className={`map_filter_components_radio_content`}>
								<p>Partial</p>
								<div className={`map_filter_components_radio_button ${rentedUnits === 'Partial' ? "checked":""}`}></div>
							</div>
							<div onClick={()=>onSetRentedUnits('Empty')} className={`map_filter_components_radio_content`}>
								<p>Empty</p>
								<div className={`map_filter_components_radio_button ${rentedUnits === 'Empty' ? "checked":""}`}></div>
							</div>
						</div>
						<p className='map_filter_components_title'>Yield</p>
						<div>
							<div className='map_filter_components_radio_content'>
								<div className='map_filter_components_radio_content_row'>
								{yieldRent !== null && (
									<>
									{yieldRent > 0 ? (<p>{'>'}</p>) : (<p>{'<'}</p>)}
									<p>{Math.abs(yieldRent)} %</p>
									</>
								)}
								</div>
								<input type="range" id="volume" name="volume" min="-150" max="150" step="5" defaultValue="0" onChange={(e)=>onSetYieldRent(((e.target.value)/10))} />
							</div>
						</div>
						<p className='map_filter_components_title'>Rent Date</p>
						<div className='map_filter_components_radio'>
							{rentStarted === null ?
								(
									<div onClick={()=>onSetRentStarted()} className='map_filter_components_radio_content_row'>
										<p>Started</p>
										<div className='map_filter_components_radio_checkbox'><div className={`map_filter_components_radio_checkbox_button`}></div></div>
										<p>Not Started</p>
									</div>
								):
								(rentStarted === true ? 
									(
										<div onClick={()=>onSetRentStarted()} className='map_filter_components_radio_content_row'>
											<p>Started</p>
											<div className='map_filter_components_radio_checkbox'><div className={`map_filter_components_radio_checkbox_button checked`}></div></div>
											<p>Not Started</p>
										</div>
									):
									(
										<div onClick={()=>onSetRentStarted()} className='map_filter_components_radio_content_row'>
											<p>Started</p>
											<div className='map_filter_components_radio_checkbox'><div className={`map_filter_components_radio_checkbox_button unchecked`}></div></div>
											<p>Not Started</p>
										</div>
									)
								)
							}
						</div>
						<img src={refresh} alt='refresh' height={24}  onClick={()=>setReload()}/>
					</div>
				</div>
				<div className='map_marker_details_bloc' ref={markerDetailsRef}>
				{selectedLocation && (
					<div className='map_marker_details_components'>
						<div className='map_carousel_close' onClick={()=>setOpen(!open)}><img src={cross} alt='chevron' height={14} /></div>
						<Carousel img={selectedLocation[indexLocation].image} name={selectedLocation[indexLocation].name} selectedLocation={selectedLocation} onIndexLocation={handleIndex} />
						<h3 className='map_marker_details_components_name'>{selectedLocation[indexLocation].name}</h3>
						<div className='map_marker_details_components_boutons'>
							<a href={selectedLocation[indexLocation].marketplaceLink} className='bouton_marker_details' target="_blank" rel="noreferrer">RealT</a>
							<a href={`https://dashboard.realt.community/asset/${selectedLocation[indexLocation].contract}`} className='bouton_marker_details' target="_blank" rel="noreferrer">Dashboard</a>
						</div>
						<p className='map_marker_details_components_title'>Rent</p>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Rented Unit</p>
							<p className='map_marker_details_components_field_text'>{selectedLocation[indexLocation].rentedUnits}/{selectedLocation[indexLocation].totalUnits} ({formatNumber(((selectedLocation[indexLocation].rentedUnits/selectedLocation[indexLocation].totalUnits)*100),2)} %)</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Yield</p>
							<p className='map_marker_details_components_field_text'>{formatNumber(selectedLocation[indexLocation].annualPercentageYield,2)} %</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Week Rent</p>
							<p className='map_marker_details_components_field_text'>{formatNumber((selectedLocation[indexLocation].netRentWeekPerToken*selectedLocation[indexLocation].ownedToken),2)} $</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Year Rent</p>
							<p className='map_marker_details_components_field_text'>{formatNumber((selectedLocation[indexLocation].netRentYearPerToken*selectedLocation[indexLocation].ownedToken),2)} $</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Rent Start</p>
							<p className='map_marker_details_components_field_text'>{(selectedLocation[indexLocation].rentStartDate.getDate()).toString().padStart(2,"0")}/{(selectedLocation[indexLocation].rentStartDate.getMonth()+1).toString().padStart(2,"0")}/{selectedLocation[indexLocation].rentStartDate.getFullYear()}</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Rent Type</p>
							<p className='map_marker_details_components_field_text'>{formatString(selectedLocation[indexLocation].rentalType)}</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Total Investment</p>
							<p className='map_marker_details_components_field_text'>{selectedLocation[indexLocation].totalInvestment}</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Token</p>
							<p className='map_marker_details_components_field_text'>{formatNumber(selectedLocation[indexLocation].ownedToken,2)}/{selectedLocation[indexLocation].totalToken} </p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Price</p>
							<p className='map_marker_details_components_field_text'>{selectedLocation[indexLocation].price} $</p>
						</div>
						<p className='map_marker_details_components_title'>Details</p>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Property Type</p>
							<p className='map_marker_details_components_field_text'>{selectedLocation[indexLocation].propertyTypeName}</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Bed/Bath</p>
							<p className='map_marker_details_components_field_text'>{selectedLocation[indexLocation].bedroomBath}</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Construction Year</p>
							<p className='map_marker_details_components_field_text'>{selectedLocation[indexLocation].constructionYear}</p>
						</div>
						<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Square Feet</p>
							<p className='map_marker_details_components_field_text'>{selectedLocation[indexLocation].squareFeet} ft²</p>
						</div>
						{selectedLocation[indexLocation].section8paid !== 0 &&<div className='map_marker_details_components_field'>
							<p className='map_marker_details_components_field_title'>Section 8</p>
							<p></p>
						</div>}
					</div>
				)}
				</div>
			</div>
    	</div>
	)
}

export default Map