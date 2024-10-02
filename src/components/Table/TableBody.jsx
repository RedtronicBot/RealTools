const TableBody = ({ tableData, columns }) => {
    return (
        <tbody>
            {tableData.map((data,index) => {
                return (
                    <tr key={index}>
                        {columns.map(({ accessor },indextd) => {
                            const tData = data[accessor] ? data[accessor] : "0"
                            return <td key={accessor}>
                                <div className={`dashboard_table_td ${indextd%8 === 0 && "first"}`}>
                                    <p>{tData}</p>
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