import { DashboardIcon, PeopleIcon, ShiftsIcons, UsersIcon } from '@/Components/Icons'
import { Routes } from '@/lib'
import { type IconType } from 'react-icons/lib'

type TMenuGroup = {
	id: string
	title: string
	caption?: string
	children: TMenuItem[]
}

type TMenuItem = {
	id: string
	title: string
	caption?: string
	type: 'item'|'collapse'
	url: string
	icon: IconType
	external?: boolean
	target?: boolean
	breadcrumbs?: boolean
	children?: TMenuItem[]
}

const menuItems: TMenuGroup[] = [
	{
		id: 'dashboard',
		title: 'Dashboard',
		children: [
			{
				id: 'default',
				title: 'Dashboard',
				type: 'item',
				url: Routes.root(),
				icon: DashboardIcon,
				breadcrumbs: false
			},
			{
				id: 'schedules',
				title: 'Schedules',
				type: 'item',
				url: Routes.shifts(),
				icon: ShiftsIcons,
				breadcrumbs: false
			}
		]
	},

	{
		id: 'data',
		title: 'Information',
		caption: 'Staff and Client Data',
		children: [
			{
				id: 'clients',
				title: 'Clients',
				type: 'item',
				icon: PeopleIcon,
				url: Routes.clients()
			},
			{
				id: 'employees',
				title: 'Employees',
				type: 'item',
				icon: UsersIcon,
				url: Routes.employees()
			}
		]
	}
]

export default menuItems
