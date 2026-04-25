import { Grid, Table, Text, Title } from "@/components"
import { useFormField } from "@/components/Form"
import { aOrAn } from "@/lib/strings"

import { ColumnToggle } from "./ColumnToggle"
import { tableRows } from "./formData"
import { SwitchRow } from "./SwitchRow"

export function PermissionsSection() {
	const [jobTitleName] = useFormField("job_title.name")

	return (
		<>
			<Grid.Col>
				<Title order={ 3 }>Permissions</Title>
				<Text>Select what { aOrAn(String(jobTitleName ?? ""), { articleOnly: true }) } <strong>{ String(jobTitleName ?? "") }</strong> has access to do in the application</Text>
			</Grid.Col>

			<Grid.Col>
				<Table>
					<Table.Head>
						<Table.Row>
							<Table.HeadCell>
								All
							</Table.HeadCell>

							<Table.HeadCell>
								Record Type
							</Table.HeadCell>

							<Table.HeadCell>
								<ColumnToggle permission="index" /> List
							</Table.HeadCell>

							<Table.HeadCell>
								<ColumnToggle permission="show" /> View
							</Table.HeadCell>

							<Table.HeadCell>
								<ColumnToggle permission="create" /> Create
							</Table.HeadCell>

							<Table.HeadCell>
								<ColumnToggle permission="update" /> Edit
							</Table.HeadCell>

							<Table.HeadCell>
								<ColumnToggle permission="delete" /> Delete
							</Table.HeadCell>

						</Table.Row>
					</Table.Head>

					<Table.Body>{ tableRows.map(row => (
						<SwitchRow key={ row.model } { ...row } />
					)) }</Table.Body>
				</Table>
			</Grid.Col>
		</>
	)
}
