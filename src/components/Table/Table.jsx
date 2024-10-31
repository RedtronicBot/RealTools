import TableBody from "./TableBody"
import TableHead from "./TableHead"
import { useSortableTable } from "./useSortableTable"

const Table = ({ tableData1, columns, onSetContract, historyData }) => {
    const [tableData, handleSorting] = useSortableTable(tableData1)

    return (
        <>
            {tableData && (
                <table className="dashboard_table">
                    <TableHead {...{ columns, handleSorting }} />
                    <TableBody {...{ columns, tableData, onSetContract, historyData }} />
                </table>
            )}
        </>
    )
}

export default Table
