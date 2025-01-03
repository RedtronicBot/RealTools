import { useState, useEffect, useRef } from "react"
import LineHistoriqueVente from "../components/Chart/LineHistoriqueVente"
/*Icones*/
import cross from "../images/icons/x-solid.svg"
import gear_icon from "../images/icons/gear-solid.svg"
function HistoriqueVente({ dataRealT, tokenBought, setKey }) {
	const [tokenBoughtData, setTokenBoughtData] = useState([])
	const [value, setValue] = useState([])
	const [open, setOpen] = useState(false)
	const [index, setIndex] = useState(0)
	const [scrollY, setScrollY] = useState(0)
	const expandRef = useRef(null)
	const [walletMenu, setWalletmenu] = useState(false)
	function formatNumber(number, decimals) {
		if (Number.isInteger(number)) {
			return number
		} else {
			return parseFloat(number.toFixed(decimals))
		}
	}
	const onSetKey = (key) => {
		setKey(key)
		setTimeout(() => {
			setWalletmenu(!walletMenu)
		}, 10)
	}
	useEffect(() => {
		const arrayTokenBought = []
		const arrayValue = []
		tokenBought.forEach((item, index) => {
			const firstDate = new Date(tokenBought[index][0].date * 1000)
			firstDate.setHours(0, 0, 0)
			const today = new Date()
			const diffInMs = today - firstDate
			const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

			const arrayData = []
			var value = dataRealT.find(
				(e) => e.gnosisContract.toLowerCase() === tokenBought[index][0].tokenContract
			).totalTokens
			for (var i = 0; i < parseInt(diffInDays); i++) {
				const filtered = tokenBought[index].filter((e) => {
					const dateTokenBought = new Date(e.date * 1000)
					return (
						firstDate.getDate() === dateTokenBought.getDate() &&
						firstDate.getMonth() === dateTokenBought.getMonth() &&
						firstDate.getFullYear() === dateTokenBought.getFullYear()
					)
				})
				let valueLoop = 0
				filtered.forEach((e) => {
					valueLoop += Number(e.value)
				})
				value -= valueLoop
				const filteredObj = {
					value: value,
					date: `${firstDate.getDate().toString().padStart(2, "0")}/${(firstDate.getMonth() + 1)
						.toString()
						.padStart(2, "0")}/${firstDate.getFullYear()}`,
				}
				arrayData.push(filteredObj)
				firstDate.setDate(firstDate.getDate() + 1)
			}
			const dayBefore = new Date()
			dayBefore.setDate(today.getDate() - 1)
			dayBefore.setHours(0, 0, 0)
			const twodayBefore = new Date()
			twodayBefore.setDate(twodayBefore.getDate() - 2)
			twodayBefore.setHours(0, 0, 0)
			const threedayBefore = new Date()
			threedayBefore.setDate(threedayBefore.getDate() - 3)
			threedayBefore.setHours(0, 0, 0)
			const weekBefore = new Date()
			weekBefore.setDate(weekBefore.getDate() - 7)
			weekBefore.setHours(0, 0, 0)
			const filteredDayBefore = tokenBought[index].filter((e) => {
				const dateTokenBought = new Date(e.date * 1000)
				return dayBefore <= dateTokenBought
			})
			var valueDayBefore = 0
			filteredDayBefore.forEach((e) => {
				valueDayBefore += Number(e.value)
			})
			const filteredTwoDayBefore = tokenBought[index].filter((e) => {
				const dateTokenBought = new Date(e.date * 1000)
				return twodayBefore <= dateTokenBought
			})
			var valueTwoDayBefore = 0
			filteredTwoDayBefore.forEach((e) => {
				valueTwoDayBefore += Number(e.value)
			})
			const filteredThreeDayBefore = tokenBought[index].filter((e) => {
				const dateTokenBought = new Date(e.date * 1000)
				return threedayBefore <= dateTokenBought
			})
			var valueThreeDayBefore = 0
			filteredThreeDayBefore.forEach((e) => {
				valueThreeDayBefore += Number(e.value)
			})
			const filteredWeekBefore = tokenBought[index].filter((e) => {
				const dateTokenBought = new Date(e.date * 1000)
				return weekBefore <= dateTokenBought
			})
			var valueWeekBefore = 0
			filteredWeekBefore.forEach((e) => {
				valueWeekBefore += Number(e.value)
			})
			const tokenObj = {
				contract: tokenBought[index][0].tokenContract,
				dayValue: formatNumber(valueDayBefore, 2),
				twoDayValue: formatNumber(valueTwoDayBefore, 2),
				threeDayValue: formatNumber(valueThreeDayBefore, 2),
				weekValue: formatNumber(valueWeekBefore, 2),
				name: dataRealT.find((e) => e.gnosisContract.toLowerCase() === tokenBought[index][0].tokenContract)
					.fullName,
				data: arrayData,
			}
			const baseValue = arrayData[arrayData.length - 1].value
			arrayValue.push(baseValue)
			arrayTokenBought.push(tokenObj)
		})
		setValue(arrayValue)
		setTokenBoughtData(arrayTokenBought)
	}, [tokenBought, dataRealT])

	const onSetExpand = (index) => {
		setOpen(true)
		setIndex(index)
	}
	/*Désactivation/activation du scroll si on expand ou non*/
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden"
			expandRef.current.style.top = `${scrollY}px`
		} else {
			document.body.style.overflow = "auto"
		}
		return () => {
			document.body.style.overflow = "auto"
		}
	}, [open, scrollY])
	const handleScroll = () => {
		setScrollY(window.scrollY)
	}
	useEffect(() => {
		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])
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
	return tokenBought.length > 0 ? (
		<div className="historique_vente">
			<h1 className="historique_vente_title">Ventes En Cours</h1>
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
			<div className="historique_vente_bloc_location">
				{tokenBoughtData.map((e, index) => {
					const data = dataRealT.find((el) => el.gnosisContract.toLowerCase() === e.contract)
					const rest = value[index]
					return (
						<div key={index} className="historique_vente_bloc_location_components">
							<img
								src={data.imageLink[0]}
								alt=""
								className="historique_vente_bloc_location_components_img"
							/>
							<div className="historique_vente_bloc_location_components_text">
								<h3>{data.shortName}</h3>
							</div>
							<div className="historique_vente_bloc_location_components_text">
								<p>Token Restant</p>
								<p>
									{formatNumber(rest, 2)}/{data.totalTokens}
								</p>
							</div>
							<div className="historique_vente_bloc_location_components_text">
								<p>Vente dernier 24h</p>
								<p>{tokenBoughtData[index].dayValue}</p>
							</div>
							<div className="historique_vente_bloc_location_components_text">
								<p>Vente dernier 48h</p>
								<p>{tokenBoughtData[index].twoDayValue}</p>
							</div>
							<div className="historique_vente_bloc_location_components_text">
								<p>Vente dernier 72h</p>
								<p>{tokenBoughtData[index].threeDayValue}</p>
							</div>
							<div className="historique_vente_bloc_location_components_text">
								<p>Vente De la semaine</p>
								<p>{tokenBoughtData[index].weekValue}</p>
							</div>
							<div className="historique_vente_button" onClick={() => onSetExpand(index)}>
								Voir graphique
							</div>
						</div>
					)
				})}
				<div className={`loyer_expand ${open ? "open" : ""}`} ref={expandRef}>
					<div className="loyer_expand_components">
						<div className="dashboard_expand">
							<h2>{tokenBoughtData.length > 0 && tokenBoughtData[index].name}</h2>

							<div className="dashboard_expand_box">
								{tokenBoughtData.length > 0 && (
									<LineHistoriqueVente datachart={tokenBoughtData[index].data} />
								)}
							</div>
						</div>
						<img
							src={cross}
							alt=""
							onClick={() => setOpen(!open)}
							width={20}
							className="loyer_expand_components_img"
						/>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="map_chargement">
			<h2>Chargement</h2>
			<div className="map_chargement_spinner"></div>
		</div>
	)
}

export default HistoriqueVente
