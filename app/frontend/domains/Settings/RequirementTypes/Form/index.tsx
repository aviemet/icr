import clsx from "clsx"
import { useTranslation } from "react-i18next"

import { Box, Grid, Group } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Textarea, TextInput } from "@/components/Inputs"
import { pageChrome } from "@/components/PageChrome"
import { FormBand, FormBandStack } from "@/features"
import { type HTTPVerb } from "@/lib"

type RequirementTypeFormInput = {
	id?: string
	name?: string
	description?: string
}

type RequirementTypeFormData = {
	requirement_type: RequirementTypeFormInput
}

export interface RequirementTypeFormProps {
	to: string
	method?: HTTPVerb
	requirementType: RequirementTypeFormInput
}

export function RequirementTypeForm({
	method = "post",
	to,
	requirementType,
	...props
}: RequirementTypeFormProps) {
	const { t } = useTranslation()

	return (
		<Form<RequirementTypeFormData>
			action={ to }
			initialData={ { requirement_type: requirementType } }
			method={ method }
			{ ...props }
		>
			<FormBandStack>
				<FormBand title={ t("views.requirement_types.show.title") }>
					<Grid>
						<Grid.Col span={ 12 }>
							<TextInput
								name="requirement_type.name"
								label={ t("views.requirement_types.form.name") }
								required
							/>
						</Grid.Col>
						<Grid.Col span={ 12 }>
							<Textarea
								name="requirement_type.description"
								label={ t("views.requirement_types.form.description") }
							/>
						</Grid.Col>
					</Grid>
				</FormBand>

				<Box className={ clsx(pageChrome.tintedSurface) }>
					<Group justify="flex-end">
						<Submit>
							{ requirementType.id
								? t("views.requirement_types.form.update")
								: t("views.requirement_types.form.create") }
						</Submit>
					</Group>
				</Box>
			</FormBandStack>
		</Form>
	)
}
