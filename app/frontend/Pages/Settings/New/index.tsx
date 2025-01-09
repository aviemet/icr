import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import SettingForm from '../Form'

interface NewSettingProps {
	setting: Schema.SettingsFormData
}

const NewSetting = ({ ...data }: NewSettingProps) => {
	const title = 'New Setting'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Settings', href: Routes.settings() },
			{ title: 'New Setting', href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<SettingForm
					to={ Routes.settings() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewSetting
