import chart from '../../images/icons/chart-line-solid.svg'
const TableBody = ({ tableData, columns, onSetContract, historyData }) => {
    return (
        <tbody>
            {tableData.map((data,index) => {
                const FieldDate = data.rentStartDate
                const newDate = FieldDate.replace(' ', 'T')
                const rentStartedDate = new Date(newDate)
                const today = new Date() 
                var history = historyData.find(obj => obj.uuid.toLowerCase() === data.gnosisContract)
                return (
                    <tr key={index}>
                        {columns.map(({ accessor },indextd) => {
                            const tData = data[accessor] ? data[accessor] : "0"
                            return <td key={accessor}>
                                <div className={`dashboard_table_td ${indextd%12 === 0 && "first"}`}>
                                    <p>{![8, 9, 10, 11].includes(indextd % 12) && tData}</p>
                                    {indextd%11 === 0 &&((history.history.length > 0 && today > rentStartedDate) || (history.history.length > 0 && data.rentalType === 'pre_construction'))&& <img src={chart} alt='' height={18} className='dashboard_grid_graph_img' onClick={()=>onSetContract(data.gnosisContract)} />}
                                </div>
                            </td>
                        })}
                    </tr>
                )
            })}
        </tbody>
    )
   }
   
export default TableBody