import { Page, Table } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"

import { IndexTableTitleSection, type IndexTableTitleSectionProps } from "./TableTitleSection"

export interface IndexPageTemplateProps extends IndexTableTitleSectionProps {
	model: string
	pagination: Schema.Pagination
	search?: boolean
	breadcrumbs?: Breadcrumb[]
	advancedSearch?: React.ReactNode
}

export function IndexPageTemplate({
	children,
	title,
	model,
	pagination,
	search = true,
	breadcrumbs,
	menuOptions,
	advancedSearch,
	deleteRoute,
}: IndexPageTemplateProps) {
	return (
		<Page title={ title } breadcrumbs={ breadcrumbs ?? [
			{ title, href: window.location.href },
		] }>
			<Table.Section>
				<Table.TableProvider
					selectable
					model={ model }
					pagination={ pagination }
				>
					<IndexTableTitleSection title={ title } menuOptions={ menuOptions } deleteRoute={ deleteRoute }>
						{ search && <Table.SearchInput model={ model } advancedSearch={ advancedSearch } /> }
					</IndexTableTitleSection>

					{ children }

					<Table.Pagination pagination={ pagination } model={ model } />
				</Table.TableProvider>
			</Table.Section>
		</Page>
	)
}
