import { useForm } from "use-inertia-form"
import { Grid, Table, Text, Title, Tooltip } from "@/Components"
import { FormGroup } from "@/Components/Form"
import { aOrAn } from "@/lib/strings"
import ColumnToggle from "./ColumnToggle"
import SwitchRow from "./SwitchRow"
import { tableRows, type JobTitleFormData } from "./formData"

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
								<ColumnToggle permission="index" /> <Tooltip label="Show the fu">List</Tooltip>
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
