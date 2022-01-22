import { Routes } from 'lib'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'

const menuItems = { items: [
	{
		id: 'dashboard',
		title: 'Dashboard',
		type: 'group',
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
		type: 'group',
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
] }

export default menuItems
