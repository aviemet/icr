import clsx from "clsx"

import { Page, Section, Tabs, Title } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"
import { pageChrome } from "@/components/PageChrome"

import * as classes from "./RecordShowShell.css"

export interface RecordShowTab {
	id: string
	label: string
	panel: React.ReactNode
}

export interface RecordShowShellProps {
	title: string
	breadcrumbs: Breadcrumb[]
	meta?: React.ReactNode
	badge?: React.ReactNode
	avatar?: React.ReactNode
	actions?: React.ReactNode
	tabs: RecordShowTab[]
	defaultTab?: string
}

export function RecordShowShell({
	title,
	breadcrumbs,
	meta,
	badge,
	avatar,
	actions,
	tabs,
	defaultTab,
}: RecordShowShellProps) {
	const initialTab = defaultTab ?? tabs[0]?.id

	return (
		<Page title={ title } breadcrumbs={ breadcrumbs }>
			<Section fullHeight p={ 0 } className={ classes.viewport }>
				<div className={ classes.shell }>
					<Tabs
						urlControlled={ true }
						defaultValue={ initialTab }
						className={ clsx(classes.tabs) }
					>
						<div className={ clsx(pageChrome.panelSurface, classes.chrome) }>
							<header className={ classes.header }>
								<div className={ classes.identityRow }>
									{ avatar }
									<div className={ classes.identity }>
										<div className={ classes.titleRow }>
											<Title order={ 2 }>{ title }</Title>
											{ badge }
										</div>
										{ meta && <div className={ classes.meta }>{ meta }</div> }
									</div>
								</div>
								{ actions && <div className={ classes.actions }>{ actions }</div> }
							</header>

							<Tabs.List>
								{ tabs.map(tab => (
									<Tabs.Tab key={ tab.id } value={ tab.id }>{ tab.label }</Tabs.Tab>
								)) }
							</Tabs.List>
						</div>

						{ tabs.map(tab => (
							<Tabs.Panel key={ tab.id } value={ tab.id }>
								{ tab.panel }
							</Tabs.Panel>
						)) }
					</Tabs>
				</div>
			</Section>
		</Page>
	)
}
