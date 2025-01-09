import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TSettingFormData = {
	setting: Schema.SettingsFormData
}

export interface SettingFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TSettingFormData>) => boolean|void
	setting: Schema.SettingsFormData
}

const SettingForm = ({ method = 'post', setting, ...props }: ISettingFormProps) => {
	return (
		<Form
			model="setting"
			data={ { setting } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="singelton_guard" label="Singelton_guard" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="data" label="Data" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ setting.id ? 'Update' : 'Create' } Setting</Submit>
				</Grid.Col>
			</Grid.Col>
		</Form>
	)
}

export default SettingForm
