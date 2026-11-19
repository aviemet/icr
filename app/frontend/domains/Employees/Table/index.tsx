import { Table } from "@/components"
import { useServerTableFilters } from "@/components/Table/useServerTableFilters"

import { useEmployeeTableColumns } from "./columns"
import {
	employeeFiltersFromServerValues,
	employeeServerFilterFields,
	employeeServerFilterOnly,
} from "./employeeTableFilters"

interface EmployeeTableProps {
	records: Schema.EmployeesIndex[]
	canUpdates?: Record<string, boolean>
	model?: string
	jobTitleOptions?: string[]
	serverFiltered?: boolean
}

export function EmployeeTable({
	records,
	canUpdates = {},
	model,
	jobTitleOptions = [],
	serverFiltered = false,
}: EmployeeTableProps) {
	const { values, setText, setMulti } = useServerTableFilters({
		fields: employeeServerFilterFields,
		only: employeeServerFilterOnly,
		enabled: serverFiltered,
	})
	const filters = employeeFiltersFromServerValues(values)
	const columns = useEmployeeTableColumns({
		serverFiltered,
		canUpdates,
		filters,
		jobTitleOptions,
		setText,
		setMulti,
	})


	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
			selectionAvatar={ (employee) => {
				const firstInitial = employee.person.first_name?.[0] ?? ""
				const lastInitial = employee.person.last_name?.[0] ?? ""
				const initials = `${firstInitial}${lastInitial}`.toUpperCase()

				return {
					color: employee.color ?? "gray",
					initials: initials === "" ? "?" : initials,
				}
			} }
		/>
	)
}
