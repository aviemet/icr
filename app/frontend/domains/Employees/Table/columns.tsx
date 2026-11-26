import { useTranslation } from "react-i18next"

import { Group, Link, Presence, type TableColumn } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { DateTimeFormatter } from "@/components/Formatters"
import {
	DateRangeFilterInput,
	type DateRangeFilterValue,
} from "@/components/Table/Filters"
import { Routes } from "@/lib"

import { ColumnTextFilter } from "./ColumnTextFilter"
import {
	employeeJobTitleName,
	type EmployeeColumnFilters,
} from "./filterEmployees"
import { JobTitleFilter } from "./JobTitleFilter"

type UseEmployeeTableColumnsOptions = {
	serverFiltered: boolean
	canUpdates?: Record<string, boolean>
	filters: EmployeeColumnFilters
	jobTitleOptions: string[]
	setText: (param: string, value: string) => void
	setMulti: (param: string, value: string[]) => void
	setDateRange: (param: string, value: DateRangeFilterValue) => void
}

export function useEmployeeTableColumns({
	serverFiltered,
	canUpdates = {},
	filters,
	jobTitleOptions,
	setText,
	setMulti,
	setDateRange,
}: UseEmployeeTableColumnsOptions): TableColumn<Schema.EmployeesIndex>[] {
	const { t } = useTranslation()

	return [
		{
			accessor: "people.first_name",
			title: t("views.employees.table.first_name"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.firstName !== "",
					filter: (
						<ColumnTextFilter
							label={ t("views.employees.table.first_name") }
							placeholder={ t("views.employees.table.first_name") }
							value={ filters.firstName }
							onChange={ value => setText("first_name", value) }
						/>
					),
				}
				: {}),
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.first_name }</Link>,
		},
		{
			accessor: "people.last_name",
			title: t("views.employees.table.last_name"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.lastName !== "",
					filter: (
						<ColumnTextFilter
							label={ t("views.employees.table.last_name") }
							placeholder={ t("views.employees.table.last_name") }
							value={ filters.lastName }
							onChange={ value => setText("last_name", value) }
						/>
					),
				}
				: {}),
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.last_name }</Link>,
		},
		{
			accessor: "employee.job_titles.name",
			title: t("views.employees.table.job_title"),
			sortable: true,
			...(serverFiltered
				? {
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
				}
				: {}),
			render: (employee) => employeeJobTitleName(employee),
		},
		{
			accessor: "active_at",
			title: t("views.employees.table.hire_date"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.hireDate.start !== "" && filters.hireDate.end !== "",
					filter: ({ close }) => (
						<DateRangeFilterInput
							label={ t("views.employees.table.hire_date") }
							placeholder={ t("views.employees.table.hire_date") }
							value={ filters.hireDate }
							onChange={ value => setDateRange("active_at", value) }
							close={ close }
						/>
					),
				}
				: {}),
			render: (employee) => (
				<DateTimeFormatter format="dateShort" tooltipFormats={ ["fromNow"] }>
					{ employee.active_at }
				</DateTimeFormatter>
			),
		},
		{
			accessor: "number",
			title: t("views.employees.table.number"),
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.number !== "",
					filter: (
						<ColumnTextFilter
							label={ t("views.employees.table.number") }
							placeholder={ t("views.employees.table.number") }
							value={ filters.number }
							onChange={ value => setText("number", value) }
						/>
					),
				}
				: {}),
			render: (employee) => <Presence>{ employee.number }</Presence>,
		},
		{
			accessor: "actions",
			title: t("views.employees.table.actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (employee) => (
				<Group wrap="nowrap" gap="xs">
					{ canUpdates[employee.id] && (
						<EditButton href={ Routes.editEmployee(employee.slug) } />
					) }
					<ScheduleButton href={ Routes.scheduleEmployee(employee.slug) } />
				</Group>
			),
		},
	]
}

