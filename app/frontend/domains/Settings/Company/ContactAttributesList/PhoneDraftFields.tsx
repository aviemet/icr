import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"

import { type DraftFieldsProps } from "./draftFieldsTypes"

export function PhoneDraftFields({ draft, setDraft }: DraftFieldsProps) {
	const { t } = useTranslation()

	return (
		<Grid>
			<Grid.Col span={ { xs: 12, sm: 7 } }>
				<TextInput
					label={ t("views.settings.company.fields.number") }
					required
					value={ draft.number ?? "" }
					onChange={ event => setDraft({ ...draft, number: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 5 } }>
				<TextInput
					label={ t("views.settings.company.fields.extension") }
					value={ draft.extension ?? "" }
					onChange={ event => setDraft({ ...draft, extension: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ 12 }>
				<TextInput
					label={ t("views.settings.company.fields.label") }
					value={ draft.name ?? "" }
					onChange={ event => setDraft({ ...draft, name: event.currentTarget.value }) }
				/>
			</Grid.Col>
		</Grid>
	)
}
