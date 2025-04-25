import { useTranslation } from "react-i18next"

import { Button, Grid } from "@/components"
import { DateTimeInput, Select, Switch } from "@/components/Form"

interface Permission {
	resource: string
	action: string
	effect: "allow" | "deny"
	conditions?: {
		owner_only?: boolean
		time_restricted?: {
			start_time: string
			end_time: string
		}
	}
}

interface Props {
	value: Permission[]
	onChange: (value: Permission[]) => void
	error?: string
}

const RESOURCES = [
	{ value: "clients", label: "Clients" },
	{ value: "employees", label: "Employees" },
	{ value: "doctors", label: "Doctors" },
	{ value: "vendors", label: "Vendors" },
	{ value: "payroll", label: "Payroll" },
]

const ACTIONS = [
	{ value: "index", label: "List" },
	{ value: "show", label: "View" },
	{ value: "create", label: "Create" },
	{ value: "update", label: "Edit" },
	{ value: "destroy", label: "Delete" },
]

const EFFECTS = [
	{ value: "allow", label: "Allow" },
	{ value: "deny", label: "Deny" },
]

export const PermissionRules = ({ value, onChange, error }: Props) => {
	const { t } = useTranslation()

	const handleAdd = () => {
		onChange([
			...value,
			{
				resource: "",
				action: "",
				effect: "allow",
			},
		])
	}

	const handleRemove = (index: number) => {
		onChange(value.filter((_, i) => i !== index))
	}

	const handleChange = (index: number, field: keyof Permission, fieldValue: any) => {
		onChange(
			value.map((permission, i) =>
				i === index
					? { ...permission, [field]: fieldValue }
					: permission
			)
		)
	}

	const handleConditionChange = (index: number, condition: string, conditionValue: any) => {
		onChange(
			value.map((permission, i) =>
				i === index
					? {
						...permission,
						conditions: {
							...permission.conditions,
							[condition]: conditionValue,
						},
					}
					: permission
			)
		)
	}

	return (
		<Grid>
			{ value.map((permission, index) => (
				<Grid.Col key={ index } span={ 12 }>
					<Grid>
						<Grid.Col span={ 3 }>
							<Select
								label="Resource"
								value={ permission.resource }
								onChange={ value => handleChange(index, "resource", value) }
								data={ RESOURCES }
							/>
						</Grid.Col>

						<Grid.Col span={ 3 }>
							<Select
								label="Action"
								value={ permission.action }
								onChange={ value => handleChange(index, "action", value) }
								data={ ACTIONS }
							/>
						</Grid.Col>

						<Grid.Col span={ 3 }>
							<Select
								label="Effect"
								value={ permission.effect }
								onChange={ value => handleChange(index, "effect", value as "allow" | "deny") }
								data={ EFFECTS }
							/>
						</Grid.Col>

						<Grid.Col span={ 3 }>
							<Button
								variant="danger"
								onClick={ () => handleRemove(index) }
							>
								Remove
							</Button>
						</Grid.Col>

						<Grid.Col span={ 12 }>
							<Grid>
								<Grid.Col span={ 4 }>
									<Switch
										label={ t("permissions.form.conditions.owner_only") }
										checked={ permission.conditions?.owner_only || false }
										onChange={ e => handleConditionChange(index, "owner_only", e.target.checked) }
									/>
								</Grid.Col>

								{ permission.conditions?.time_restricted && (
									<>
										<Grid.Col span={ 4 }>
											<DateTimeInput
												label="Start Time"
												value={ permission.conditions.time_restricted.start_time }
												onChange={ value =>
													handleConditionChange(index, "time_restricted", {
														...permission.conditions?.time_restricted,
														start_time: value,
													})
												}
											/>
										</Grid.Col>

										<Grid.Col span={ 4 }>
											<DateTimeInput
												label="End Time"
												value={ permission.conditions.time_restricted.end_time }
												onChange={ value =>
													handleConditionChange(index, "time_restricted", {
														...permission.conditions?.time_restricted,
														end_time: value,
													})
												}
											/>
										</Grid.Col>
									</>
								) }

								<Grid.Col span={ 4 }>
									<Switch
										label={ t("permissions.form.conditions.time_restricted") }
										checked={ !!permission.conditions?.time_restricted }
										onChange={ e => {
											if(e.target.checked) {
												handleConditionChange(index, "time_restricted", {
													start_time: "",
													end_time: "",
												})
											} else {
												handleConditionChange(index, "time_restricted", undefined)
											}
										} }
									/>
								</Grid.Col>
							</Grid>
						</Grid.Col>
					</Grid>
				</Grid.Col>
			)) }

			<Grid.Col span={ 12 }>
				<Button onClick={ handleAdd }>
					{ t("permissions.form.add_permission") }
				</Button>
			</Grid.Col>

			{ error && (
				<Grid.Col span={ 12 }>
					<div className="text-red-500">{ error }</div>
				</Grid.Col>
			) }
		</Grid>
	)
}
