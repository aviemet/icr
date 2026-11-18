import { Group, Link, Paper, Table, Text } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { Routes } from "@/lib"

import * as classes from "./DepartmentsTable.css"

interface DepartmentTableProps {
	records: Schema.EmployeeDepartmentsIndex[]
}

export function DepartmentTable({ records }: DepartmentTableProps) {
	return (
		<Paper
			withBorder
			radius="md"
			shadow="xs"
			className={ classes.panel }
			style={ { overflow: "hidden" } }
		>
			<Table
				className={ classes.table }
				horizontalSpacing="md"
				verticalSpacing="sm"
				withRowBorders
			>
				<Table.Head>
					<Table.Row>
						<Table.HeadCell>Name</Table.HeadCell>
						<Table.HeadCell>Description</Table.HeadCell>
						<Table.HeadCell style={ { width: 96, textAlign: "right" } }>
							Actions
						</Table.HeadCell>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					{ records.length === 0 && (
						<Table.Row>
							<Table.Cell colSpan={ 3 }>
								<Text size="sm" c="dimmed">
									No departments yet. Create one to get started.
								</Text>
							</Table.Cell>
						</Table.Row>
					) }

					{ records.map(department => {
						const slug = String(department.slug ?? "")
						const name = String(department.name ?? "")
						const description = String(department.description ?? "")

						return (
							<Table.Row key={ slug || name }>
								<Table.Cell>
									<Link href={ Routes.settingsDepartment(slug) }>
										<Text fw={ 500 } span>{ name }</Text>
									</Link>
								</Table.Cell>
								<Table.Cell>
									<Text size="sm" c={ description ? undefined : "dimmed" } lineClamp={ 2 }>
										{ description || "—" }
									</Text>
								</Table.Cell>
								<Table.Cell style={ { textAlign: "right" } }>
									<Group gap="xs" justify="flex-end" wrap="nowrap">
										<EditButton
											href={ Routes.editSettingsDepartment(slug) }
											label={ name }
										/>
										<DeleteButton
											href={ Routes.settingsDepartment(slug) }
											label={ name }
										/>
									</Group>
								</Table.Cell>
							</Table.Row>
						)
					}) }
				</Table.Body>
			</Table>
		</Paper>
	)
}
