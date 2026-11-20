import clsx from "clsx"
import { type ReactNode } from "react"

import { Box, Table } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"
import { Page } from "@/components/Page"
import { pageChrome } from "@/components/PageChrome"
import { usePageProps } from "@/lib/hooks/usePageProps"

import * as classes from "./IndexPage.css"
import { IndexTableTitleSection, type IndexTableTitleSectionProps } from "./TableTitleSection"

export interface IndexPageTemplateProps extends IndexTableTitleSectionProps {
	model: string
	pagination: Schema.Pagination
	search?: boolean
	searchLeading?: ReactNode
	searchInputClassName?: string
	searchClusterClassName?: string
	breadcrumbs?: Breadcrumb[]
	dense?: boolean
}

export function IndexPageTemplate({
	children,
	title,
	model,
	pagination,
	search = true,
	searchLeading,
	searchInputClassName,
	searchClusterClassName,
	breadcrumbs,
	actions,
	deleteRoute,
	dense = false,
}: IndexPageTemplateProps) {
	const { auth: { user } } = usePageProps()
	const columnHide = user.table_preferences?.[model]?.hide ?? {}

	return (
		<Page title={ title } breadcrumbs={ breadcrumbs ?? [
			{ title, href: window.location.href },
		] }>
			<Table.Section>
				<Box className={ clsx({
					[pageChrome.panelFill]: dense,
					[classes.denseShell]: dense,
				}) }>
					<Table.Provider
						selectable
						model={ model }
						pagination={ pagination }
						columnHide={ columnHide }
					>
						<IndexTableTitleSection title={ title } actions={ actions } deleteRoute={ deleteRoute }>
							{ (search || searchLeading) && (
								<Box className={ searchClusterClassName }>
									{ searchLeading }
									{ search && (
										<Table.SearchInput
											model={ model }
											className={ searchInputClassName }
										/>
									) }
								</Box>
							) }
						</IndexTableTitleSection>

						{ children }

						<Table.Pagination pagination={ pagination } model={ model } />
					</Table.Provider>
				</Box>
			</Table.Section>
		</Page>
	)
}
