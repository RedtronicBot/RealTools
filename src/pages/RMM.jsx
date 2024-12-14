import React, { useState, useEffect, useRef } from "react"
import DataRMM from "../function/DataRMM"
/*Icones*/
import gear_icon from "../images/icons/gear-solid.svg"
import chart from "../images/icons/chart-line-solid.svg"
import chevron from "../images/icons/chevron.svg"
function RMM({ dataRMM, setKey, apikey }) {
	const { arrayRMM, dataValue } = DataRMM(apikey, dataRMM)
	const [walletMenu, setWalletmenu] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(null)
	const [heights, setHeights] = useState([])
	const divRefs = useRef([])
	const onSetKey = (key) => {
		setKey(key)
		setTimeout(() => {
			setWalletmenu(!walletMenu)
		}, 10)
	}

	function formatNumber(number, decimals) {
		if (Number.isInteger(number)) {
			return number.toString()
		} else {
			return number.toFixed(decimals)
		}
	}

	const handleClick = (index) => {
		setSelectedIndex(index === selectedIndex ? null : index)
	}

	useEffect(() => {
		const newHeights = divRefs.current.map((ref) => (ref ? ref.scrollHeight : 0))
		setHeights(newHeights)
	}, [arrayRMM])
	return arrayRMM.length > 0 ? (
		<div className="rmm">
			<h1 className="dashboard_title">RMM</h1>
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
			<div className="rmm_bloc_summary">
				{dataValue && (
					<div className="rmm_summary">
						<div className="rmm_summary_sub">
							<p>Total</p>
							<p className={`${dataValue.value > 0 ? "rmm_positive" : "rmm_negative"}`}>
								{dataValue.value > 0 ? "+" : "-"} {Math.abs(dataValue.value).toFixed(2)} $
							</p>
						</div>
						<div className="rmm_summary_sub">
							<p>Total Déposé</p>
							<p className={`${dataValue.valuePos > 0 ? "rmm_positive" : "rmm_negative"}`}>
								{dataValue.valuePos > 0 ? "+" : "-"} {Math.abs(dataValue.valuePos).toFixed(2)} $
							</p>
						</div>
						<div className="rmm_summary_sub">
							<p>Total Retiré</p>
							<p className={`${dataValue.valueNeg > 0 ? "rmm_positive" : "rmm_negative"}`}>
								{dataValue.valueNeg > 0 ? "+" : "-"} {Math.abs(dataValue.valueNeg).toFixed(2)} $
							</p>
						</div>
					</div>
				)}
				{dataValue && (
					<div className="rmm_summary">
						<div className="rmm_summary_sub">
							<p>Intérêt total perçu</p>
							<p className={`${dataValue.value > 0 ? "rmm_positive" : "rmm_negative"}`}>
								{dataValue.interest > 0 ? "+" : "-"} {Math.abs(dataValue.interest).toFixed(2)} $
							</p>
						</div>
						<div className="rmm_summary_sub">
							<p>Performance</p>
							<p className={`${dataValue.roi > 0 ? "rmm_positive" : "rmm_negative"}`}>
								{dataValue.roi > 0 ? "+" : "-"} {Math.abs(dataValue.roi).toFixed(2)} %
							</p>
						</div>
					</div>
				)}
			</div>
			<div className="rmm_bloc_transaction">
				{arrayRMM.map((subArrayRMM, index1) => {
					let date = null
					if (subArrayRMM.length > 0) {
						date = new Date(subArrayRMM[0].time)
					}
					let value = 0
					for (var j = 0; j < subArrayRMM.length; j++) {
						value += subArrayRMM[j].value
					}
					const isOpen = index1 === selectedIndex
					return (
						date !== null && (
							<div key={index1} className="rmm_bloc_date" onClick={() => handleClick(index1)}>
								<div className="rmm_bloc_date_title">
									<p>
										{(date.getMonth() + 1).toString().padStart(2, "0")}/{date.getFullYear()}
									</p>
									<div className="rmm_bloc_date_title_bloc_img">
										<p className={`${value > 0 ? "rmm_positive" : "rmm_negative"}`}>
											{value > 0 ? "+" : "-"} {formatNumber(Math.abs(value), 2)} $
										</p>
										<img
											src={chevron}
											height={20}
											alt=""
											className="rmm_bloc_date_title_img"
											style={{
												transform: isOpen ? "rotate(90deg)" : "rotate(-90deg)",
												transition: "transform 0.3s ease-out",
											}}
										/>
									</div>
								</div>
								<div
									ref={(el) => (divRefs.current[index1] = el)}
									className={`rmm_sub_bloc_transaction ${isOpen ? "open" : ""}`}
									style={{
										height: isOpen ? `${heights[index1]}px` : "0px",
										marginTop: isOpen ? `10px` : "0px",
										overflow: "hidden",
										transition: "height 0.3s ease-out",
									}}
								>
									{subArrayRMM.map((content, index2) => {
										const date_content = new Date(content.time)
										return (
											<div key={index2} className="rmm_transaction">
												<p>
													{date_content.getDate().toString().padStart(2, "0")}/
													{(date_content.getMonth() + 1).toString().padStart(2, "0")}/
													{date_content.getFullYear()}{" "}
													{date_content.getHours().toString().padStart(2, "0")}:
													{date_content.getMinutes().toString().padStart(2, "0")}:
													{date_content.getSeconds().toString().padStart(2, "0")}
												</p>
												<p className={`${content.value > 0 ? "rmm_positive" : "rmm_negative"}`}>
													{content.value > 0 ? "+" : "-"} {Math.abs(content.value).toFixed(2)}{" "}
													$
													{content.interest && (
														<img
															src={chart}
															alt=""
															height={12}
															className={`rmm_img ${
																content.value > 0
																	? "rmm_img_positive"
																	: "rmm_img_negative"
															}`}
														/>
													)}
												</p>
											</div>
										)
									})}
								</div>
							</div>
						)
					)
				})}
			</div>
		</div>
	) : (
		<div className="map_chargement">
			<h2>Chargement</h2>
			<div className="map_chargement_spinner"></div>
		</div>
	)
}

export default RMM
