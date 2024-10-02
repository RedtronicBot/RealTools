import { useState } from "react"
import default_arrow from "../../images/table/default.png"
import up_arrow from "../../images/table/up_arrow.png"
import down_arrow from "../../images/table/down_arrow.png"
const TableHead = ({ columns, handleSorting }) => {
    const [sortField, setSortField] = useState("")
    const [order, setOrder] = useState("asc")
    const handleSortingChange = (accessor) => {
        let sortOrder = "asc"

        if (accessor === sortField) {
            if (order === "asc") {
                sortOrder = "desc"
            } else if (order === "desc") {
                sortOrder = "default"
            }
        }
        setSortField(accessor)
        setOrder(sortOrder)
        handleSorting(accessor, sortOrder)
    }
    return (
        <thead>
        <tr>
            {columns.map(({ label, accessor },index) => {
                const img_arrow = sortField === accessor && order === "asc" ? up_arrow : sortField === accessor && order === "desc" ? down_arrow : default_arrow
                return (
                    <th key={accessor} onClick={() => handleSortingChange(accessor)}>
                        <div className={`dashboard_table_th ${index === 0 && "first"}`}>
                            <p>{label}</p> 
                            <img src={img_arrow} alt="arrow"/>
                        </div>
                    </th>
                )
            })}
        </tr>
        </thead>
  )
}

   
export default TableHead