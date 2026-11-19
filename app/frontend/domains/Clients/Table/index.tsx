import { Table } from "@/components"
import { useServerTableFilters } from "@/components/Table/useServerTableFilters"

import { useClientTableColumns } from "./columns"

interface ClientTableProps {
	records: Schema.ClientsIndex[]
	canUpdates?: Record<string, boolean>
	model: string
	serverFiltered?: boolean
}

const clientServerFilterFields = [
	{ param: "first_name", kind: "text" as const },
	{ param: "last_name", kind: "text" as const },
	{ param: "number", kind: "text" as const },
	{ param: "uci_number", kind: "text" as const },
	{ param: "active_at", kind: "text" as const },
]

export function ClientTable({ records, canUpdates = {}, model, serverFiltered = false }: ClientTableProps) {
	const { values, setText } = useServerTableFilters({
		fields: clientServerFilterFields,
		only: ["clients", "pagination", "can_updates"],
		enabled: serverFiltered,
	})

	const columns = useClientTableColumns({
		serverFiltered,
		canUpdates,
		filters: {
			firstName: typeof values.first_name === "string" ? values.first_name : "",
			lastName: typeof values.last_name === "string" ? values.last_name : "",
			number: typeof values.number === "string" ? values.number : "",
			uciNumber: typeof values.uci_number === "string" ? values.uci_number : "",
		},
		setText,
	})

	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
