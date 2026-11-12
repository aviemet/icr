import React from "react"

import { Button, Divider, Grid, Group, Stack, Text, Tooltip } from "@/components"
import { useFormField, Submit } from "@/components/Form"
import { RandomizeIcon } from "@/components/Icons"
import { ColorPickerInput, DateInput, Select, TextInput } from "@/components/Inputs"
import { type DateInputValue } from "@/components/Inputs"
import { JobTitlesDropdown } from "@/components/Inputs/Dropdowns"
import { generateRandomColor } from "@/lib"

export interface EmployeeInputProps {
	employee: Schema.EmployeesFormData
	jobTitles?: Schema.EmployeeJobTitlesOptions[]
}

function toDateInputValue(v: unknown): DateInputValue {
	if(v === undefined || v === null) return undefined
	if(typeof v === "string" || v instanceof Date) return v
	if(Array.isArray(v)) return v
	return undefined
}

export function Inputs({ employee, jobTitles = [] }: EmployeeInputProps) {
	const [status] = useFormField("employee.status")
	const [color, setColor] = useFormField("employee.color")
	const [activeAt, setActiveAt] = useFormField("employee.active_at")

	const statusOptions = [
		{ value: "applicant", label: "Applicant" },
		{ value: "employed", label: "Employee" },
	]

	const handleRandomizeColor = () => {
		setColor(generateRandomColor())
	}

	return (
		<Stack gap="xl">
			<Stack gap="md">
				<Grid gutter="lg">
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<Select
							name="employee.status"
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
						<TextInput name="employee.person.first_name" label="First Name" />
					</Grid.Col>

					<Grid.Col span={ { xs: 12, sm: 6, md: 4 } }>
						<TextInput name="employee.person.middle_name" label="Middle Name" />
					</Grid.Col>

					<Grid.Col span={ { xs: 12, sm: 6, md: 4 } }>
						<TextInput name="employee.person.last_name" label="Last Name" />
					</Grid.Col>
				</Grid>
			</Stack>

			<Stack gap="md">
				<Text size="sm" fw={ 500 } c="dimmed">Employment Details</Text>
				<Grid gutter="lg">
					{ status === "employed" && (
						<Grid.Col span={ { xs: 12, sm: 6 } }>
							<TextInput name="employee.number" label="Employee Number" />
						</Grid.Col>
					) }

					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<DateInput
							name="employee.active_at"
							label="Start Date"
							value={ toDateInputValue(activeAt) }
							onChange={ (v) => setActiveAt(v) }
						/>
					</Grid.Col>

					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<JobTitlesDropdown name="employee.job_title_id" />
					</Grid.Col>

					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<ColorPickerInput
							name="employee.color"
							label="Default Calendar Color"
							value={ typeof color === "string" ? color : undefined }
							onChange={ (c: string) => setColor(c) }
						>
							<Tooltip label="Random" position="right-end">
								<Button variant="transparent" mx={ 0 } px="xxs" onClick={ handleRandomizeColor }><RandomizeIcon /></Button>
							</Tooltip>
						</ColorPickerInput>
					</Grid.Col>
				</Grid>
			</Stack>

			<Group justify="flex-end">
				<Submit size="md">{ employee.id ? "Update" : "Create" } Employee</Submit>
			</Group>
		</Stack>
	)
}
