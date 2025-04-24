import React from "react"
import { useForm } from "use-inertia-form"

import { Button, Divider, Grid, Group, Stack, Text, Tooltip } from "@/components"
import { DateInput, Select, Submit, TextInput } from "@/components/Form"
import FormColorPickerInput from "@/components/Form/Inputs/ColorPickerInput"
import { RandomizeIcon } from "@/components/Icons"
import JobTitlesDropdownInput from "@/features/Dropdowns/JobTitlesDropdown/JobTitlesDropdownInput"
import { generateRandomColor } from "@/lib"

import { EmployeeFormData } from "."

export interface EmployeeInputProps {
	employee: Schema.EmployeesFormData
	jobTitles?: Schema.EmployeeJobTitlesOptions[]
}

const Inputs = ({ employee, jobTitles = [] }: EmployeeInputProps) => {
	const { getData, setData } = useForm<EmployeeFormData>()

	const statusOptions = [
		{ value: "applicant", label: "Applicant" },
		{ value: "employed", label: "Employee" },
	]

	const handleRandomizeColor = () => {
		setData("employee.color", generateRandomColor())
	}

	const formattedJobTitles = jobTitles.map(title => ({
		value: title.id.toString(),
		label: title.name,
	}))

	return (
		<Stack gap="xl">
			<Stack gap="md">
				<Grid gutter="lg">
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<Select
							name="status"
							label="Employment Status"
							options={ statusOptions }
						/>
					</Grid.Col>
				</Grid>
			</Stack>

			<Divider />

			<Stack gap="md">
				<Text size="sm" fw={ 500 } c="dimmed">Personal Information</Text>
				<Grid gutter="lg">
					<Grid.Col span={ { xs: 12, sm: 6, md: 4 } }>
						<TextInput name="person.first_name" label="First Name" />
					</Grid.Col>

					<Grid.Col span={ { xs: 12, sm: 6, md: 4 } }>
						<TextInput name="person.middle_name" label="Middle Name" />
					</Grid.Col>

					<Grid.Col span={ { xs: 12, sm: 6, md: 4 } }>
						<TextInput name="person.last_name" label="Last Name" />
					</Grid.Col>
				</Grid>
			</Stack>

			<Stack gap="md">
				<Text size="sm" fw={ 500 } c="dimmed">Employment Details</Text>
				<Grid gutter="lg">
					{ getData("employee.status") === "employed" &&
						<Grid.Col span={ { xs: 12, sm: 6 } }>
							<TextInput name="number" label="Employee Number" />
						</Grid.Col>
					}

					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<DateInput name="active_at" label="Start Date" />
					</Grid.Col>

					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<JobTitlesDropdownInput />
						{ /* <Select
							name="job_title_id"
							label="Job Title"
							options={ formattedJobTitles }
						/> */ }
					</Grid.Col>

					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<FormColorPickerInput name="color" label="Default Calendar Color">
							<Tooltip label="Random" position="right-end">
								<Button variant="transparent" mx={ 0 } px="xxs" onClick={ handleRandomizeColor }><RandomizeIcon /></Button>
							</Tooltip>
						</FormColorPickerInput>
					</Grid.Col>
				</Grid>
			</Stack>

			<Group justify="flex-end">
				<Submit size="md">{ employee.id ? "Update" : "Create" } Employee</Submit>
			</Group>
		</Stack>
	)
}

export default Inputs
