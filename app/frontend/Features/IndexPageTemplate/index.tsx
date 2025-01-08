import { Page, Table } from '@/Components'
import TableTitleSection, { IndexTableTitleSectionProps } from './TableTitleSection'
import { type Breadcrumb } from '@/Components/Breadcrumbs'

interface IIndexPageTemplateProps extends IndexTableTitleSectionProps {
	model: string
	rows: Record<string, any>[]
	pagination: Schema.Pagination
	search?: boolean
	breadcrumbs?: Breadcrumb[]
	advancedSearch?: React.ReactNode
}

const IndexPageTemplate = ({
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
}: IIndexPageTemplateProps) => {
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
					<TableTitleSection title={ title } menuOptions={ menuOptions } deleteRoute={ deleteRoute }>
						{ search && <Table.SearchInput advancedSearch={ advancedSearch } /> }
					</TableTitleSection>

					{ children }

					<Table.Pagination />
				</Table.TableProvider>
			</Table.Section>
		</Page>
	)
}

export default IndexPageTemplate
