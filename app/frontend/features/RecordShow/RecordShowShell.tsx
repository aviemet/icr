import { router } from "@inertiajs/react"
import clsx from "clsx"
import { useState } from "react"

import { Page, Section, Tabs, Title } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"
import { pageChrome } from "@/components/PageChrome"

import * as classes from "./RecordShowShell.css"
import { RecordShowSubNav } from "./RecordShowSubNav"

export interface RecordShowSection {
	id: string
	label: string
	panel: React.ReactNode
}

export interface RecordShowTab {
	id: string
	label: string
	panel?: React.ReactNode
	sections?: RecordShowSection[]
	defaultSection?: string
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

function queryParam(key: string) {
	return new URL(window.location.href).searchParams.get(key)
}

function resolveSectionId(
	sections: RecordShowSection[] | undefined,
	defaultSection: string | undefined,
	requested: string | null,
) {
	if(!sections?.length) return undefined
	const fallback = defaultSection ?? sections[0].id
	if(requested && sections.some(section => section.id === requested)) return requested
	return fallback
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
	const [activeTabId, setActiveTabId] = useState(() => queryParam("tab") || initialTab)
	const activeTab = tabs.find(tab => tab.id === activeTabId) ?? tabs[0]
	const [activeSectionId, setActiveSectionId] = useState(() => resolveSectionId(
		activeTab?.sections,
		activeTab?.defaultSection,
		queryParam("section"),
	))

	const sectionDefs = activeTab?.sections
	const resolvedSectionId = resolveSectionId(
		sectionDefs,
		activeTab?.defaultSection,
		activeSectionId ?? null,
	)

	const handleTabChange = (value: string | null) => {
		const nextTabId = value || activeTabId
		setActiveTabId(nextTabId)
		const nextTab = tabs.find(tab => tab.id === nextTabId)
		setActiveSectionId(resolveSectionId(
			nextTab?.sections,
			nextTab?.defaultSection,
			null,
		))
	}

	const handleSectionChange = (sectionId: string) => {
		setActiveSectionId(sectionId)
		router.reload({
			data: {
				tab: activeTabId,
				section: sectionId,
			},
		})
	}

	return (
		<Page title={ title } breadcrumbs={ breadcrumbs }>
			<Section fullHeight p={ 0 } className={ classes.viewport }>
				<div className={ classes.shell }>
					<Tabs
						urlControlled={ true }
						defaultValue={ initialTab }
						onChange={ handleTabChange }
						className={ clsx(classes.tabs) }
					>
						<div className={ clsx(
							pageChrome.panelSurface,
							classes.chrome,
							{ [classes.chromeWithSubnav]: Boolean(sectionDefs?.length) },
						) }>
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

							{ sectionDefs && sectionDefs.length > 0 && resolvedSectionId && (
								<RecordShowSubNav
									items={ sectionDefs.map(section => ({
										id: section.id,
										label: section.label,
									})) }
									value={ resolvedSectionId }
									onChange={ handleSectionChange }
								/>
							) }
						</div>

						{ tabs.map(tab => {
							let panel = tab.panel
							if(tab.sections?.length) {
								const sectionId = tab.id === activeTabId
									? resolvedSectionId
									: resolveSectionId(tab.sections, tab.defaultSection, null)
								panel = tab.sections.find(section => section.id === sectionId)?.panel
									?? tab.sections[0].panel
							}

							return (
								<Tabs.Panel
									key={ tab.id }
									value={ tab.id }
									className={ pageChrome.panelWrapperSurface }
								>
									{ panel }
								</Tabs.Panel>
							)
						}) }
					</Tabs>
				</div>
			</Section>
		</Page>
	)
}
