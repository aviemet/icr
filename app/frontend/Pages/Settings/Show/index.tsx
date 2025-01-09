import { Group, Heading, Menu, Page, Section } from '@/Components'
import { Routes } from '@/lib'

interface ShowSettingProps {
	setting: Schema.SettingsShow
}

const ShowSetting = ({ setting }: ShowSettingProps) => {
	const title =  'Setting'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Setting', href: Routes.settings() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editSetting(setting.id) }>
								Edit Setting
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowSetting
