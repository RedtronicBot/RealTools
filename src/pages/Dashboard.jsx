import React, { useRef, useEffect, useState } from "react"
/*Fonctions*/
import PieChart from "../components/Chart/Pie"
import Table from "../components/Table/Table"
import DashboardData from "../function/DashboardData"
import LineChartToken from "../components/Chart/LineToken"
import LocationData from "../function/LocationData"
import LineChartRent from "../components/Chart/LineRent"
import LineChartYield from "../components/Chart/LineYield"
import LineChartRoi from "../components/Chart/LineRoi"
import LocationDataAlternate from "../function/LocationDataAlternate"
import CarouselGraph from "../components/CarouselGraph"
import InvestissementMensuel from "../function/InvestissementMensuel"
import BarInvestissementMensuel from "../components/Chart/BarInvestissementMensuel"
import EvolutionYield from "../function/EvolutionYield"
import LineEvolutionYield from "../components/Chart/LineEvolutionYield"
/*Icones*/
import info from "../images/icons/info-solid.svg"
import chevron from "../images/icons/chevron.svg"
import gear_icon from "../images/icons/gear-solid.svg"
import maximize from "../images/icons/maximize-solid.svg"
import cross from "../images/icons/x-solid.svg"
import chart from "../images/icons/chart-line-solid.svg"
import search from "../images/icons/magnifying-glass-solid.svg"
import filter_icon from "../images/icons/filter-solid.svg"
import refresh from "../images/icons/arrows-rotate-solid.svg"
import history_img from "../images/icons/clock-rotate-left-solid.svg"
import bell from "../images/icons/bell-regular.svg"
/*Fonction qui regarde la taille de l'écran*/
function useScreenSize() {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768)
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return isMobile
}

