import { Routes } from 'lib'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard: Nav.MenuItemObject = {
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
}

export default dashboard
