import { useTranslation } from "react-i18next"

import { Avatar, Badge, Group, Link, Menu, Table } from "@/components"
import { formatter, Routes } from "@/lib"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface EmployeesTableProps {
	employees: Schema.EmployeesPersisted[]
	employee_hours: Record<string, EmployeeHoursMap>
	approvalWindowOpen: boolean
}

export default function EmployeesTable({ employees, employee_hours, approvalWindowOpen }: EmployeesTableProps) {
	const { t } = useTranslation()

	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell>{ t("views.timesheets.index.employees.employee") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.index.employees.regular_hours") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.index.employees.ot_hours") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.index.employees.pto_sick") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.index.employees.exceptions") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.index.employees.status") }</Table.HeadCell>
					<Table.HeadCell>{ t("views.timesheets.index.employees.actions") }</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				{ employees.map(employee => (
					<Table.Row key={ employee.id } name={ employee.id }>
						<Table.Cell>
							<Link href={ Routes.payrollEmployeeReview(employee.id) }>
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
						</Table.Cell>
						<Table.Cell>
							{ (() => {
								const hours = employee_hours[employee.id]?.regular_hours
								return typeof hours === "number" ? formatter.number.decimal(hours, 2) : t("views.timesheets.index.no_value")
							})() }
						</Table.Cell>
						<Table.Cell>
							{ (() => {
								const hours = employee_hours[employee.id]?.ot_hours
								return typeof hours === "number" ? formatter.number.decimal(hours, 2) : t("views.timesheets.index.no_value")
							})() }
						</Table.Cell>
						<Table.Cell>{ t("views.timesheets.index.no_value") }</Table.Cell>
						<Table.Cell>{ t("views.timesheets.index.no_value") }</Table.Cell>
						<Table.Cell>
							<Badge variant="light" color="yellow" size="sm">
								{ t("views.timesheets.index.status_pending") }
							</Badge>
						</Table.Cell>
						<Table.Cell>
							<Group gap="xs" wrap="nowrap">
								<Link
									as="button"
									href={ Routes.payrollEmployeeReview(employee.id) }
									buttonProps={ { variant: "light", size: "xs" } }
								>
									{ t("views.timesheets.index.employees.review") }
								</Link>
								{ approvalWindowOpen && (
									<Menu position="bottom-end">
										<Menu.Target />
										<Menu.Dropdown>
											<Menu.Item>{ t("views.timesheets.index.employees.approve") }</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								) }
							</Group>
						</Table.Cell>
					</Table.Row>
				)) }
			</Table.Body>
		</Table>
	)
}
