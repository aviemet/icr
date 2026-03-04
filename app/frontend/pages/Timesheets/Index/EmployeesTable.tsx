import { useTranslation } from "react-i18next"

import { Link, Table } from "@/components"

interface EmployeesTableProps {
	employees: Schema.EmployeesIndex[]
}

export default function EmployeesTable({ employees }: EmployeesTableProps) {
	const { t } = useTranslation()

	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell>{ t("views.payroll.index.employees.name") }</Table.HeadCell>
					<Table.HeadCell className="actions">{ t("views.payroll.index.employees.actions") }</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				{ employees.map(employee => (
					<Table.Row key={ employee.id }>
						<Table.Cell>
							<Link href={ `/payroll/employees/${employee.id}` }>
								{ employee.full_name }
							</Link>
						</Table.Cell>
						<Table.Cell>

						</Table.Cell>
					</Table.Row>
				)) }
			</Table.Body>
		</Table>
	)
}