function Dashboard({ data, dataRealT, setKey, valueRmm, historyData, apiKey }) {
	const [propertiesType, setPropertiesType] = useState([])
	const [propertiesDiversity, setPropertiesDiversity] = useState([])
	const [rondayProperties, setRondayProperties] = useState("week")
	const [tableData, setTableData] = useState([])
	const [typeAffichage, setTypeAffichage] = useState("carte")
	const [typeNumber, setTypeNumber] = useState("25")
	const [slicedData, setSlicedData] = useState([])
	const [index, setIndex] = useState(0)
	const [walletMenu, setWalletmenu] = useState(false)
	const [dataLength, setDataLength] = useState(0)
	const [expand, setExpand] = useState("")
	const [open, setOpen] = useState(false)
	const expandRef = useRef(null)
	const { rentStat, propertiesStat, summaryStat, date, rondayStat, yieldStat } = DashboardData(
		data,
		dataRealT,
		valueRmm,
		historyData,
		rondayProperties
	)
	const [scrollY, setScrollY] = useState(0)
	const [contract, setContract] = useState("")
	const expandGraphRef = useRef(null)
	const [openGraph, setOpenGraph] = useState(false)
	const { token, rent, yieldData, yieldInitial, roi, value } = LocationData(historyData, data, dataRealT, contract)
	const [location, setLocation] = useState([])
	const [openGraphSub, setOpenGraphSub] = useState(false)
	const expandGraphSubRef = useRef(null)
	const [expandGraph, setExpandGraph] = useState("")
	const [searchLocation, setSearchLocation] = useState("")
	const searchBarRef = useRef(null)
	const [stats, setStats] = useState(false)
	const { tokenAlternate, rentAlternate, yieldDataAlternate, yieldInitialAlternate, roiAlternate } =
		LocationDataAlternate(historyData, dataRealT, contract)
	const isMobile = useScreenSize()
	const [statsExpand, setStatsExpand] = useState(false)
	const [statsValue, setStatsValue] = useState("")
	const expandStatsRef = useRef(null)
	const { investment } = InvestissementMensuel(historyData, data, dataRealT, apiKey)
	const { yieldChart } = EvolutionYield(historyData, dataRealT)
	const [openSearch, setOpenSearch] = useState(false)
	const [rentedUnits, setRentedUnits] = useState("")
	const [yieldRent, setYieldRent] = useState(null)
	const [rentStarted, setRentStarted] = useState(null)
	const [propertyType, setPropertyType] = useState(null)
	const selectRef = useRef(null)
	const [minValue, setMinValue] = useState(0)
	const [maxValue, setMaxValue] = useState(150)
	const sliderRef = useRef(null)
	const sliderOneRef = useRef(null)
	const sliderTwoRef = useRef(null)
	const expandHistoryRef = useRef(null)
	const [historyKey, setHistoryKey] = useState(null)
	const [openHistory, setOpenHistory] = useState(false)
	const [historyPing, setHistoryPing] = useState([])
	const [openPing, setOpenPing] = useState(false)
	useEffect(() => {
		/*Filtrage des donées pour les graphiques*/
		let arrayPropertiesType = []
		let arrayPropertiesDiversity = []
		dataRealT
			.filter((field) => field.rentStartDate !== null)
			.forEach((loc) => {
				const indexPropertiesType = arrayPropertiesType.findIndex(
					(field) => field.type === loc.propertyTypeName
				)
				if (indexPropertiesType === -1) {
					const dataPropertiesType = {
						type: loc.propertyTypeName,
						quantity: 1,
					}
					arrayPropertiesType.push(dataPropertiesType)
				} else {
					arrayPropertiesType[indexPropertiesType].quantity += 1
				}
				const indexPropertiesDiversity = arrayPropertiesDiversity.findIndex(
					(field) => field.type === loc.fullName.split(", ")[1]
				)
				if (indexPropertiesDiversity === -1) {
					const dataPropertiesDiversity = {
						type: loc.fullName.split(", ")[1],
						quantity: 1,
					}
					arrayPropertiesDiversity.push(dataPropertiesDiversity)
				} else {
					arrayPropertiesDiversity[indexPropertiesDiversity].quantity += 1
				}
			})
		setPropertiesType(arrayPropertiesType)
		setPropertiesDiversity(arrayPropertiesDiversity)
		setDataLength(dataRealT.filter((field) => field.rentStartDate !== null).length)
	}, [dataRealT])
	/*Génération des données pour le tableau et découpage de l'array de la grille/tableau selon le choix*/
	useEffect(() => {
		let arrayTable = []
		dataRealT
			.filter((field) => field.rentStartDate !== null)
			.forEach((loc) => {
				const date = new Date(loc.rentStartDate.date)
				const ArrayObj = {
					propriete: loc.fullName.split(", ")[0],
					valeur: `${formatNumber(
						loc.tokenPrice *
							data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value,
						2
					)} $`,
					prix: `${loc.tokenPrice} $`,
					rendement: `${loc.annualPercentageYield.toFixed(2)} %`,
					loyerHebdo: `${(
						(loc.netRentYearPerToken / 52) *
						data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
					).toFixed(2)} $`,
					loyerAnnuel: `${(
						loc.netRentYearPerToken *
						data.filter((field) => field.token === loc.gnosisContract.toLowerCase())[0]?.value
					).toFixed(2)} $`,
					logementLoues: `${loc.rentedUnits}/${loc.totalUnits} (${formatNumber(
						(loc.rentedUnits / loc.totalUnits) * 100,
						2
					)} %)`,
					premierLogement: `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
						.toString()
						.padStart(2, "0")}/${date.getFullYear()}`,
					gnosisContract: loc.gnosisContract.toLowerCase(),
					rentStartDate: loc.rentStartDate.date,
					rentalType: loc.rentalType.trim().toLowerCase(),
					fullName: loc.fullName,
				}
				arrayTable.push(ArrayObj)
			})
		const result = []
		const resultData = []
		const size = parseInt(typeNumber)
		var filteredDataRealT =
			searchLocation === ""
				? dataRealT.filter((field) => field.rentStartDate !== null)
				: dataRealT.filter(
						(field) =>
							field.rentStartDate !== null &&
							field.fullName.toLowerCase().includes(searchLocation.toLowerCase())
				  )
		var filteredArrayTable =
			searchLocation === ""
				? arrayTable
				: arrayTable.filter(
						(field) =>
							field.rentStartDate !== null &&
							field.fullName.toLowerCase().includes(searchLocation.toLowerCase())
				  )
		if (rentedUnits === "Full") {
			filteredDataRealT = filteredDataRealT.filter((field) => field.rentedUnits === field.totalUnits)
		} else if (rentedUnits === "Partial") {
			filteredDataRealT = filteredDataRealT.filter(
				(field) => field.rentedUnits < field.totalUnits && field.rentedUnits !== 0
			)
		} else if (rentedUnits === "Empty") {
			filteredDataRealT = filteredDataRealT.filter((field) => field.rentedUnits === 0)
		}
		if (rentStarted) {
			filteredDataRealT = filteredDataRealT.filter((field) => {
				if (field.rentStartDate !== null) {
					const now = Date.now()
					const date = field.rentStartDate.date
					const newDate = date.replace(" ", "T")
					const rentDate = new Date(newDate)
					return now > rentDate.getTime()
				}
				return false
			})
		} else if (!rentStarted && rentStarted !== null) {
			filteredDataRealT = filteredDataRealT.filter((field) => {
				if (field.rentStartDate !== null) {
					const now = Date.now()
					const date = field.rentStartDate.date
					const newDate = date.replace(" ", "T")
					const rentDate = new Date(newDate)
					return now < rentDate.getTime()
				}
				return false
			})
		}
		if (propertyType) {
			if (propertyType === "Non Défini") {
				filteredDataRealT = filteredDataRealT.filter(
					(field) => field.rentStartDate !== null && field.propertyTypeName === null
				)
			} else {
				filteredDataRealT = filteredDataRealT.filter((field) => field.propertyTypeName === propertyType)
			}
		}
		if (yieldRent) {
			filteredDataRealT = filteredDataRealT.filter(
				(field) => field.annualPercentageYield >= minValue / 10 && field.annualPercentageYield <= maxValue / 10
			)
		}
		if (filteredDataRealT.length > size) {
			for (let i = 0; i < filteredDataRealT.length; i += size) {
				result.push(filteredArrayTable.slice(i, i + size))
				resultData.push(filteredDataRealT.slice(i, i + size))
			}
			setTableData(result)
			setSlicedData(resultData)
		} else {
			result.push(filteredArrayTable)
			setTableData(result)
			setSlicedData([filteredDataRealT])
		}
		if (historyPing.length > 0) {
			const uuidSet = new Set(historyPing.map((e) => e.uuid.toLowerCase()))
			filteredDataRealT = filteredDataRealT.filter((e) => uuidSet.has(e.gnosisContract.toLowerCase()))
		}
	}, [
		data,
		dataRealT,
		typeNumber,
		searchLocation,
		rentedUnits,
		rentStarted,
		propertyType,
		yieldRent,
		minValue,
		maxValue,
		historyPing,
	])
	/*Formatage des nombres à virgules*/
	function formatNumber(number, decimals) {
		if (Number.isInteger(number)) {
			return number.toString()
		} else {
			return number.toFixed(decimals)
		}
	}
	const onSetExpand = (value) => {
		setExpand(value)
		setOpen(true)
	}
	const onSetExpandGraph = (value) => {
		setExpandGraph(value)
		setOpenGraphSub(true)
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
		const newIndex = index === 0 ? tableData.length - 1 : index - 1
		setIndex(newIndex)
	}
	const afterContent = () => {
		const newIndex = index === tableData.length - 1 ? 0 : index + 1
		setIndex(newIndex)
	}
	const onSetTypeNumber = (value) => {
		setTypeNumber(value)
		setIndex(0)
	}
	const onSetKey = (key) => {
		setKey(key)
		setTimeout(() => {
			setWalletmenu(!walletMenu)
		}, 10)
	}
	/*Fermeture du menu expand lors d'un clic extérieur*/
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (expandRef.current && expandRef.current.contains(event.target)) {
				if (event.target.classList.contains("loyer_expand")) {
					setOpen(!open)
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [open])
	/*Désactivation/activation du scroll si on expand ou non*/
	useEffect(() => {
		if (open || openGraph || openGraphSub || statsExpand || openHistory) {
			document.body.style.overflow = "hidden"
			expandRef.current.style.top = `${scrollY}px`
			expandGraphRef.current.style.top = `${scrollY}px`
			expandGraphSubRef.current.style.top = `${scrollY}px`
			expandStatsRef.current.style.top = `${scrollY}px`
			expandHistoryRef.current.style.top = `${scrollY}px`
		} else {
			document.body.style.overflow = "auto"
		}
		return () => {
			document.body.style.overflow = "auto"
		}
	}, [open, openGraph, openGraphSub, statsExpand, openHistory, scrollY])
	const handleScroll = () => {
		setScrollY(window.scrollY)
	}
	useEffect(() => {
		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	/*Fermeture du menu expand lors d'un clic extérieur*/
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (expandGraphRef.current && expandGraphRef.current.contains(event.target)) {
				if (event.target.classList.contains("loyer_expand")) {
					setOpenGraph(!openGraph)
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [openGraph])
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (expandGraphSubRef.current && expandGraphSubRef.current.contains(event.target)) {
				if (event.target.classList.contains("loyer_expand")) {
					setOpenGraphSub(!openGraphSub)
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [openGraphSub])
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (expandStatsRef.current && expandStatsRef.current.contains(event.target)) {
				if (event.target.classList.contains("loyer_expand")) {
					setStatsExpand(!statsExpand)
				}
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [statsExpand])
	const onSetContract = (value) => {
		setContract(value)
		setOpenGraph(!openGraph)
	}
	useEffect(() => {
		if (contract !== "") {
			const contractLocation = dataRealT.find((loc) => loc.gnosisContract.toLowerCase() === contract)
			setLocation(contractLocation)
		}
	}, [contract, dataRealT])
	function onSearchLocation(value) {
		setSearchLocation(value)
		setIndex(0)
		if (openPing) {
			setHistoryPing([])
		}
	}
	function resetSearch() {
		searchBarRef.current.value = ""
		setSearchLocation("")
	}
	const onStatsExpand = (value) => {
		setStatsValue(value)
		setStatsExpand(true)
	}
	const onSetRentedUnits = (value) => {
		setRentStarted(null)
		setRentedUnits(value)
		setYieldRent(null)
		setPropertyType(null)
		setMinValue(0)
		setMaxValue(150)
	}
	const onSetRentStarted = () => {
		if (rentStarted === null) {
			setRentStarted(true)
			setRentedUnits("")
			setYieldRent(null)
			setPropertyType(null)
			setMinValue(0)
			setMaxValue(150)
		} else {
			setRentStarted(!rentStarted)
		}
	}
	const onSetPropertyType = (value) => {
		setRentStarted(null)
		setRentedUnits("")
		setYieldRent(null)
		setPropertyType(value)
		setMinValue(0)
		setMaxValue(150)
	}
	const setReload = () => {
		setRentStarted(null)
		setRentedUnits("")
		setYieldRent(null)
		setPropertyType(null)
		setMinValue(0)
		setMaxValue(150)
		selectRef.current.value = "reset"
	}
	const handleMinChange = (e) => {
		const value = parseInt(e.target.value)
		setRentStarted(null)
		setRentedUnits("")
		setYieldRent(true)
		setPropertyType(null)
		setYieldRent(true)
		if (value <= maxValue) {
			setMinValue(parseInt(value))
			updateSliderStyle(value, maxValue)
		} else {
			sliderOneRef.current.value = maxValue
		}
	}

	const handleMaxChange = (e) => {
		const value = parseInt(e.target.value)
		setRentStarted(null)
		setRentedUnits("")
		setYieldRent(true)
		setPropertyType(null)
		setYieldRent(true)
		if (value >= minValue) {
			setMaxValue(parseInt(value))
			updateSliderStyle(minValue, value)
		} else {
			sliderTwoRef.current.value = minValue
		}
	}

	const updateSliderStyle = (min, max) => {
		const minPercent = (min / 150) * 100
		const maxPercent = (max / 150) * 100
		sliderRef.current.style.background = `
            linear-gradient(
                to right,
                #d5d5d5 ${minPercent}%,
                #3264fe ${minPercent}%,
                #3264fe ${maxPercent}%,
                #d5d5d5 ${maxPercent}%
            )
        `
	}
	function onSetHistory(value) {
		setOpenHistory(true)
		setHistoryKey(value)
	}

	useEffect(() => {
		function findDifferences(arr1, arr2) {
			const differences = {
				onlyInArray1: [],
				differingItems: [],
			}

			const deepEqual = (obj1, obj2) => {
				if (obj1 === obj2) return true
				if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
					return false
				}
				const keys1 = Object.keys(obj1)
				const keys2 = Object.keys(obj2)
				if (keys1.length !== keys2.length) return false
				return keys1.every((key) => obj2.hasOwnProperty(key) && deepEqual(obj1[key], obj2[key]))
			}

			// Find items in arr1 but not in arr2
			arr1.forEach((item1, index) => {
				const matchIndex = arr2.findIndex((item2) => deepEqual(item1, item2))
				if (matchIndex === -1) {
					differences.onlyInArray1.push(item1)
				} else if (!deepEqual(item1, arr2[matchIndex])) {
					differences.differingItems.push({ index: index, item1: item1, item2: arr2[matchIndex] })
				}
			})

			return differences
		}

		function areArraysEqual(arr1, arr2) {
			if (arr1.length !== arr2.length) {
				return { equal: false, differences: findDifferences(arr1, arr2) }
			}

			const differences = findDifferences(arr1, arr2)

			if (differences.onlyInArray1.length === 0 && differences.differingItems.length === 0) {
				return { equal: true, differences: null }
			}

			return { equal: false, differences }
		}
		const storageData = JSON.parse(localStorage.getItem("history"))
		const arrayHistory = []
		for (var i = 0; i < dataRealT.length; i++) {
			const loopDataRealT = dataRealT[i]
			const history = historyData.find((e) => e.uuid.toLowerCase() === loopDataRealT.gnosisContract.toLowerCase())
			if (history !== undefined) {
				arrayHistory.push(history)
			}
		}
		if (storageData) {
			const result = areArraysEqual(arrayHistory, storageData.history)
			if (!result.equal) {
				setHistoryPing(result.differences.onlyInArray1)
			}
		} else {
			setHistoryPing(arrayHistory)
		}
	}, [historyData, dataRealT])
	function onClickPing() {
		setHistoryPing([])
		setOpenPing(!openPing)
		const arrayHistory = []
		for (var i = 0; i < dataRealT.length; i++) {
			const loopDataRealT = dataRealT[i]
			const history = historyData.find((e) => e.uuid.toLowerCase() === loopDataRealT.gnosisContract.toLowerCase())
			if (history !== undefined) {
				arrayHistory.push(history)
			}
		}
		localStorage.setItem(
			"history",
			JSON.stringify({
				history: arrayHistory,
			})
		)
	}
	return (
		<div className="dashboard">
			<h1 className="dashboard_title">Realtools Dashboard</h1>
			<div className="dashboard_settings">
				<img
					src={gear_icon}
					alt="filter"
					width={24}
					height={24}
					className="icon"
					onClick={() => setWalletmenu(!walletMenu)}
				/>
			</div>
			<div className={`dashboard_settings_key ${walletMenu ? "open" : ""}`}>
				<div className="map_settings_key">
					<input type="text" onChange={(e) => onSetKey(e.target.value)} />
					<span>Portefeuille</span>
				</div>
			</div>
			<div className="dashboard_bloc_stats">
				<div className="dashboard_text_stats">
					<div className="dashboard_text_stats_inline_text">
						<h2>Résumé</h2>
						<img
							src={chart}
							alt=""
							className="dashboard_text_stats_img"
							width={20}
							onClick={() => onStatsExpand("resume")}
						/>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Valeur nette</p>
						<p>
							{summaryStat &&
								(summaryStat.netValue === 0 ? "-" : `${formatNumber(summaryStat.netValue, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>RealTokens</p>
						<p>
							{summaryStat &&
								(summaryStat.realToken === 0 ? "-" : `${formatNumber(summaryStat.realToken, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Dépôt RMM</p>
						<p>{valueRmm && (valueRmm === 0 ? "-" : `${formatNumber(valueRmm, 2)} $`)}</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>RWA</p>
						<p>{summaryStat && (summaryStat.rwa === 0 ? "-" : `${formatNumber(summaryStat.rwa, 2)} $`)}</p>
					</div>
				</div>
				<div className="dashboard_text_stats">
					<h2>Propriétés</h2>
					<div className="dashboard_text_stats_inline_text">
						<p>Tokens</p>
						<p>
							{propertiesStat &&
								(propertiesStat.tokens === 0 ? "-" : formatNumber(propertiesStat.tokens, 2))}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Propriétés</p>
						<p>{propertiesStat && (propertiesStat.properties === 0 ? "-" : propertiesStat.properties)}</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Prix d'achat moyen</p>
						<p>
							{propertiesStat &&
								(propertiesStat.averagePriceBought === 0
									? "-"
									: `${formatNumber(propertiesStat.averagePriceBought, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Valeur moyenne</p>
						<p>
							{propertiesStat &&
								(propertiesStat.averageValue === 0
									? "-"
									: `${formatNumber(propertiesStat.averageValue, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Loyer annuel moyen</p>
						<p>
							{propertiesStat &&
								(propertiesStat.averageYearlyRent === 0
									? "-"
									: `${formatNumber(propertiesStat.averageYearlyRent, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Logement loués</p>
						<p>
							{propertiesStat &&
								(propertiesStat.totalUnits === 0
									? "-"
									: `${propertiesStat.rentedUnits}/${propertiesStat.totalUnits} (${formatNumber(
											(propertiesStat.rentedUnits / propertiesStat.totalUnits) * 100,
											2
									  )} %)`)}
						</p>
					</div>
				</div>
				<div className="dashboard_text_stats">
					<div className="dashboard_text_stats_inline_text">
						<h2>Rendement</h2>
						<img
							src={chart}
							alt=""
							className="dashboard_text_stats_img"
							width={20}
							onClick={() => onStatsExpand("rendement")}
						/>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<div className="dashboard_text_stats_info_bloc">
							<p>Rendement annuel actuel</p>
							<div className="dashboard_text_stats_info_border">
								<img src={info} alt="" className="dashboard_text_stats_info" height={14} width={6} />
								<span>Prends en compte si le logement est louée</span>
							</div>
						</div>
						<p>
							{yieldStat &&
								(yieldStat.yieldActual === 0 ? "-" : `${formatNumber(yieldStat.yieldActual, 2)} %`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<div className="dashboard_text_stats_info_bloc">
							<p>Rendement annuel</p>
							<div className="dashboard_text_stats_info_border">
								<img src={info} alt="" className="dashboard_text_stats_info" height={14} width={6} />
								<span>Rendement total sans prendre compte de la date de location</span>
							</div>
						</div>
						<p>{yieldStat && (yieldStat.yield === 0 ? "-" : `${formatNumber(yieldStat.yield, 2)} %`)}</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<div className="dashboard_text_stats_info_bloc">
							<p>Rendement 100% loué</p>
							<div className="dashboard_text_stats_info_border">
								<img src={info} alt="" className="dashboard_text_stats_info" height={14} width={6} />
								<span>
									Basée sur le dernier rendement du logement complet ou le rendement initial si jamais
									louée
								</span>
							</div>
						</div>
						<p>
							{yieldStat &&
								(yieldStat.yieldFull === 0 ? "-" : `${formatNumber(yieldStat.yieldFull, 2)} %`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<div className="dashboard_text_stats_info_bloc">
							<p>Rendement initial</p>
							<div className="dashboard_text_stats_info_border">
								<img src={info} alt="" className="dashboard_text_stats_info" height={14} width={6} />
								<span>Rendement donné par RealT</span>
							</div>
						</div>
						<p>
							{yieldStat &&
								(yieldStat.yieldInitial === 0 ? "-" : `${formatNumber(yieldStat.yieldInitial, 2)} %`)}
						</p>
					</div>
				</div>
				<div className="dashboard_text_stats">
					<h2>Loyers</h2>
					<div className="dashboard_text_stats_inline_text">
						<p>Journaliers</p>
						<p>
							{rentStat && (rentStat.rentDaily === 0 ? "-" : `${formatNumber(rentStat.rentDaily, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Hebdomadaires</p>
						<p>
							{rentStat &&
								(rentStat.rentWeekly === 0 ? "-" : `${formatNumber(rentStat.rentWeekly, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Mensuels</p>
						<p>
							{rentStat &&
								(rentStat.rentMonthly === 0 ? "-" : `${formatNumber(rentStat.rentMonthly, 2)} $`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>Annuels</p>
						<p>
							{rentStat &&
								(rentStat.rentYearly === 0 ? "-" : `${formatNumber(rentStat.rentYearly, 2)} $`)}
						</p>
					</div>
				</div>
				<div className="dashboard_text_stats">
					<div className="dashboard_text_stats_inline_text">
						<h2>Prochain Loyer</h2>
						<select
							onChange={(e) => setRondayProperties(e.target.value)}
							defaultValue="week"
							className="dashboard_text_stats_select"
						>
							<option value="week">Semaine</option>
							<option value="month">Mois</option>
							<option value="year">Année</option>
						</select>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>
							{date.length > 0 &&
								`${date[0].getDate().toString().padStart(2, "0")}/${(date[0].getMonth() + 1)
									.toString()
									.padStart(2, "0")}/${date[0].getFullYear().toString().padStart(2, "0")}`}
						</p>
						<p>
							{rondayStat &&
								(rondayStat.first === 0
									? "-"
									: rondayProperties === "week"
									? `${formatNumber(rondayStat.first / 52, 2)} $`
									: rondayProperties === "month"
									? `${formatNumber(rondayStat.first / 52, 2)} $ - ${formatNumber(
											rondayStat.first / 12,
											2
									  )} $`
									: `${formatNumber(rondayStat.first / 52, 2)} $ - ${formatNumber(
											rondayStat.first,
											2
									  )}$`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>
							{date.length > 0 &&
								`${date[1].getDate().toString().padStart(2, "0")}/${(date[1].getMonth() + 1)
									.toString()
									.padStart(2, "0")}/${date[1].getFullYear().toString().padStart(2, "0")}`}
						</p>
						<p>
							{rondayStat &&
								(rondayStat.second === 0
									? "-"
									: rondayProperties === "week"
									? `${formatNumber(rondayStat.second / 52, 2)} $`
									: rondayProperties === "month"
									? `${formatNumber(rondayStat.second / 52, 2)} $ - ${formatNumber(
											rondayStat.second / 12,
											2
									  )} $`
									: `${formatNumber(rondayStat.second / 52, 2)} $ - ${formatNumber(
											rondayStat.second,
											2
									  )}$`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>
							{date.length > 0 &&
								`${date[2].getDate().toString().padStart(2, "0")}/${(date[2].getMonth() + 1)
									.toString()
									.padStart(2, "0")}/${date[2].getFullYear().toString().padStart(2, "0")}`}
						</p>
						<p>
							{rondayStat &&
								(rondayStat.third === 0
									? "-"
									: rondayProperties === "week"
									? `${formatNumber(rondayStat.third / 52, 2)} $`
									: rondayProperties === "month"
									? `${formatNumber(rondayStat.third / 52, 2)} $ - ${formatNumber(
											rondayStat.third / 12,
											2
									  )} $`
									: `${formatNumber(rondayStat.third / 52, 2)} $ - ${formatNumber(
											rondayStat.third,
											2
									  )}$`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>
							{date.length > 0 &&
								`${date[3].getDate().toString().padStart(2, "0")}/${(date[3].getMonth() + 1)
									.toString()
									.padStart(2, "0")}/${date[3].getFullYear().toString().padStart(2, "0")}`}
						</p>
						<p>
							{rondayStat &&
								(rondayStat.fourth === 0
									? "-"
									: rondayProperties === "week"
									? `${formatNumber(rondayStat.fourth / 52, 2)} $`
									: rondayProperties === "month"
									? `${formatNumber(rondayStat.fourth / 52, 2)} $ - ${formatNumber(
											rondayStat.fourth / 12,
											2
									  )} $`
									: `${formatNumber(rondayStat.fourth / 52, 2)} $ - ${formatNumber(
											rondayStat.fourth,
											2
									  )}$`)}
						</p>
					</div>
					<div className="dashboard_text_stats_inline_text">
						<p>
							{date.length > 0 &&
								`${date[4].getDate().toString().padStart(2, "0")}/${(date[4].getMonth() + 1)
									.toString()
									.padStart(2, "0")}/${date[4].getFullYear().toString().padStart(2, "0")}`}
						</p>
						<p>
							{rondayStat &&
								(rondayStat.fifth === 0
									? "-"
									: rondayProperties === "week"
									? `${formatNumber(rondayStat.fifth / 52, 2)} $`
									: rondayProperties === "month"
									? `${formatNumber(rondayStat.fifth / 52, 2)} $ - ${formatNumber(
											rondayStat.fifth / 12,
											2
									  )} $`
									: `${formatNumber(rondayStat.fifth / 52, 2)} $ - ${formatNumber(
											rondayStat.fifth,
											2
									  )}$`)}
						</p>
					</div>
				</div>
			</div>
			<div className="dashboard_bloc_stats">
				<div className="dashboard_chart">
					<h2>Type de propriété</h2>
					<div className="dashboard_chart_box">
						<PieChart datachart={propertiesType} dataLength={dataLength} />
					</div>
					<img
						src={maximize}
						alt=""
						className="dashboard_chart_img"
						width={24}
						onClick={() => onSetExpand("type")}
					/>
				</div>
				<div className="dashboard_chart">
					<h2>Localisation des propriétés</h2>
					<div className="dashboard_chart_box">
						<PieChart datachart={propertiesDiversity} dataLength={dataLength} />
					</div>
					<img
						src={maximize}
						alt=""
						className="dashboard_chart_img"
						width={24}
						onClick={() => onSetExpand("diversity")}
					/>
				</div>
			</div>
			<div className="dashboard_bloc_select">
				<div className="dashboard_bloc_search">
					<div className="map_search_bloc">
						<input
							className="map_search_search_bar"
							onChange={(e) => onSearchLocation(e.target.value)}
							ref={searchBarRef}
						/>
						<div className="map_search_icons">
							{searchBarRef.current && searchBarRef.current.value === "" ? (
								<img src={search} alt="search" height={20} />
							) : (
								<img src={cross} alt="cross" height={20} onClick={() => resetSearch("")} />
							)}
						</div>
					</div>
					<div className="dashboard_bloc_search_settings_bloc">
						<div onClick={() => setOpenSearch(!openSearch)} className="dashboard_bloc_search_settings">
							<img
								src={filter_icon}
								alt="filter"
								width={24}
								height={20}
								className="dashboard_bloc_search_settings_icon"
							/>
						</div>
						<div className={`dashboard_bloc_search_settings_filter ${openSearch ? "open" : ""}`}>
							<p className="map_filter_components_title">Logement loués</p>
							<div className="map_filter_components_radio">
								<div
									onClick={() => onSetRentedUnits("Full")}
									className={`map_filter_components_radio_content`}
								>
									<p>Plein</p>
									<div
										className={`map_filter_components_radio_button ${
											rentedUnits === "Full" ? "checked" : ""
										}`}
									></div>
								</div>
								<div
									onClick={() => onSetRentedUnits("Partial")}
									className={`map_filter_components_radio_content`}
								>
									<p>Partiel</p>
									<div
										className={`map_filter_components_radio_button ${
											rentedUnits === "Partial" ? "checked" : ""
										}`}
									></div>
								</div>
								<div
									onClick={() => onSetRentedUnits("Empty")}
									className={`map_filter_components_radio_content`}
								>
									<p>Vide</p>
									<div
										className={`map_filter_components_radio_button ${
											rentedUnits === "Empty" ? "checked" : ""
										}`}
									></div>
								</div>
							</div>
							<p className="map_filter_components_title">Rendement</p>
							<p>
								{minValue / 10}-{maxValue / 10}%
							</p>
							<div className="dashboard_range">
								<div className="dashboard_range_components">
									<div className="dashboard_range_components_slider_track" ref={sliderRef}></div>
									<input
										type="range"
										min="0"
										max="150"
										step="5"
										defaultValue="0"
										ref={sliderOneRef}
										onChange={(e) => handleMinChange(e)}
									/>
									<input
										type="range"
										min="0"
										max="150"
										step="5"
										defaultValue="150"
										ref={sliderTwoRef}
										onChange={(e) => handleMaxChange(e)}
									/>
								</div>
							</div>
							<p className="map_filter_components_title">Mise en location</p>
							<div className="map_filter_components_radio">
								{rentStarted === null ? (
									<div
										onClick={() => onSetRentStarted()}
										className="map_filter_components_radio_content_row"
									>
										<p>Entamé</p>
										<div className="map_filter_components_radio_checkbox">
											<div className={`map_filter_components_radio_checkbox_button`}></div>
										</div>
										<p>Non entamé</p>
									</div>
								) : rentStarted === true ? (
									<div
										onClick={() => onSetRentStarted()}
										className="map_filter_components_radio_content_row"
									>
										<p>Entamé</p>
										<div className="map_filter_components_radio_checkbox">
											<div
												className={`map_filter_components_radio_checkbox_button checked`}
											></div>
										</div>
										<p>Non entamé</p>
									</div>
								) : (
									<div
										onClick={() => onSetRentStarted()}
										className="map_filter_components_radio_content_row"
									>
										<p>Entamé</p>
										<div className="map_filter_components_radio_checkbox">
											<div
												className={`map_filter_components_radio_checkbox_button unchecked`}
											></div>
										</div>
										<p>Non entamé</p>
									</div>
								)}
							</div>
							<p className="map_filter_components_title">Type de propriété</p>
							<select
								onChange={(e) => onSetPropertyType(e.target.value)}
								className="map_filter_components_select"
								ref={selectRef}
							>
								<option hidden value="reset">
									-Choisir un type-
								</option>
								{propertiesType.map((options, index) =>
									options.type === null ? (
										<option value={options.type} key={index}>
											Non Défini
										</option>
									) : (
										<option value={options.type} key={index}>
											{options.type}
										</option>
									)
								)}
							</select>
							<img src={refresh} alt="refresh" height={24} onClick={() => setReload()} />
						</div>
					</div>
				</div>
				<div className="dashboard_bloc_ping_select">
					<div className="dashboard_ping" onClick={() => onClickPing()}>
						<img src={bell} alt="" className="dashboard_ping_img" height={20} />
						{historyPing.length > 0 && (
							<div className="dashboard_ping_text">
								<p>{historyPing.length}</p>
							</div>
						)}
					</div>
					<div className="dashboard_bloc_select_component">
						<p>Affichage</p>
						<select
							defaultValue="carte"
							onChange={(e) => setTypeAffichage(e.target.value)}
							className="dashboard_select"
						>
							<option value="carte">Carte</option>
							<option value="tableau">Tableau</option>
						</select>
					</div>
				</div>
			</div>
			{typeAffichage === "carte" ? (
				<div className="dashboard_bloc_stats">
					{slicedData.length > 0 &&
						slicedData[index].map((field, index) => {
							const date = new Date(field.rentStartDate.date)
							const FieldDate = field.rentStartDate.date
							const newDate = FieldDate.replace(" ", "T")
							const rentStartedDate = new Date(newDate)
							const today = new Date()
							let yieldFull = 0
							let yieldInitial = 0

							var history = historyData.find(
								(obj) => obj.uuid.toLowerCase() === field.gnosisContract.toLowerCase()
							)
							for (var j = history.history.length - 1; j >= 0; j--) {
								if (
									(history.history[j].values.rentedUnits !== undefined &&
										history.history[j].values.rentedUnits === field.totalUnits &&
										history.history[j].values.netRentYear !== undefined) ||
									(history.history[j].values.rentedUnits === undefined &&
										history.history[j].values.netRentYear !== undefined) ||
									(field.rentalType === "pre_construction" &&
										history.history[j].values.netRentYear !== undefined) ||
									(field.productType === "loan_income" &&
										history.history[j].values.netRentYear !== undefined)
								) {
									if (field.rentalType === "pre_construction") {
										yieldFull =
											(history.history[0].values.netRentYear /
												history.history[0].values.totalInvestment) *
											100
									} else {
										yieldFull =
											(history.history[j].values.netRentYear /
												history.history[0].values.totalInvestment) *
											100
									}
									break
								}
							}
							yieldInitial =
								(history.history[0].values.netRentYear / history.history[0].values.totalInvestment) *
								100

							return (
								<div className="dashboard_grid" key={index}>
									<img src={field.imageLink[0]} alt="" className="dashboard_grid_img" />
									<div className="dashboard_title_bloc">
										<p>{field.fullName.split(", ")[0]}</p>
										<div className="dashboard_grid_graph">
											<p className="dashboard_title_bloc_price">
												{formatNumber(
													field.tokenPrice *
														data.filter(
															(dataField) =>
																dataField.token === field.gnosisContract.toLowerCase()
														)[0]?.value,
													2
												)}{" "}
												$
											</p>
											{((history.history.length > 0 && today > rentStartedDate) ||
												(history.history.length > 0 &&
													field.rentalType.trim().toLowerCase() === "pre_construction")) && (
												<img
													src={chart}
													alt=""
													height={20}
													className="dashboard_grid_graph_img"
													onClick={() => onSetContract(field.gnosisContract.toLowerCase())}
												/>
											)}
											{history.history.filter(
												(e) =>
													e.values?.canal !== "release" && e.values?.canal !== "coming_soon"
											).length > 1 && (
												<img
													src={history_img}
													alt=""
													height={20}
													className="dashboard_grid_graph_img"
													onClick={() => onSetHistory(history)}
												/>
											)}
										</div>
									</div>
									<div className="dashboard_title_bloc_components">
										{formatNumber(
											(parseInt(field.rentedUnits) / parseInt(field.totalUnits)) * 100,
											2
										) === "100" ? (
											<div className="dashboard_title_bloc_rent">
												<div className="dashboard_title_bloc_rent_green"></div>
												<p>Louée</p>
											</div>
										) : formatNumber(
												(parseInt(field.rentedUnits) / parseInt(field.totalUnits)) * 100,
												2
										  ) > 0 ? (
											<div className="dashboard_title_bloc_rent">
												<div className="dashboard_title_bloc_rent_orange"></div>
												<p>Partiellement Louée</p>
											</div>
										) : (
											<div className="dashboard_title_bloc_rent">
												<div className="dashboard_title_bloc_rent_red"></div>
												<p>Non Louée</p>
											</div>
										)}
										{field.section8paid > 0 && (
											<p className="dashboard_title_bloc_rent">Subventionnée</p>
										)}
									</div>
									<div className="dashboard_grid_bloc_text">
										<div className="dashboard_text_stats_inline_text">
											<p>Token</p>
											<p>
												{formatNumber(
													data.filter(
														(dataField) =>
															dataField.token === field.gnosisContract.toLowerCase()
													)[0]?.value,
													2
												)}
												/{field.totalTokens}
											</p>
										</div>
										<div className="dashboard_text_stats_inline_text">
											<p>Rendement Annuel</p>
											<p>{formatNumber(field.annualPercentageYield, 2)} %</p>
										</div>
										<div className="dashboard_text_stats_inline_text">
											<p>Loyers hebdomadaires</p>
											<p>
												{formatNumber(
													parseFloat(
														field.netRentYearPerToken.toFixed(2) *
															data.filter(
																(dataField) =>
																	dataField.token ===
																	field.gnosisContract.toLowerCase()
															)[0]?.value
													) / 52,
													2
												)}{" "}
												$
											</p>
										</div>
										<div className="dashboard_text_stats_inline_text">
											<p>Loyers annuels</p>
											<p>
												{formatNumber(
													parseFloat(
														field.netRentYearPerToken.toFixed(2) *
															data.filter(
																(dataField) =>
																	dataField.token ===
																	field.gnosisContract.toLowerCase()
															)[0]?.value
													),
													2
												)}{" "}
												$
											</p>
										</div>
										<div className="dashboard_text_stats_inline_text">
											<p>Logements loués</p>
											<p>
												{field.rentedUnits}/{field.totalUnits} (
												{formatNumber(
													(parseInt(field.rentedUnits) / parseInt(field.totalUnits)) * 100,
													2
												)}{" "}
												%)
											</p>
										</div>
										<div className="dashboard_text_stats_inline_text">
											<p>Date du premier logement</p>
											<p>
												{date.getDate().toString().padStart(2, "0")}/
												{(date.getMonth() + 1).toString().padStart(2, "0")}/{date.getFullYear()}
											</p>
										</div>
										<div className="dashboard_text_stats_inline_text">
											<p>Rendement 100% louée</p>
											<p>{formatNumber(yieldFull, 2)} %</p>
										</div>
										<div className="dashboard_text_stats_inline_text">
											<p>Rendement initial</p>
											<p>{formatNumber(yieldInitial, 2)} %</p>
										</div>
									</div>
								</div>
							)
						})}
				</div>
			) : (
				tableData.length > 0 && (
					<div className="mobile_table">
						<Table
							columns={columns}
							tableData1={tableData[index]}
							key={index}
							onSetContract={onSetContract}
							historyData={historyData}
						/>
					</div>
				)
			)}
			<div className="dashboard_bloc_pagination">
				{dataRealT.filter((field) => field.rentStartDate !== null).length > parseInt(typeNumber) ? (
					<div className="dashboard_bloc_pagination_components">
						<div className="dashboard_bloc_pagination_components_img rotate">
							<img src={chevron} onClick={() => prevContent()} alt="chevron" height={18} />
						</div>
						{slicedData.map((indexNum, idx) => {
							return (
								<p
									key={idx}
									className={`dashboard_bloc_pagination_components_page ${
										index === idx && "selected"
									}`}
									onClick={() => setIndex(idx)}
								>
									{idx + 1}
								</p>
							)
						})}
						<div className="dashboard_bloc_pagination_components_img">
							<img src={chevron} onClick={() => afterContent()} alt="chevron" height={18} />
						</div>
					</div>
				) : (
					<div className="dashboard_bloc_pagination_components">
						<div className="dashboard_bloc_pagination_components_img rotate">
							<img src={chevron} alt="chevron" height={18} />
						</div>
						<p className="dashboard_bloc_pagination_components_page">1</p>
						<div className="dashboard_bloc_pagination_components_img">
							<img src={chevron} alt="chevron" height={18} />
						</div>
					</div>
				)}
				<select
					defaultValue="25"
					onChange={(e) => onSetTypeNumber(e.target.value)}
					className="dashboard_select"
				>
					<option value="25">25</option>
					<option value="50">50</option>
					<option value="100">100</option>
					<option value="200">200</option>
				</select>
			</div>
			<div className={`loyer_expand ${open ? "open" : ""}`} ref={expandRef}>
				<div className="loyer_expand_components">
					{expand === "type" ? (
						<div className="dashboard_expand">
							<h2>Type de propriété</h2>
							<div className="dashboard_expand_box">
								<PieChart datachart={propertiesType} dataLength={dataLength} />
							</div>
						</div>
					) : (
						expand === "diversity" && (
							<div className="dashboard_expand">
								<h2>Localisation des propriétés</h2>
								<div className="dashboard_expand_box">
									<PieChart datachart={propertiesDiversity} dataLength={dataLength} />
								</div>
							</div>
						)
					)}
					<img
						src={cross}
						alt=""
						onClick={() => setOpen(!open)}
						width={20}
						className="loyer_expand_components_img"
					/>
				</div>
			</div>
			<div className={`loyer_expand ${openGraph ? "open" : ""}`} ref={expandGraphRef}>
				{location.fullName !== undefined && (
					<div className="loyer_expand_graph">
						<div className="loyer_expand_description">
							<img src={location.imageLink[0]} height="150px" alt="" />
							<div className="loyer_expand_description_sub">
								<h3>{location.fullName}</h3>
								<div className="loyer_expand_description_paragraph_bloc">
									<div className="loyer_expand_description_paragraph">
										<p>
											Token{" "}
											{formatNumber(
												data.filter(
													(dataField) =>
														dataField.token === location.gnosisContract.toLowerCase()
												)[0]?.value,
												2
											)}
											/{location.totalTokens}
										</p>
										<p>Rendement {formatNumber(location.annualPercentageYield, 2)} %</p>
									</div>
									<div className="loyer_expand_description_paragraph">
										<p>
											Loyer Hebdomadaire{" "}
											{formatNumber(
												parseFloat(
													location.netRentYearPerToken.toFixed(2) *
														data.filter(
															(dataField) =>
																dataField.token ===
																location.gnosisContract.toLowerCase()
														)[0]?.value
												) / 52,
												2
											)}{" "}
											$
										</p>
										<p>
											Logement Louées {location.rentedUnits}/{location.totalUnits} (
											{formatNumber(
												(parseInt(location.rentedUnits) / parseInt(location.totalUnits)) * 100,
												2
											)}{" "}
											%)
										</p>
									</div>
								</div>
								<div className="dashboard_expand_switch">
									<p>Statistique</p>
									<div className="loyer_bloc_checkbox">
										<p>Personnel</p>
										<div className="loyer_checkbox" onClick={() => setStats(!stats)}>
											<div
												className={`loyer_checkbox_components ${stats ? "true" : "false"}`}
											></div>
										</div>
										<p>Global</p>
									</div>
									<div className="dashboard_text_stats_info_border">
										<img
											src={info}
											alt=""
											className="dashboard_text_stats_info"
											height={14}
											width={6}
										/>
										<span>
											Personnel: Depuis l'achat du token
											<br />
											Global: Depuis la mise en location
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="loyer_expand_graph_sub">
							{isMobile ? (
								<CarouselGraph
									LineChartToken={LineChartToken}
									LineChartRent={LineChartRent}
									LineChartYield={LineChartYield}
									LineChartRoi={LineChartRoi}
									stats={stats}
									tokenAlternate={tokenAlternate}
									token={token}
									rentAlternate={rentAlternate}
									rent={rent}
									yieldDataAlternate={yieldDataAlternate}
									yieldData={yieldData}
									yieldInitialAlternate={yieldInitialAlternate}
									yieldInitial={yieldInitial}
									roiAlternate={roiAlternate}
									roi={roi}
									value={value}
								/>
							) : (
								<>
									<div className="loyer_expand_graph_components">
										<LineChartToken datachart={stats ? tokenAlternate : token} />
										<img
											src={maximize}
											alt=""
											width={20}
											onClick={() => onSetExpandGraph("token")}
										/>
									</div>
									<div className="loyer_expand_graph_components">
										<LineChartRent
											datachart={stats ? rentAlternate : rent}
											datatoken={stats ? tokenAlternate : value}
										/>
										<img
											src={maximize}
											alt=""
											width={20}
											onClick={() => onSetExpandGraph("loyer")}
										/>
									</div>
									<div className="loyer_expand_graph_components">
										<LineChartYield
											datachart={stats ? yieldDataAlternate : yieldData}
											datainitial={stats ? yieldInitialAlternate : yieldInitial}
										/>
										<img
											src={maximize}
											alt=""
											width={20}
											onClick={() => onSetExpandGraph("yield")}
										/>
									</div>
									<div className="loyer_expand_graph_components">
										<LineChartRoi datachart={stats ? roiAlternate : roi} />
										<img src={maximize} alt="" width={20} onClick={() => onSetExpandGraph("roi")} />
									</div>
								</>
							)}
						</div>
						<img
							src={cross}
							alt=""
							onClick={() => setOpenGraph(!openGraph)}
							width={20}
							className="loyer_expand_components_img"
						/>
					</div>
				)}
			</div>
			<div className={`loyer_expand ${openGraphSub ? "open" : ""}`} ref={expandGraphSubRef}>
				<div className="loyer_expand_components">
					{expandGraph === "token" ? (
						<div className="dashboard_expand">
							<div className="dashboard_expand_switch_bloc">
								<h2>Évolution du token</h2>
								<div className="dashboard_expand_switch">
									<p>Statistique</p>
									<div className="loyer_bloc_checkbox">
										<p>Personnel</p>
										<div className="loyer_checkbox" onClick={() => setStats(!stats)}>
											<div
												className={`loyer_checkbox_components ${stats ? "true" : "false"}`}
											></div>
										</div>
										<p>Global</p>
									</div>
									<div className="dashboard_text_stats_info_border">
										<img
											src={info}
											alt=""
											className="dashboard_text_stats_info"
											height={14}
											width={6}
										/>
										<span>
											Personnel: Depuis l'achat du token
											<br />
											Global: Depuis la mise en location
										</span>
									</div>
								</div>
							</div>
							<div className="dashboard_expand_box">
								<LineChartToken datachart={stats ? tokenAlternate : token} />
							</div>
						</div>
					) : expandGraph === "loyer" ? (
						<div className="dashboard_expand">
							<div className="dashboard_expand_switch_bloc">
								<h2>Loyer cumulés/Prix d'achat</h2>
								<div className="dashboard_expand_switch">
									<p>Statistique</p>
									<div className="loyer_bloc_checkbox">
										<p>Personnel</p>
										<div className="loyer_checkbox" onClick={() => setStats(!stats)}>
											<div
												className={`loyer_checkbox_components ${stats ? "true" : "false"}`}
											></div>
										</div>
										<p>Global</p>
									</div>
									<div className="dashboard_text_stats_info_border">
										<img
											src={info}
											alt=""
											className="dashboard_text_stats_info"
											height={14}
											width={6}
										/>
										<span>
											Personnel: Depuis l'achat du token
											<br />
											Global: Depuis la mise en location
										</span>
									</div>
								</div>
							</div>
							<div className="dashboard_expand_box">
								<LineChartRent
									datachart={stats ? rentAlternate : rent}
									datatoken={stats ? tokenAlternate : value}
								/>
							</div>
						</div>
					) : expandGraph === "yield" ? (
						<div className="dashboard_expand">
							<div className="dashboard_expand_switch_bloc">
								<h2>Rendement Actuel/Initial</h2>
								<div className="dashboard_expand_switch">
									<p>Statistique</p>
									<div className="loyer_bloc_checkbox">
										<p>Personnel</p>
										<div className="loyer_checkbox" onClick={() => setStats(!stats)}>
											<div
												className={`loyer_checkbox_components ${stats ? "true" : "false"}`}
											></div>
										</div>
										<p>Global</p>
									</div>
									<div className="dashboard_text_stats_info_border">
										<img
											src={info}
											alt=""
											className="dashboard_text_stats_info"
											height={14}
											width={6}
										/>
										<span>
											Personnel: Depuis l'achat du token
											<br />
											Global: Depuis la mise en location
										</span>
									</div>
								</div>
							</div>
							<div className="dashboard_expand_box">
								<LineChartYield
									datachart={stats ? yieldDataAlternate : yieldData}
									datainitial={stats ? yieldInitialAlternate : yieldInitial}
								/>
							</div>
						</div>
					) : (
						<div className="dashboard_expand">
							<div className="dashboard_expand_switch_bloc">
								<h2>Performance du loyer</h2>
								<div className="dashboard_expand_switch">
									<p>Statistique</p>
									<div className="loyer_bloc_checkbox">
										<p>Personnel</p>
										<div className="loyer_checkbox" onClick={() => setStats(!stats)}>
											<div
												className={`loyer_checkbox_components ${stats ? "true" : "false"}`}
											></div>
										</div>
										<p>Global</p>
									</div>
									<div className="dashboard_text_stats_info_border">
										<img
											src={info}
											alt=""
											className="dashboard_text_stats_info"
											height={14}
											width={6}
										/>
										<span>
											Personnel: Depuis l'achat du token
											<br />
											Global: Depuis la mise en location
										</span>
									</div>
								</div>
							</div>
							<div className="dashboard_expand_box">
								<LineChartRoi datachart={stats ? roiAlternate : roi} />
							</div>
						</div>
					)}
					<img
						src={cross}
						alt=""
						onClick={() => setOpenGraphSub(!openGraphSub)}
						width={20}
						className="loyer_expand_components_img"
					/>
				</div>
			</div>
			<div className={`loyer_expand ${statsExpand ? "open" : ""}`} ref={expandStatsRef}>
				<div className="loyer_expand_components">
					{statsValue === "resume" ? (
						<div className="dashboard_expand">
							<h2>Investissement Mensuel</h2>
							<div className="dashboard_expand_box">
								<BarInvestissementMensuel datachart={investment} />
							</div>
						</div>
					) : (
						statsValue === "rendement" && (
							<div className="dashboard_expand">
								<h2>Évolution du rendement</h2>
								<div className="dashboard_expand_box">
									<LineEvolutionYield datachart={yieldChart} />
								</div>
							</div>
						)
					)}
					<img
						src={cross}
						alt=""
						onClick={() => setStatsExpand(!statsExpand)}
						width={20}
						className="loyer_expand_components_img"
					/>
				</div>
			</div>
			<div className={`loyer_expand ${openHistory ? "open" : ""}`} ref={expandHistoryRef}>
				<div className="dashboard_expand_history_bloc">
					<div className="dashboard_expand_history">
						{historyKey &&
							historyKey.history
								.filter((e) => e.values?.canal !== "coming_soon")
								.sort((a, b) => parseInt(b.date) - parseInt(a.date))
								.map((val, index, array) => {
									const nextVal = index < array.length - 1 ? array[index + 1] : null
									let annee = parseInt(val.date.substring(0, 4))
									let mois = parseInt(val.date.substring(4, 6))
									let jour = parseInt(val.date.substring(6, 8))
									return (
										<div key={index} className="dashboard_expand_history_components">
											<p className="dashboard_expand_history_components_title">
												{jour.toString().padStart(2, "0")}/{mois.toString().padStart(2, "0")}/
												{annee}
											</p>
											<p>
												Brut Mensuel :{" "}
												{nextVal && <span>{nextVal.values.grossRentYear} -&gt;</span>}{" "}
												{val.values.grossRentYear}
											</p>
											<p>
												Net Mensuel :{" "}
												{nextVal && <span>{nextVal.values.netRentYear} -&gt;</span>}{" "}
												{val.values.netRentYear}
											</p>
											<p>
												Rendement :{" "}
												{nextVal && (
													<span>
														{(
															(nextVal.values.netRentYear /
																array[array.length - 1].values.totalInvestment) *
															100
														).toFixed(2)}{" "}
														% -&gt;
													</span>
												)}{" "}
												{(
													(val.values.netRentYear /
														array[array.length - 1].values.totalInvestment) *
													100
												).toFixed(2)}{" "}
												%
											</p>
											{val.values.rentedUnits && <p>Logement Loués : {val.values.rentedUnits}</p>}
										</div>
									)
								})}
					</div>
					<img
						src={cross}
						alt=""
						onClick={() => setOpenHistory(!openHistory)}
						width={20}
						className="loyer_expand_components_img"
					/>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
