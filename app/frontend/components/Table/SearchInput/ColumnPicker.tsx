import { router } from "@inertiajs/react"
import { Button } from "@mantine/core"
import axios from "axios"
import clsx from "clsx"

import { Menu } from "@/components"
import { ColumnsIcon } from "@/components/Icons"
import { Checkbox } from "@/components/Inputs"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import * as classes from "../Table.css"
import { useTableContext } from "../TableContext"

const ColumnPicker = () => {
	const { auth: { user } } = usePageProps()
	const { tableState: { hideable, columns, model } } = useTableContext()

	if(!hideable || !model) return <></>

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		axios.patch( Routes.apiUpdateTablePreferences(user.id!), {
			user: {
				table_preferences: {
					[model]: {
						hide: {
							[e.target.name]: !e.target.checked,
						},
					},
				},
			},
		}).then(() => {
			router.reload({ only: ["auth"] })
		})
	}

	return (
		<Menu closeOnItemClick={ false } position="bottom-end">
			<Menu.Target>
				<Button p="xxs" className={ clsx("column-picker") }>
					<ColumnsIcon size={ 24 } />
				</Button>
			</Menu.Target>

			<Menu.Dropdown>
				{ columns.filter(option => option.hideable).map(({ label, hideable }) => (
					<Menu.Item key={ label } component="div" style={ { cursor: "default", padding: 0 } }>
						<Checkbox
							name={ hideable }
							label={ label }
							onChange={ handleChange }
							checked={ !user.table_preferences?.[model]?.hide?.[hideable] }
							p="xs"
						/>
					</Menu.Item>
				)) }
			</Menu.Dropdown>
		</Menu>
	)
}

export default ColumnPicker
