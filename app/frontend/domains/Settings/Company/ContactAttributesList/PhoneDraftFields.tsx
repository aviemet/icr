import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"

export function PhoneDraftFields(
	draft: Record<string, string>,
	setDraft: (next: Record<string, string>) => void,
) {
	return (
		<Grid>
			<Grid.Col span={ { xs: 12, sm: 7 } }>
				<TextInput
					label="Number"
					required
					value={ draft.number ?? "" }
					onChange={ event => setDraft({ ...draft, number: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 5 } }>
				<TextInput
					label="Extension"
					value={ draft.extension ?? "" }
					onChange={ event => setDraft({ ...draft, extension: event.currentTarget.value }) }
				/>
			</Grid.Col>

			<Grid.Col span={ 12 }>
				<TextInput
					label="Label"
					value={ draft.name ?? "" }
					onChange={ event => setDraft({ ...draft, name: event.currentTarget.value }) }
				/>
			</Grid.Col>
		</Grid>
	)
}
