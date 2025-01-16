import { Page, Section, Tabs  } from "@/Components"

import General from "./General"
import Users from "./Users"

const tabsList = [
	{ id: "general", label: "General", component: General },
	{ id: "users", label: "Users", component: Users },
]

interface SettingIndexProps {
	settings: Schema.Setting
}

const SettingsIndex = ({ settings }: SettingIndexProps) => {
	return (
		<Page title="Settings" >
			<Section fullHeight>
				<Tabs urlControlled={ true } defaultValue={ tabsList[0].id }>
					<Tabs.List>
						{ tabsList.map(tab => (
							<Tabs.Tab key={ tab.id } value={ tab.id }>{ tab.label }</Tabs.Tab>
						)) }
					</Tabs.List>

					{ tabsList.map(tab => {
						const Component = tab.component

						return (
							<Tabs.Panel key={ tab.id } value={ tab.id } p="md">
								<Component settings={ settings } />
							</Tabs.Panel>
						)
					}) }
				</Tabs>

			</Section>

		</Page>
	)
}

export default SettingsIndex
