import { useTranslation } from "react-i18next"

import { Box, Button, Grid, Group, Tooltip } from "@/components"
import { Form, Submit, useFormField } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { RandomizeIcon } from "@/components/Icons"
import { ColorPickerInput, DateInput, Textarea, TextInput } from "@/components/Inputs"
import { JobTitlesDropdown } from "@/components/Inputs/Dropdowns"
import {
	DefinitionItem,
	DefinitionList,
	FormBand,
	FormBandStack,
	ShowEditToggle,
} from "@/features"
import { Routes, generateRandomColor } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface EmployeeProfileFormProps {
	employee: Schema.EmployeesShow
}

export function EmployeeProfileForm({ employee }: EmployeeProfileFormProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()

	return (
		<ShowEditToggle canUpdate={ canUpdate }>
			{ ({ editing, controls }) => editing
				? (
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
						<ProfileFields actions={ controls } />
						<Group justify="flex-end" mt="md">
							<Submit>{ t("views.employees.show.profile.save") }</Submit>
						</Group>
					</Form>
				)
				: (
					<FormBandStack>
						<FormBand title={ t("views.employees.show.profile.demographics") } actions={ controls }>
							<DefinitionList>
								<DefinitionItem label="First Name" value={ employee.person.first_name } />
								<DefinitionItem label="Middle Name" value={ employee.person.middle_name } />
								<DefinitionItem label="Last Name" value={ employee.person.last_name } />
								<DefinitionItem label="Nickname" value={ employee.person.nick_name } />
								<DefinitionItem
									label="Date of Birth"
									value={ employee.person.dob
										? <DateTimeFormatter>{ employee.person.dob }</DateTimeFormatter>
										: null }
								/>
								<DefinitionItem label="Employee #" value={ employee.number } />
							</DefinitionList>
						</FormBand>

						<FormBand title={ t("views.employees.show.profile.employment") }>
							<DefinitionList>
								<DefinitionItem
									label="Job Title"
									value={ employee.job_title ? String(employee.job_title.name) : null }
								/>
								<DefinitionItem
									label="Default Calendar Color"
									value={ employee.color
										? (
											<Group gap="xs">
												<Box
													w={ 16 }
													h={ 16 }
													style={ {
														borderRadius: 4,
														backgroundColor: employee.color,
													} }
												/>
												<span>{ employee.color }</span>
											</Group>
										)
										: null }
								/>
								<DefinitionItem
									label="Hire Date"
									value={ employee.active_at
										? <DateTimeFormatter>{ employee.active_at }</DateTimeFormatter>
										: null }
								/>
								<DefinitionItem
									label="End Date"
									value={ employee.inactive_at
										? <DateTimeFormatter>{ employee.inactive_at }</DateTimeFormatter>
										: null }
								/>
							</DefinitionList>
						</FormBand>

						<FormBand title={ t("views.employees.show.profile.communication") }>
							<DefinitionList>
								<DefinitionItem label="Preferred Language" value={ employee.preferred_language } />
								<DefinitionItem label="Communication Notes" value={ employee.communication_notes } fullWidth />
							</DefinitionList>
						</FormBand>
					</FormBandStack>
				) }
		</ShowEditToggle>
	)
}

interface ProfileFieldsProps {
	actions?: React.ReactNode
}

function ProfileFields({ actions }: ProfileFieldsProps) {
	const { t } = useTranslation()
	const [color, setColor] = useFormField("employee.color")

	return (
		<FormBandStack>
			<FormBand title={ t("views.employees.show.profile.demographics") } actions={ actions }>
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
			</FormBand>

			<FormBand title={ t("views.employees.show.profile.employment") }>
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
			</FormBand>

			<FormBand title={ t("views.employees.show.profile.communication") }>
				<Grid>
					<Grid.Col span={ { xxs: 12, sm: 6 } }>
						<TextInput name="employee.preferred_language" label="Preferred Language" />
					</Grid.Col>
					<Grid.Col span={ 12 }>
						<Textarea name="employee.communication_notes" label="Communication Notes" minRows={ 2 } />
					</Grid.Col>
				</Grid>
			</FormBand>
		</FormBandStack>
	)
}
