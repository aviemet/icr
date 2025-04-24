import { useForm } from "use-inertia-form"

import { Grid, Table, Text, Title, Tooltip } from "@/components"
import { FormGroup } from "@/components/Form"
import { aOrAn } from "@/lib/strings"

import ColumnToggle from "./ColumnToggle"
import { tableRows, type JobTitleFormData } from "./formData"
import SwitchRow from "./SwitchRow"

const PermissionsSection = () => {
	const { getData } = useForm<JobTitleFormData>()

	return (

		<FormGroup model="permissions">
			<Grid.Col>
				<Title order={ 3 }>Permissions</Title>
				<Text>Select what { aOrAn(getData("job_title.name"), { articleOnly: true }) } <strong>{ getData("job_title.name") }</strong> has access to do in the application</Text>
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
		</FormGroup>
	)
}

export default PermissionsSection
