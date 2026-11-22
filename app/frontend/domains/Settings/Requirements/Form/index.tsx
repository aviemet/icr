import clsx from "clsx"
import { useTranslation } from "react-i18next"

import { Box, Grid, Group } from "@/components"
import { Form, Submit } from "@/components/Form"
import { CheckIcon, ClockIcon } from "@/components/Icons"
import { MultiSelect, Select, Textarea, TextInput } from "@/components/Inputs"
import { pageChrome } from "@/components/PageChrome"
import { FormBand, FormBandStack } from "@/features"
import { type HTTPVerb } from "@/lib"

import { ScopeFields } from "./ScopeFields"

type OptionRecord = {
	id: string
	name?: string | null
}

type RequirementFormInput = {
	id?: string
	name?: string
	description?: string
	requirement_type_id?: string
	scope_type?: string | null
	scope_id?: string | null
	enforcement?: string
	training_ids?: string[]
	credential_types?: string[]
}

type RequirementFormData = {
	requirement: {
		id?: string
		name?: string
		description?: string
		requirement_type_id?: string
		scope_type?: string | null
		scope_id?: string | null
		enforcement: string
		training_ids: string[]
		credential_types: string[]
	}
}

export interface RequirementFormProps {
	to: string
	method?: HTTPVerb
	requirement: RequirementFormInput
	requirementTypeOptions?: OptionRecord[]
	jobTitleOptions?: OptionRecord[]
	clientOptions?: OptionRecord[]
	trainingOptions?: OptionRecord[]
	credentialTypeOptions?: OptionRecord[]
}

export function RequirementForm({
	method = "post",
	to,
	requirement,
	requirementTypeOptions = [],
	jobTitleOptions = [],
	clientOptions = [],
	trainingOptions = [],
	credentialTypeOptions = [],
	...props
}: RequirementFormProps) {
	const { t } = useTranslation()

	const typeOptions = requirementTypeOptions.map(option => ({
		value: option.id,
		label: option.name ?? option.id,
	}))
	const titleOptions = jobTitleOptions.map(option => ({
		value: option.id,
		label: option.name ?? option.id,
	}))
	const clients = clientOptions.map(option => ({
		value: option.id,
		label: option.name ?? option.id,
	}))
	const trainings = trainingOptions.map(option => ({
		value: option.id,
		label: option.name ?? option.id,
	}))
	const credentials = credentialTypeOptions.map(option => ({
		value: option.id,
		label: option.name ?? option.id,
	}))

	return (
		<Form<RequirementFormData>
			action={ to }
			initialData={ {
				requirement: {
					...requirement,
					scope_type: requirement.scope_type ?? null,
					scope_id: requirement.scope_id ?? null,
					enforcement: requirement.enforcement ?? "advisory",
					training_ids: requirement.training_ids ?? [],
					credential_types: requirement.credential_types ?? [],
				},
			} }
			method={ method }
			{ ...props }
		>
			<FormBandStack>
				<FormBand
					title={ t("views.requirements.form.details_title") }
					description={ t("views.requirements.form.details_description") }
					icon={ <CheckIcon size={ 16 } /> }
				>
					<Grid>
						<Grid.Col span={ { xxs: 12, sm: 8 } }>
							<TextInput name="requirement.name" label={ t("views.requirements.form.name") } required />
						</Grid.Col>
						<Grid.Col span={ { xxs: 12, sm: 4 } }>
							<Select
								name="requirement.requirement_type_id"
								label={ t("views.requirements.form.type") }
								options={ typeOptions }
								searchable
								required
							/>
						</Grid.Col>
						<Grid.Col span={ { xxs: 12, sm: 6 } }>
							<Select
								name="requirement.enforcement"
								label={ t("views.requirements.form.enforcement") }
								options={ [
									{ value: "advisory", label: t("views.requirements.form.enforcement_advisory") },
									{ value: "employment", label: t("views.requirements.form.enforcement_employment") },
									{ value: "client_schedule", label: t("views.requirements.form.enforcement_client_schedule") },
								] }
								required
							/>
						</Grid.Col>
						<Grid.Col span={ 12 }>
							<Textarea name="requirement.description" label={ t("views.requirements.form.description") } />
						</Grid.Col>
						<ScopeFields jobTitleOptions={ titleOptions } clientOptions={ clients } />
					</Grid>
				</FormBand>

				<FormBand
					title={ t("views.requirements.form.fulfillables_title") }
					description={ t("views.requirements.form.fulfillables_description") }
					icon={ <ClockIcon size={ 16 } /> }
				>
					<Grid>
						<Grid.Col span={ { xxs: 12, sm: 6 } }>
							<MultiSelect
								name="requirement.training_ids"
								label={ t("views.requirements.form.trainings") }
								options={ trainings }
								searchable
								clearable
							/>
						</Grid.Col>
						<Grid.Col span={ { xxs: 12, sm: 6 } }>
							<MultiSelect
								name="requirement.credential_types"
								label={ t("views.requirements.form.credentials") }
								options={ credentials }
								searchable
								clearable
							/>
						</Grid.Col>
					</Grid>
				</FormBand>

				<Box className={ clsx(pageChrome.tintedSurface) }>
					<Group justify="flex-end">
						<Submit>
							{ requirement.id
								? t("views.requirements.form.update")
								: t("views.requirements.form.create") }
						</Submit>
					</Group>
				</Box>
			</FormBandStack>
		</Form>
	)
}
