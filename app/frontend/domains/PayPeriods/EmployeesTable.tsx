import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Avatar, Badge, Button, Group, Link, Table, type TableColumn } from "@/components"
import { payrollApprovalStatus } from "@/domains/PayPeriods/payrollFilters"
import { formatter, Routes } from "@/lib"


interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface EmployeeExceptionsMap {
	exception_count?: number
}

interface EmployeesTableProps {
	payPeriodId: string
	employees: Schema.EmployeesPersisted[]
	employee_hours: Record<string, EmployeeHoursMap>
	canApprove: boolean
	timesheetIdsByEmployee: Record<string, string>
	approvedAtByEmployee: Record<string, string>
	employeeExceptions: Record<string, EmployeeExceptionsMap>
	pagination: Schema.Pagination
}

export function EmployeesTable({
	payPeriodId,
	employees,
	employee_hours,
	canApprove,
	timesheetIdsByEmployee,
	approvedAtByEmployee,
	employeeExceptions,
	pagination,
}: EmployeesTableProps) {
	const { t } = useTranslation()
	const noValue = t("views.timesheets.index.no_value")

	const formatHours = (hours: number | undefined) =>
		typeof hours === "number" ? formatter.number.decimal(hours, 2) : noValue

	const formatExceptionCount = (count: number | undefined) =>
		typeof count === "number" && count > 0 ? String(count) : noValue

	const columns: TableColumn<Schema.EmployeesPersisted>[] = [
		{
			accessor: "employee",
			title: t("views.timesheets.index.employees.employee"),
			sortable: false,
			render: (employee) => (
				<Link href={ Routes.periodEmployeeReview(payPeriodId, employee.id) }>
					<Group gap="sm" wrap="nowrap" style={ { display: "inline-flex" } }>
						<Avatar
							src={ undefined }
							radius="xl"
							size="sm"
							color={ employee.color ?? "gray" }
						>
							{ (employee.full_name ?? employee.name ?? "?").slice(0, 2).toUpperCase() }
						</Avatar>
						<span>{ employee.full_name ?? employee.name }</span>
					</Group>
				</Link>
			),
		},
		{
			accessor: "regular_hours",
			title: t("views.timesheets.index.employees.regular_hours"),
			sortable: false,
			render: (employee) => formatHours(employee_hours[employee.id]?.regular_hours),
		},
		{
			accessor: "ot_hours",
			title: t("views.timesheets.index.employees.ot_hours"),
			sortable: false,
			render: (employee) => formatHours(employee_hours[employee.id]?.ot_hours),
		},
		{
			accessor: "pto_sick",
			title: t("views.timesheets.index.employees.pto_sick"),
			sortable: false,
			render: () => noValue,
		},
		{
			accessor: "exceptions",
			title: t("views.timesheets.index.employees.exceptions"),
			sortable: false,
			render: (employee) => formatExceptionCount(employeeExceptions[employee.id]?.exception_count),
		},
		{
			accessor: "status",
			title: t("views.timesheets.index.employees.status"),
			sortable: false,
			render: (employee) => {
				const status = payrollApprovalStatus(approvedAtByEmployee[employee.id])
				const approved = status === "approved"

				return (
					<Badge variant="light" color={ approved ? "green" : "yellow" } size="sm">
						{ approved
							? t("views.timesheets.index.status_approved")
							: t("views.timesheets.index.status_pending") }
					</Badge>
				)
			},
		},
		{
			accessor: "actions",
			title: t("views.timesheets.index.employees.actions"),
			sortable: false,
			render: (employee) => {
				const timesheetId = timesheetIdsByEmployee[employee.id]
				const pending = payrollApprovalStatus(approvedAtByEmployee[employee.id]) === "pending"

				return (
					<Group gap="xs" wrap="nowrap">
						<Link
							as="button"
							href={ Routes.periodEmployeeReview(payPeriodId, employee.id) }
							buttonProps={ { variant: "light", size: "xs" } }
						>
							{ t("views.timesheets.index.employees.review") }
						</Link>
						{ canApprove && timesheetId && pending && (
							<Button
								size="xs"
								variant="filled"
								onClick={ () => router.post(Routes.approveTimesheet(timesheetId)) }
							>
								{ t("views.timesheets.index.employees.approve") }
							</Button>
						) }
						{ canApprove && timesheetId && !pending && (
							<Button
								size="xs"
								variant="default"
								onClick={ () => router.post(Routes.unapproveTimesheet(timesheetId)) }
							>
								{ t("views.timesheets.index.employees.unapprove") }
							</Button>
						) }
					</Group>
				)
			},
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ employees }
			pagination={ pagination }
			model="employees"
			selectable
		/>
	)
}
