import { useTranslation } from "react-i18next"

import { Badge, Group, Link, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { employeeStatusBadgeColor } from "@/domains/Employees/employeeStatusBadgeColor"
import { ColumnTextFilter } from "@/domains/Employees/Table/ColumnTextFilter"
import { JobTitleFilter } from "@/domains/Employees/Table/JobTitleFilter"
import { Routes } from "@/lib"

import { applicantJobTitleName, type ApplicantColumnFilters } from "./filterApplicants"
import { StatusFilter } from "./StatusFilter"

type UseApplicantTableColumnsOptions = {
	canUpdates?: Record<string, boolean>
	filters: ApplicantColumnFilters
	jobTitleOptions: string[]
	setText: (param: string, value: string) => void
	setMulti: (param: string, value: string[]) => void
}

export function useApplicantTableColumns({
	canUpdates = {},
	filters,
	jobTitleOptions,
	setText,
	setMulti,
}: UseApplicantTableColumnsOptions): TableColumn<Schema.EmployeesIndex>[] {
	const { t } = useTranslation()

	return [
		{
			accessor: "people.first_name",
			title: t("views.employees.table.first_name"),
			sortable: true,
			filtering: filters.firstName !== "",
			filter: (
				<ColumnTextFilter
					label={ t("views.employees.table.first_name") }
					placeholder={ t("views.employees.table.first_name") }
					value={ filters.firstName }
					onChange={ value => setText("first_name", value) }
				/>
			),
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.first_name }</Link>,
		},
		{
			accessor: "people.last_name",
			title: t("views.employees.table.last_name"),
			sortable: true,
			filtering: filters.lastName !== "",
			filter: (
				<ColumnTextFilter
					label={ t("views.employees.table.last_name") }
					placeholder={ t("views.employees.table.last_name") }
					value={ filters.lastName }
					onChange={ value => setText("last_name", value) }
				/>
			),
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.last_name }</Link>,
		},
		{
			accessor: "employee.job_titles.name",
			title: t("views.employees.table.job_title"),
			sortable: true,
			filtering: filters.jobTitle !== "" || filters.jobTitles.length > 0,
			filter: (
				<JobTitleFilter
					options={ jobTitleOptions }
					searchValue={ filters.jobTitle }
					onSearchChange={ value => setText("job_title", value) }
					selectedTitles={ filters.jobTitles }
					onSelectedTitlesChange={ value => setMulti("job_titles", value) }
				/>
			),
			render: (employee) => applicantJobTitleName(employee),
		},
		{
			accessor: "status",
			title: t("views.employees.table.status"),
			sortable: true,
			filtering: filters.statuses.length > 0,
			filter: (
				<StatusFilter
					selectedStatuses={ filters.statuses }
					onSelectedStatusesChange={ value => setMulti("statuses", value) }
				/>
			),
			render: (employee) => (
				<Badge variant="light" color={ employeeStatusBadgeColor(employee.status) } size="sm">
					{ t(`views.employees.table.statuses.${employee.status}`) }
				</Badge>
			),
		},
		{
			accessor: "actions",
			title: t("views.employees.table.actions"),
			sortable: false,
			render: (employee) => (
				<Group wrap="nowrap" gap="xs">
					{ canUpdates[employee.id] && (
						<EditButton href={ Routes.editEmployee(employee.slug) } />
					) }
				</Group>
			),
		},
	]
}
