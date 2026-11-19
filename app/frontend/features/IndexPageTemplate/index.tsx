import clsx from "clsx"

import { Table } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"
import { Page } from "@/components/Page"
import { usePageProps } from "@/lib/hooks/usePageProps"

import * as classes from "./IndexPage.css"
import { IndexTableTitleSection, type IndexTableTitleSectionProps } from "./TableTitleSection"

export interface IndexPageTemplateProps extends IndexTableTitleSectionProps {
	model: string
	pagination: Schema.Pagination
	search?: boolean
	breadcrumbs?: Breadcrumb[]
	dense?: boolean
}

export function IndexPageTemplate({
	children,
	title,
	model,
	pagination,
	search = true,
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
				<div className={ clsx(dense && classes.denseShell) }>
					<Table.Provider
						selectable
						model={ model }
						pagination={ pagination }
						columnHide={ columnHide }
					>
						<IndexTableTitleSection title={ title } actions={ actions } deleteRoute={ deleteRoute }>
							{ search && <Table.SearchInput model={ model } /> }
						</IndexTableTitleSection>

						{ children }

						<Table.Pagination pagination={ pagination } model={ model } />
					</Table.Provider>
				</div>
			</Table.Section>
		</Page>
	)
}
