import { useTranslation } from "react-i18next"

import { Button, Group, Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Switch, TextInput } from "@/components/Inputs"
import { Routes, type HTTPVerb } from "@/lib"

export type ServiceTypeFormValues = {
	name: string
	color: string
	active: boolean
	assignable: boolean
	billable: boolean
	payable: boolean
	allows_multi_client: boolean
	requires_notes: boolean
	tracks_mileage: boolean
}

type ServiceTypeFormData = {
	service_type: ServiceTypeFormValues
}

interface ServiceTypeFormProps {
	serviceType?: Schema.ServiceType
	onCancel: () => void
}

function emptyServiceType(): ServiceTypeFormValues {
	return {
		name: "",
		color: "#2F6FED",
		active: true,
		assignable: true,
		billable: true,
		payable: true,
		allows_multi_client: false,
		requires_notes: false,
		tracks_mileage: false,
	}
}

export function toFormValues(serviceType: Schema.ServiceType): ServiceTypeFormValues {
	return {
		name: serviceType.name,
		color: serviceType.color,
		active: serviceType.active,
		assignable: serviceType.assignable,
		billable: serviceType.billable,
		payable: serviceType.payable,
		allows_multi_client: serviceType.allows_multi_client,
		requires_notes: serviceType.requires_notes,
		tracks_mileage: serviceType.tracks_mileage,
	}
}

export function ServiceTypeForm({ serviceType, onCancel }: ServiceTypeFormProps) {
	const { t } = useTranslation()
	const isEdit = serviceType !== undefined
	const slug = serviceType?.slug
	const action = isEdit && slug
		? Routes.settingsServiceType(slug)
		: Routes.settingsServiceTypes()
	const method: HTTPVerb = isEdit ? "patch" : "post"

	const values = isEdit ? toFormValues(serviceType) : emptyServiceType()
	const initialData: ServiceTypeFormData = {
		service_type: values,
	}

	return (
		<Form<ServiceTypeFormData>
			action={ action }
			method={ method }
			initialData={ initialData }
			railsAttributes={ false }
		>
			<Stack>
				<Group align="flex-end" grow>
					<TextInput
						name="service_type.name"
						label={ t("views.settings.calendar.service_types_name_label") }
						placeholder={ t("views.settings.calendar.service_types_name_placeholder") }
						defaultValue={ values.name }
						required
					/>
					<TextInput
						name="service_type.color"
						label={ t("views.settings.calendar.service_types_color_label") }
						placeholder="#2F6FED"
						defaultValue={ values.color }
						required
						style={ { maxWidth: "8rem" } }
					/>
				</Group>

				<Group gap="md" wrap="wrap">
					<Switch
						name="service_type.active"
						label={ t("views.settings.calendar.service_types_flag_active") }
						defaultChecked={ values.active }
					/>
					<Switch
						name="service_type.assignable"
						label={ t("views.settings.calendar.service_types_flag_assignable") }
						defaultChecked={ values.assignable }
					/>
					<Switch
						name="service_type.billable"
						label={ t("views.settings.calendar.service_types_flag_billable") }
						defaultChecked={ values.billable }
					/>
					<Switch
						name="service_type.payable"
						label={ t("views.settings.calendar.service_types_flag_payable") }
						defaultChecked={ values.payable }
					/>
					<Switch
						name="service_type.allows_multi_client"
						label={ t("views.settings.calendar.service_types_flag_multi_client") }
						defaultChecked={ values.allows_multi_client }
					/>
					<Switch
						name="service_type.requires_notes"
						label={ t("views.settings.calendar.service_types_flag_notes") }
						defaultChecked={ values.requires_notes }
					/>
					<Switch
						name="service_type.tracks_mileage"
						label={ t("views.settings.calendar.service_types_flag_mileage") }
						defaultChecked={ values.tracks_mileage }
					/>
				</Group>

				<Group>
					<Submit>
						{ isEdit
							? t("views.settings.calendar.service_types_save_update")
							: t("views.settings.calendar.service_types_save_create") }
					</Submit>
					<Button variant="subtle" onClick={ onCancel }>
						{ t("views.settings.calendar.service_types_cancel") }
					</Button>
				</Group>
			</Stack>
		</Form>
	)
}
