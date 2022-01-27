import { Routes } from '@/lib'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'

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
	url?: string
	icon?: React.ReactNode
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
				url: Routes.root_path(),
				icon: DashboardIcon,
				breadcrumbs: false
			},
			{
				id: 'schedules',
				title: 'Schedules',
				type: 'item',
				url: Routes.schedules_path(),
				icon: CalendarTodayIcon,
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
				icon: PersonIcon,
				url: Routes.clients_path()
			},
			{
				id: 'employees',
				title: 'Employees',
				type: 'item',
				icon: PersonIcon,
				url: Routes.employees_path()
			}
		]
	}
]

export default menuItems
