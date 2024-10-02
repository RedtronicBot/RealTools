import TableBody from "./TableBody"
import TableHead from "./TableHead"
import { useSortableTable } from "./useSortableTable"
const Table = ({tableData1,columns}) => {
    const [tableData, handleSorting] = useSortableTable(tableData1)
    return (
        <>
        {tableData1 && <table className="dashboard_table">
            <TableHead {...{ columns, handleSorting }}/>
            <TableBody {...{ columns, tableData }} />
        </table>}
        </>
    )
}

export default Table