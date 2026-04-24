import { useTranslation } from "react-i18next"

import { Table, Link, Group, Avatar } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { DateTimeFormatter } from "@/components/Formatters"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

export function EmployeeTable(props: TableProps) {
	const { t } = useTranslation()

	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell style={ { width: 40 } }>{ "" }</Table.HeadCell>
					<Table.HeadCell sort="people.first_name">{ t("views.employees.table.first_name") }</Table.HeadCell>
					<Table.HeadCell sort="people.last_name">{ t("views.employees.table.last_name") }</Table.HeadCell>
					<Table.HeadCell sort="employee.job_titles.name">{ t("views.employees.table.job_title") }</Table.HeadCell>
					<Table.HeadCell sort="active_at">{ t("views.employees.table.hire_date") }</Table.HeadCell>
					<Table.HeadCell className="actions">{ t("views.employees.table.actions") }</Table.HeadCell>
				</Table.Row>
			</Table.Head>

			<Table.Body>
				<Table.RowIterator render={ (employee: Schema.EmployeesIndex) => (
					<Table.Row key={ employee.id }>
						<Table.Cell>
							<Avatar
								src={ undefined }
								radius="xl"
								size="sm"
								color={ employee.color ?? "gray" }
							>
								{ (employee.full_name ?? employee.name ?? "?").slice(0, 2).toUpperCase() }
							</Avatar>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee.person.first_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee.person.last_name }</Link>
						</Table.Cell>

						<Table.Cell>
							{ String(employee.job_title?.name ?? "") }
						</Table.Cell>

						<Table.Cell>
							<DateTimeFormatter
								format="dateShort"
								tooltipFormats={ [ "fromNow"] }
							>
								{ employee.active_at }
							</DateTimeFormatter>
						</Table.Cell>

						<Table.Cell>
							<Group wrap="nowrap" gap="xs">
								<EditButton href={ Routes.editEmployee(employee.slug) } />
								<ScheduleButton href={ Routes.scheduleEmployee(employee.slug) } />
							</Group>
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}
