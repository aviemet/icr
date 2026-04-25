import { useTranslation } from "react-i18next"

import { Table, Link, Group, Avatar } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { DateTimeFormatter } from "@/components/Formatters"
import { TableColumn } from "@/components/Table"
import { Routes } from "@/lib"

interface EmployeeTableProps {
	records: Schema.EmployeesIndex[]
	pagination?: Schema.Pagination
	model?: string
}

export function EmployeeTable({ records, pagination, model }: EmployeeTableProps) {
	const { t } = useTranslation()

	const columns: TableColumn<Schema.EmployeesIndex>[] = [
		{
			accessor: "avatar",
			title: "",
			sortable: false,
			render: (employee) => (
				<Avatar
					src={ undefined }
					radius="xl"
					size="sm"
					color={ employee.color ?? "gray" }
				>
					{ (employee.full_name ?? employee.name ?? "?").slice(0, 2).toUpperCase() }
				</Avatar>
			),
		},
		{
			accessor: "people.first_name",
			title: t("views.employees.table.first_name"),
			sortable: true,
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.first_name }</Link>,
		},
		{
			accessor: "people.last_name",
			title: t("views.employees.table.last_name"),
			sortable: true,
			render: (employee) => <Link href={ Routes.employee(employee.slug) }>{ employee.person.last_name }</Link>,
		},
		{
			accessor: "employee.job_titles.name",
			title: t("views.employees.table.job_title"),
			sortable: true,
			render: (employee) => String(employee.job_title?.name ?? ""),
		},
		{
			accessor: "active_at",
			title: t("views.employees.table.hire_date"),
			sortable: true,
			render: (employee) => (
				<DateTimeFormatter format="dateShort" tooltipFormats={ ["fromNow"] }>
					{ employee.active_at }
				</DateTimeFormatter>
			),
		},
		{
			accessor: "actions",
			title: t("views.employees.table.actions"),
			sortable: false,
			render: (employee) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editEmployee(employee.slug) } />
					<ScheduleButton href={ Routes.scheduleEmployee(employee.slug) } />
				</Group>
			),
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			pagination={ pagination }
			model={ model }
			selectable
		/>
	)
}
