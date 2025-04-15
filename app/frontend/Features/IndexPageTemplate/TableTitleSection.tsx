import { router } from "@inertiajs/react"
import { Box, Title, Group, Divider, useMantineTheme } from "@mantine/core"

import { Menu } from "@/Components"
import { TrashIcon } from "@/Components/Icons"
import { useTableContext } from "@/Components/Table/TableContext"


import * as classes from "./IndexPage.css"

export interface IndexTableTitleSectionProps {
	children: React.ReactNode
	title: string
	deleteRoute?: string
	menuOptions?: {
		label: string
		href: string
		icon?: React.ReactNode
	}[]
}

const IndexTableTitleSection = ({ children, title, deleteRoute, menuOptions }: IndexTableTitleSectionProps) => {
	const theme = useMantineTheme()
	const { tableState: { selected } } = useTableContext()


	const deleteRecords = () => {
		if(!deleteRoute) return

		router.visit(deleteRoute, {
			method: "delete",
			data: { ids: Array.from(selected) },
		})
	}

	return (
		<Group justify="space-between" align="start" style={ { marginBottom: 12 } } gap="sm">
			<Group justify="space-between" className={ classes.title }>
				<Title>
					{ title }
				</Title>
				{ menuOptions && <Menu position="bottom-end">
					<Menu.Target />

					<Menu.Dropdown>
						{ menuOptions.map(({ label, href, icon }, index) => {
							return (
								<Menu.Link key={ index } href={ href } leftSection={ icon ? icon : undefined }>
									{ label }
								</Menu.Link>
							)
						}) }

						{ deleteRoute && selected.size > 0 && <>
							<Divider />

							<Menu.Item
								onClick={ deleteRecords }
								leftSection={ <TrashIcon size={ 14 } color={ theme.colors.red[6] } /> }
							>
								Delete
							</Menu.Item>
						</> }

					</Menu.Dropdown>
				</Menu> }
			</Group>
			{ !!children && <Box className={ classes.content }>
				{ children }
			</Box> }
		</Group>
	)
}

export default IndexTableTitleSection
