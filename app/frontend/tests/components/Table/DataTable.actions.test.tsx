import { type DataTableColumn } from "mantine-datatable"
import { describe, expect, it } from "vitest"


import { withActionsColumnSizing } from "@/components/Table/DataTable/withActionsColumnSizing"

interface Row {
	id: string
	name: string
}

describe("withActionsColumnSizing", () => {
	it("forces actions columns to content width", () => {
		const columns: DataTableColumn<Row>[] = [
			{ accessor: "name", title: "Name" },
			{ accessor: "actions", title: "Actions", width: 240 },
		]

		const sized = withActionsColumnSizing(columns)

		expect(sized[0]?.width).toBeUndefined()
		expect(sized[1]?.width).toBe("1%")
	})
})
