import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import SettingsForm from '../Form'

interface EditSettingProps {
	setting: Schema.SettingsEdit
}

const EditSetting = ({ setting }: EditSettingProps) => {
	const title = 'Edit Setting'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Settings', href: Routes.settings() },
			{ title: Setting, href: Routes.setting(setting.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>
				
				<SettingsForm
					method='put'
					to={ Routes.setting() }
					setting={ setting }
				/>
			</Section>
		</Page>
	)
}

export default EditSetting
