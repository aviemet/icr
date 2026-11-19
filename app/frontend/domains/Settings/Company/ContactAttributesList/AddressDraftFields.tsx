import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"

export function AddressDraftFields(
	draft: Record<string, string>,
	setDraft: (next: Record<string, string>) => void,
) {
	return (
		<Grid>
			<Grid.Col span={ 12 }>
				<TextInput
					label="Address"
					required
					value={ draft.address ?? "" }
					onChange={ event => setDraft({ ...draft, address: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ 12 }>
				<TextInput
					label="Address line 2"
					value={ draft.address_2 ?? "" }
					onChange={ event => setDraft({ ...draft, address_2: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label="City"
					value={ draft.city ?? "" }
					onChange={ event => setDraft({ ...draft, city: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label="State / Region"
					value={ draft.region ?? "" }
					onChange={ event => setDraft({ ...draft, region: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label="Postal code"
					value={ draft.postal ?? "" }
					onChange={ event => setDraft({ ...draft, postal: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput
					label="Label"
					value={ draft.name ?? "" }
					onChange={ event => setDraft({ ...draft, name: event.currentTarget.value }) }
				/>
			</Grid.Col>
		</Grid>
	)
}
