import { useTranslation } from "react-i18next"

import { Button, Divider, Grid, Group, Stack, Title, Tooltip } from "@/components"
import { Form, Submit, useFormField } from "@/components/Form"
import { RandomizeIcon } from "@/components/Icons"
import { ColorPickerInput, DateInput, Textarea, TextInput } from "@/components/Inputs"
import { JobTitlesDropdown } from "@/components/Inputs/Dropdowns"
import { Routes, generateRandomColor } from "@/lib"

interface EmployeeProfileFormProps {
	employee: Schema.EmployeesShow
}

export function EmployeeProfileForm({ employee }: EmployeeProfileFormProps) {
	const { t } = useTranslation()

	return (
		<Form
			action={ Routes.employee(employee.slug) }
			method="put"
			initialData={ {
				tab: "profile",
				employee: {
					number: employee.number ?? "",
					color: employee.color ?? "",
					preferred_language: employee.preferred_language ?? "",
					communication_notes: employee.communication_notes ?? "",
					active_at: employee.active_at ?? "",
					inactive_at: employee.inactive_at ?? "",
					eligible_for_hire: employee.eligible_for_hire,
					job_title_id: employee.job_title?.id ?? "",
					person: {
						id: employee.person.id,
						first_name: employee.person.first_name,
						middle_name: employee.person.middle_name ?? "",
						last_name: employee.person.last_name,
						nick_name: employee.person.nick_name ?? "",
						dob: employee.person.dob ?? "",
					},
				},
			} }
		>
			<ProfileFields />
			<Group justify="flex-end" mt="xl">
				<Submit>{ t("views.employees.show.profile.save") }</Submit>
			</Group>
		</Form>
	)
}

function ProfileFields() {
	const { t } = useTranslation()
	const [color, setColor] = useFormField("employee.color")

	return (
		<Stack gap="xl">
			<Stack gap="md">
				<Title order={ 4 }>{ t("views.employees.show.profile.demographics") }</Title>
				<Grid>
					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput name="employee.person.first_name" label="First Name" />
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput name="employee.person.middle_name" label="Middle Name" />
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput name="employee.person.last_name" label="Last Name" />
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput name="employee.person.nick_name" label="Nickname" />
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<DateInput name="employee.person.dob" label="Date of Birth" />
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 4 } }>
						<TextInput name="employee.number" label="Employee #" />
					</Grid.Col>
				</Grid>
			</Stack>

			<Divider />

			<Stack gap="md">
				<Title order={ 4 }>{ t("views.employees.show.profile.employment") }</Title>
				<Grid>
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
								<Button variant="transparent" mx={ 0 } px="xxs" onClick={ () => setColor(generateRandomColor()) }>
									<RandomizeIcon />
								</Button>
							</Tooltip>
						</ColorPickerInput>
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<DateInput name="employee.active_at" label="Hire Date" />
					</Grid.Col>
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<DateInput name="employee.inactive_at" label="End Date" />
					</Grid.Col>
				</Grid>
			</Stack>

			<Divider />

			<Stack gap="md">
				<Title order={ 4 }>{ t("views.employees.show.profile.communication") }</Title>
				<Grid>
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<TextInput name="employee.preferred_language" label="Preferred Language" />
					</Grid.Col>
					<Grid.Col span={ 12 }>
						<Textarea name="employee.communication_notes" label="Communication Notes" minRows={ 2 } />
					</Grid.Col>
				</Grid>
			</Stack>
		</Stack>
	)
}
