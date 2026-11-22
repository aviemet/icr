import React from "react"

import { Button, Grid, Group, Tooltip } from "@/components"
import { useFormField, Submit } from "@/components/Form"
import { RandomizeIcon } from "@/components/Icons"
import { ColorPickerInput, CurrencyInput, DateInput, FileInput, RadioGroup, RichText, Select, TextInput } from "@/components/Inputs"
import { type DateInputValue } from "@/components/Inputs"
import { JobTitlesDropdown } from "@/components/Inputs/Dropdowns"
import { FormBand, FormBandStack } from "@/features"
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

	const compensationFrequencyOptions = [
		{ value: "hourly", label: "Hourly" },
		{ value: "salary", label: "Salary" },
	]

	const handleRandomizeColor = () => {
		setColor(generateRandomColor())
	}

	return (
		<FormBandStack>
			<FormBand title="Status">
				<Grid gap="lg">
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<Select
							name="employee.status"
							label="Employment Status"
							options={ statusOptions }
						/>
					</Grid.Col>
				</Grid>
			</FormBand>

			<FormBand title="Personal Information">
				<Grid gap="lg">
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
			</FormBand>

			<FormBand title="Employment Details">
				<Grid gap="lg">
					{ status === "employed" && (
						<>
							<Grid.Col span={ { xs: 12, sm: 6 } }>
								<TextInput name="employee.number" label="Employee Number" />
							</Grid.Col>
							<Grid.Col span={ { xxs: 12, sm: 6 } }>
								<DateInput
									name="employee.active_at"
									label="Start Date"
									value={ toDateInputValue(activeAt) }
									onChange={ (value) => setActiveAt(value) }
								/>
							</Grid.Col>
						</>
					) }
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<JobTitlesDropdown name="employee.job_title_id" />
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<ColorPickerInput
							name="employee.color"
							label="Default Calendar Color"
							value={ typeof color === "string" ? color : undefined }
							onChange={ (value: string) => setColor(value) }
						>
							<Tooltip label="Random" position="right-end">
								<Button variant="transparent" mx={ 0 } px="xxs" onClick={ handleRandomizeColor }>
									<RandomizeIcon />
								</Button>
							</Tooltip>
						</ColorPickerInput>
					</Grid.Col>
					{ status === "applicant" && (
						<>
							<Grid.Col span={ { xxs: 12, sm: 6 } }>
								<CurrencyInput name="employee.desired_compensation" label="Desired Compensation" decimalScale={ 2 } />
							</Grid.Col>
							<Grid.Col span={ { xxs: 12, sm: 6 } }>
								<RadioGroup
									name="employee.desired_compensation_period"
									label="Frequency"
									options={ compensationFrequencyOptions }
								/>
							</Grid.Col>
						</>
					) }
				</Grid>
			</FormBand>

			{ status === "applicant" && (
				<FormBand title="Application">
					<Grid gap="lg">
						<Grid.Col span={ 12 }>
							<Grid>
								<Grid.Col span={ { xxs: 12, sm: 6 } }>
									<TextInput name="employee.application_source" label="Application Source" />
								</Grid.Col>
							</Grid>
						</Grid.Col>
						<Grid.Col span={ 12 }>
							<Grid>
								<Grid.Col span={ { xxs: 12, sm: 6 } }>
									<FileInput name="employee.resume" label="Resume" accept=".pdf,.doc,.docx" />
								</Grid.Col>
							</Grid>
						</Grid.Col>
						<Grid.Col span={ 12 }>
							<Grid>
								<Grid.Col span={ { xxs: 12, sm: 6 } }>
									<FileInput name="employee.cover_letter" label="Cover Letter" accept=".pdf,.doc,.docx" />
								</Grid.Col>
							</Grid>
						</Grid.Col>
						<Grid.Col span={ { xxs: 12 } }>
							<RichText name="employee.hiring_notes" label="Hiring Notes" />
						</Grid.Col>
					</Grid>
				</FormBand>
			) }

			<Group justify="flex-end">
				<Submit size="md">{ employee.id ? "Update" : "Create" } Employee</Submit>
			</Group>
		</FormBandStack>
	)
}
