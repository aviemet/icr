import { Box, Grid, Paper, Table, Text, Title } from "@/components"
import { useFormField } from "@/components/Form"
import { Switch } from "@/components/Inputs"
import { aOrAn } from "@/lib/strings"

import { ColumnToggle } from "./ColumnToggle"
import { tableRows } from "./formData"
import * as classes from "./PermissionsSection.css"
import { SwitchRow } from "./SwitchRow"

export function PermissionsSection() {
	const [jobTitleName] = useFormField("job_title.name")

	return (
		<>
			<Grid.Col>
				<Title order={ 3 }>Permissions</Title>
				<Text className={ classes.intro }>
					Select what { aOrAn(String(jobTitleName ?? ""), { articleOnly: true }) }{ " " }
					<strong>{ String(jobTitleName ?? "") }</strong> has access to do in the application.
					Relationship limits (attended clients, managed employees) still apply in policies.
				</Text>
			</Grid.Col>

			<Grid.Col>
				<Paper
					withBorder
					radius="md"
					className={ classes.panel }
				>
					<Table
						wrapper={ false }
						className={ classes.table }
						horizontalSpacing="md"
						verticalSpacing="sm"
						withRowBorders
					>
						<Table.Head>
							<Table.Row>
								<Table.HeadCell>
									<span className={ classes.columnHeader }>All</span>
								</Table.HeadCell>

								<Table.HeadCell>
									Record Type
								</Table.HeadCell>

								<Table.HeadCell>
									<ColumnToggle permission="index" label="List" />
								</Table.HeadCell>

								<Table.HeadCell>
									<ColumnToggle permission="show" label="View" />
								</Table.HeadCell>

								<Table.HeadCell>
									<ColumnToggle permission="create" label="Create" />
								</Table.HeadCell>

								<Table.HeadCell>
									<ColumnToggle permission="update" label="Edit" />
								</Table.HeadCell>

								<Table.HeadCell>
									<ColumnToggle permission="delete" label="Delete" />
								</Table.HeadCell>
							</Table.Row>
						</Table.Head>

						<Table.Body>{ tableRows.map(row => (
							<SwitchRow key={ row.model } { ...row } />
						)) }</Table.Body>
					</Table>

					<Box className={ classes.adminOption }>
						<Switch
							size="xs"
							name="permissions.admin"
							label="Grant all listed actions"
						/>
					</Box>
				</Paper>
			</Grid.Col>
		</>
	)
}
