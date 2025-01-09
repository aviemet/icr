import { Routes } from '@/lib'
import { Box, Grid, Page } from '@/Components'
import { Form, Submit, TextInput } from '@/Components/Form'
import {
	FormCurrenciesDropdown,
	FormLanguagesDropdown,
	FormPayPeriodsDropdown,
	FormTimezonesDropdown,
} from '@/Features/Dropdowns'

interface SettingIndexProps {
	settings: Schema.Setting
}

const SettingsIndex = ({ settings }: SettingIndexProps) => {
	return (
		<Page title="Settings" >
			<Box>
				<Form
					to={ Routes.settings() }
					model="setting"
					method="patch"
					data={ { setting: settings } }
				>
					<Grid>
						<Grid.Col>
							<TextInput
								label="Company Name"
								name="company_name"
							/>
						</Grid.Col>
						<Grid.Col>
							<FormLanguagesDropdown
								label="Default Language"
								name="default_language"
							/>
						</Grid.Col>
						<Grid.Col>
							<FormCurrenciesDropdown
								label="Default Currency"
								name="default_currency"
							/>
						</Grid.Col>
						<Grid.Col>
							<FormTimezonesDropdown
								label="Default Timezone"
								name="default_timezone"
							/>
						</Grid.Col>
						<Grid.Col>
							<FormPayPeriodsDropdown
								label="Pay Period Type"
								name="pay_period_type"
							/>
						</Grid.Col>

						<Grid.Col>
							<Submit>Update Settings</Submit>
						</Grid.Col>
					</Grid>
				</Form>
			</Box>
		</Page>
	)
}

export default SettingsIndex
