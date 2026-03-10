import { Page, Table } from "@/components"
import { type Breadcrumb } from "@/components/Breadcrumbs"

import { IndexTableTitleSection, type IndexTableTitleSectionProps } from "./TableTitleSection"

export interface IIndexPageTemplateProps extends IndexTableTitleSectionProps {
	model: string
	rows: Record<string, any>[]
	pagination: Schema.Pagination
	search?: boolean
	breadcrumbs?: Breadcrumb[]
	advancedSearch?: React.ReactNode
}

export function IndexPageTemplate({
	children,
	title,
	model,
	rows,
	pagination,
	search = true,
	breadcrumbs,
	menuOptions,
	advancedSearch,
	deleteRoute,
}: IIndexPageTemplateProps) {
	return (
		<Page title={ title } breadcrumbs={ breadcrumbs ?? [
			{ title, href: window.location.href },
		] }>
			<Table.Section>
				<Table.TableProvider
					selectable
					model={ model }
					rows={ rows }
					pagination={ pagination }
				>
					<IndexTableTitleSection title={ title } menuOptions={ menuOptions } deleteRoute={ deleteRoute }>
						{ search && <Table.SearchInput advancedSearch={ advancedSearch } /> }
					</IndexTableTitleSection>

					{ children }

					<Table.Pagination />
				</Table.TableProvider>
			</Table.Section>
		</Page>
	)
}
