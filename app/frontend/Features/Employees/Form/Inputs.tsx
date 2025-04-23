import React from "react"
import { useForm } from "use-inertia-form"

import { Button, Divider, Grid, Tooltip } from "@/Components"
import { DateInput, Select, Submit, TextInput } from "@/Components/Form"
import FormColorPickerInput from "@/Components/Form/Inputs/ColorPickerInput"
import { RandomizeIcon } from "@/Components/Icons"
import { generateRandomColor } from "@/lib"

import { EmployeeFormData } from "."

export interface EmployeeInputProps {
	employee: Schema.EmployeesFormData
	jobTitles: Schema.EmployeeJobTitlesOptions
}

const Inputs = ({ employee, jobTitles }: EmployeeInputProps) => {
	const { getData, setData } = useForm<EmployeeFormData>()

	const statusOptions = [
		{ value: "applicant", label: "Applicant" },
		{ value: "employed", label: "Employee" },
	]

	const handleRandomizeColor = () => {
		setData("employee.color", generateRandomColor())
	}

	return (
		<>
			<Grid.Col span={ { xxs: 12, sm: 6 } }>
				<Select
					name="status"
					label="Status"
					options={ statusOptions }
				/>
			</Grid.Col>

			<Divider />

			<Grid.Col span={ { xs: 12, sm: 7 } }>
				<TextInput name="person.first_name" label="First Name" />
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 7 } }>
				<TextInput name="person.middle_name" label="Middle Name" />
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 7 } }>
				<TextInput name="person.last_name" label="Last Name" />
			</Grid.Col>

			{ getData("employee.status") === "employed" &&
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<TextInput name="number" label="Employee Number" />
				</Grid.Col>
			}

			<Grid.Col span={ { xxs: 12, sm: 7 } }>
				<DateInput name="active_at" label="Start Date" />
			</Grid.Col>

			<Grid.Col span={ { xxs: 12, sm: 7 } }>
				<Select
					name="job_title_id"
					label="Job Title"
					options={ jobTitles }
				/>
			</Grid.Col>

			<Grid.Col span={ 12 }>
				<FormColorPickerInput name="color" label="Default Calendar Color">
					<Tooltip label="Random" position="right-end">
						<Button variant="transparent" mx={ 0 } px="xxs" onClick={ handleRandomizeColor }><RandomizeIcon /></Button>
					</Tooltip>
				</FormColorPickerInput>
			</Grid.Col>

			<Grid.Col>
				<Submit>{ employee.id ? "Update" : "Create" } Employee</Submit>
			</Grid.Col>
		</>
	)
}

export default Inputs
