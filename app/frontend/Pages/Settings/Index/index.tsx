import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import SettingsTable from '../Table'

interface SettingIndexProps {
	settings: Schema.SettingsIndex[]
	pagination: Schema.Pagination
}

const SettingsIndex = ({ settings, pagination }: SettingIndexProps) => {
	return (
		<IndexPageTemplate
			title="Settings"
			model="settings"
			rows={ settings }
			pagination={ pagination }
			deleteRoute={ Routes.settings() }
			menuOptions={ [
				{ label: 'New Setting', href: Routes.newSetting(), icon: <NewIcon /> },
			] }
		>
			<SettingsTable />
		</IndexPageTemplate>
	)
}

export default SettingsIndex
