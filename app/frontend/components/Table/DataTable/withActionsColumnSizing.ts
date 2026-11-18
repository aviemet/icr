import { type DataTableColumn } from "mantine-datatable"

export function withActionsColumnSizing<T extends object>(columns: DataTableColumn<T>[]) {
	return columns.map(column => {
		if(String(column.accessor) !== "actions") return column

		return {
			...column,
			width: "1%",
			cellsStyle: (record: T, index: number) => {
				const existing = typeof column.cellsStyle === "function"
					? column.cellsStyle(record, index)
					: column.cellsStyle

				if(existing && typeof existing === "object" && !Array.isArray(existing)) {
					return {
						...existing,
						whiteSpace: "nowrap",
					}
				}

				return { whiteSpace: "nowrap" }
			},
		}
	})
}
