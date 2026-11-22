import clsx from "clsx"
import { useTranslation } from "react-i18next"

import { Box, Grid, Group } from "@/components"
import { Form, Submit } from "@/components/Form"
import { ClientIcon, ClockIcon } from "@/components/Icons"
import { MultiSelect, NumberInput, RichText, TextInput } from "@/components/Inputs"
import { pageChrome } from "@/components/PageChrome"
import { type TrainingClientOption } from "@/domains/Trainings/Index/ClientFilter"
import { FormBand, FormBandStack } from "@/features"
import { type HTTPVerb } from "@/lib"

type TrainingStatus = "active" | "inactive"

type TrainingFormValues = {
	id?: string
	name?: string
	description?: string
	estimated_minutes?: number
	status?: TrainingStatus
	client_ids: string[]
}

type TrainingFormInput = {
	id?: string
	name?: string
	description?: string
	estimated_minutes?: number
	status?: TrainingStatus
	client_ids?: string[]
}

type TrainingFormData = {
	training: TrainingFormValues
}

export interface TrainingFormProps {
	to: string
	method?: HTTPVerb
	training: TrainingFormInput
	clientOptions?: TrainingClientOption[]
}

export function TrainingForm({
	method = "post",
	to,
	training,
	clientOptions = [],
	...props
}: TrainingFormProps) {
	const { t } = useTranslation()
	const options = clientOptions.map(client => ({
		value: client.id,
		label: client.name,
	}))

	return (
		<Form<TrainingFormData>
			action={ to }
			initialData={ {
				training: {
					...training,
					client_ids: training.client_ids ?? [],
				},
			} }
			method={ method }
			{ ...props }
		>
			<FormBandStack>
				<FormBand
					title="Details"
					description="Name, description, and expected duration."
					icon={ <ClockIcon size={ 16 } /> }
				>
					<Grid>
						<Grid.Col span={ { xxs: 12, sm: 8 } }>
							<TextInput name="training.name" label={ t("views.trainings.form.name") } required />
						</Grid.Col>
						<Grid.Col span={ { xxs: 12, sm: 4 } }>
							<NumberInput
								name="training.estimated_minutes"
								label={ t("views.trainings.form.estimated_minutes") }
								min={ 0 }
								decimalScale={ 0 }
							/>
						</Grid.Col>
						<Grid.Col span={ 12 }>
							<RichText name="training.description" label={ t("views.trainings.form.description") } />
						</Grid.Col>
					</Grid>
				</FormBand>

				<FormBand
					title="Clients"
					description="Link this training to one or more clients when it is client-specific."
					icon={ <ClientIcon size={ 16 } /> }
				>
					<Grid>
						<Grid.Col span={ { xxs: 12, sm: 8 } }>
							<MultiSelect
								name="training.client_ids"
								label={ t("views.trainings.form.client_ids") }
								options={ options }
								searchable
								clearable
							/>
						</Grid.Col>
					</Grid>
				</FormBand>

				<Box className={ clsx(pageChrome.tintedSurface) }>
					<Group justify="flex-end">
						<Submit>
							{ training?.id
								? t("views.trainings.form.update")
								: t("views.trainings.form.create") }
						</Submit>
					</Group>
				</Box>
			</FormBandStack>
		</Form>
	)
}
