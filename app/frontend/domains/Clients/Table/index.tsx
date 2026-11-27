import { DataTable } from "@/components"
import { type ServerTableFilterField } from "@/components/Table/serverTableFilters"
import { useServerTableFilters } from "@/components/Table/useServerTableFilters"

import { useClientTableColumns } from "./columns"

interface ClientTableProps {
	records: Schema.ClientsIndex[]
	canUpdates?: Record<string, boolean>
	model: string
	serverFiltered?: boolean
}

const clientServerFilterFields: ServerTableFilterField[] = [
	{ param: "first_name", kind: "text" },
	{ param: "last_name", kind: "text" },
	{ param: "number", kind: "text" },
	{ param: "uci_number", kind: "text" },
	{ param: "active_at", kind: "text" },
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
		<DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
