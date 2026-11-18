import { router } from "@inertiajs/react"
import { Box, Title, Group, Button, useMantineTheme } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { Link } from "@/components"
import { TrashIcon } from "@/components/Icons"
import { useTableContext } from "@/components/Table/Provider"

import * as classes from "./IndexPage.css"

export interface IndexTableAction {
	label: string
	href: string
	icon?: React.ReactNode
}

export interface IndexTableTitleSectionProps {
	children: React.ReactNode
	title: string
	deleteRoute?: string
	actions?: IndexTableAction[]
}

export function IndexTableTitleSection({
	children,
	title,
	deleteRoute,
	actions,
}: IndexTableTitleSectionProps) {
	const { t } = useTranslation()
	const theme = useMantineTheme()
	const tableContext = useTableContext(false)
	const selectedRecordIds = tableContext?.selectedRecordIds ?? []
	const hasSelection = selectedRecordIds.length > 0

	const deleteRecords = () => {
		if(!deleteRoute) return

		router.visit(deleteRoute, {
			method: "delete",
			data: { ids: selectedRecordIds },
		})
	}

	const clearSelection = () => {
		tableContext?.setSelectedRecordIds([])
	}

	return (
		<Group justify="space-between" align="center" style={ { marginBottom: 12 } } gap="sm">
			<Group className={ classes.title } gap="sm" align="center" wrap="wrap">
				{ hasSelection
					? (
						<>
							<Title>
								{ t("views.index_template.selected_count", { count: selectedRecordIds.length }) }
							</Title>
							<span className={ classes.titleSpacer } aria-hidden />
							{ deleteRoute && (
								<Button
									size="sm"
									variant="light"
									color="red"
									leftSection={ <TrashIcon size={ 14 } color={ theme.colors.red[6] } /> }
									onClick={ deleteRecords }
								>
									{ t("views.index_template.delete_selected") }
								</Button>
							) }
							<Button size="sm" variant="default" onClick={ clearSelection }>
								{ t("views.index_template.clear_selection") }
							</Button>
						</>
					)
					: (
						<>
							<Title>{ title }</Title>
							<span className={ classes.titleSpacer } aria-hidden />
							{ actions?.map(action => (
								<Link
									key={ action.href }
									as="button"
									href={ action.href }
									buttonProps={ {
										size: "sm",
										variant: "light",
										leftSection: action.icon,
									} }
								>
									{ action.label }
								</Link>
							)) }
						</>
					) }
			</Group>
			{ !!children && <Box className={ classes.content }>
				{ children }
			</Box> }
		</Group>
	)
}
