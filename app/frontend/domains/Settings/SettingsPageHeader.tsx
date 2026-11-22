import { Section, Title } from "@/components"

import * as classes from "./SettingsPageHeader.css"

interface SettingsPageHeaderProps {
	title: string
	description: string
	actions?: React.ReactNode
}

export function SettingsPageHeader({ title, description, actions }: SettingsPageHeaderProps) {
	return (
		<Section variant="panel" className={ classes.chrome }>
			<div className={ classes.identity }>
				<Title order={ 2 }>{ title }</Title>
				<span className={ classes.description }>{ description }</span>
			</div>
			{ actions && <div className={ classes.actions }>{ actions }</div> }
		</Section>
	)
}
