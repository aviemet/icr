import { DataTable } from "@/components"
import { useServerTableFilters } from "@/components/Table/useServerTableFilters"

import {
	applicantFiltersFromServerValues,
	applicantServerFilterFields,
	applicantServerFilterOnly,
} from "./applicantTableFilters"
import { useApplicantTableColumns } from "./columns"

interface ApplicantTableProps {
	records: Schema.EmployeesIndex[]
	canUpdates?: Record<string, boolean>
	model?: string
	jobTitleOptions?: string[]
}

export function ApplicantTable({
	records,
	canUpdates = {},
	model,
	jobTitleOptions = [],
}: ApplicantTableProps) {
	const { values, setText, setMulti } = useServerTableFilters({
		fields: applicantServerFilterFields,
		only: applicantServerFilterOnly,
	})
	const filters = applicantFiltersFromServerValues(values)
	const columns = useApplicantTableColumns({
		canUpdates,
		filters,
		jobTitleOptions,
		setText,
		setMulti,
	})

	return (
		<DataTable
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
