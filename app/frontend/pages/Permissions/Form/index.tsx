import { useForm } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Button, Card, Grid, Title } from "@/components"
import { Form as FormComponent } from "@/components/Form"
import { TextInput, NumberInput, RichText } from "@/components/Form/Inputs"

import Assignments from "./Assignments"
import { PermissionRules } from "./PermissionRules"

interface PermissionGroup {
	id?: string
	name: string
	description: string
	precedence: number
	permissions: Array<{
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
	}>
	assignments_attributes: Array<{
		id?: string
		permissionable_type: string
		permissionable_id: string
		starts_at: string
		ends_at?: string
		conditions?: Record<string, unknown>
		_destroy?: boolean
	}>
}

interface Props {
	group: PermissionGroup
	assignable_types: string[]
}

const PermissionForm = ({ group, assignable_types }: Props) => {
	const { t } = useTranslation()
	const form = useForm<PermissionGroup>({
		...group,
		assignments_attributes: group.assignments_attributes || [],
	})

	const handleSubmit = () => {
		if(form.data.id) {
			form.put(`/permissions/${form.data.id}`)
		} else {
			form.post("/permissions")
		}
	}

	return (
		<Grid>
			<Grid.Col>
				<Card>
					<Card.Section inheritPadding py="xs">
						<Title>
							{ form.data.id
								? t("permissions.edit.title")
								: t("permissions.new.title") }
						</Title>
					</Card.Section>

					<Card.Section inheritPadding py="md">
						<FormComponent
							data={ form.data }
							onSubmit={ handleSubmit }
						>
							<Grid>
								<Grid.Col span={ 12 }>
									<Title order={ 3 }>{ t("permissions.form.basic_info") }</Title>
								</Grid.Col>

								<Grid.Col span={ 6 }>
									<TextInput
										name="name"
										label={ t("activerecord.attributes.permission/group.name") }
										defaultValue={ form.data.name }
										onChange={ (value) => form.setData("name", value) }
										error={ form.errors.name }
									/>
								</Grid.Col>

								<Grid.Col span={ 6 }>
									<NumberInput
										name="precedence"
										label={ t("activerecord.attributes.permission/group.precedence") }
										defaultValue={ form.data.precedence }
										onChange={ (value) => form.setData("precedence", value) }
										error={ form.errors.precedence }
									/>
								</Grid.Col>

								<Grid.Col span={ 12 }>
									<RichText
										name="description"
										label={ t("activerecord.attributes.permission/group.description") }
										defaultValue={ form.data.description }
										onChange={ (value) => form.setData("description", value) }
										error={ form.errors.description }
									/>
								</Grid.Col>

								<Grid.Col span={ 12 }>
									<Title order={ 3 }>{ t("permissions.form.permissions") }</Title>
									<PermissionRules
										value={ form.data.permissions }
										onChange={ value => form.setData("permissions", value) }
										error={ form.errors.permissions }
									/>
								</Grid.Col>

								<Grid.Col span={ 12 }>
									<Title order={ 3 }>{ t("permissions.form.assignments") }</Title>
									<Assignments
										model="assignments_attributes"
										form={ form.data }
									/>
								</Grid.Col>

								<Grid.Col span={ 12 }>
									<Button type="submit" loading={ form.processing }>
										{ form.data.id ? "Update" : "Create" }
									</Button>
								</Grid.Col>
							</Grid>
						</FormComponent>
					</Card.Section>
				</Card>
			</Grid.Col>
		</Grid>
	)
}

export default PermissionForm
