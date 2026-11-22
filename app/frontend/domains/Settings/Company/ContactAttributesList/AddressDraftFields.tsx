import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"

import { type DraftFieldsProps } from "./draftFieldsTypes"

export function AddressDraftFields({ draft, setDraft }: DraftFieldsProps) {
	const { t } = useTranslation()

	return (
		<Grid>
			<Grid.Col span={ 12 }>
				<TextInput
					label={ t("views.settings.company.fields.address") }
					required
					value={ draft.address ?? "" }
					onChange={ event => setDraft({ ...draft, address: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ 12 }>
				<TextInput
					label={ t("views.settings.company.fields.address_2") }
					value={ draft.address_2 ?? "" }
					onChange={ event => setDraft({ ...draft, address_2: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label={ t("views.settings.company.fields.city") }
					value={ draft.city ?? "" }
					onChange={ event => setDraft({ ...draft, city: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label={ t("views.settings.company.fields.region") }
					value={ draft.region ?? "" }
					onChange={ event => setDraft({ ...draft, region: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label={ t("views.settings.company.fields.postal") }
					value={ draft.postal ?? "" }
					onChange={ event => setDraft({ ...draft, postal: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput
					label={ t("views.settings.company.fields.label") }
					value={ draft.name ?? "" }
					onChange={ event => setDraft({ ...draft, name: event.currentTarget.value }) }
				/>
			</Grid.Col>
		</Grid>
	)
}
