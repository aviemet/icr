import FontDownloadIcon from '@mui/icons-material/FontDownload'
import PaletteIcon from '@mui/icons-material/Palette'
import AirIcon from '@mui/icons-material/Air'

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
	id: 'utilities',
	title: 'Utilities',
	type: 'group',
	children: [
		{
			id: 'util-typography',
			title: 'Typography',
			type: 'item',
			url: '/utils/util-typography',
			icon: FontDownloadIcon,
			breadcrumbs: false
		},
		{
			id: 'util-color',
			title: 'Color',
			type: 'item',
			url: '/utils/util-color',
			icon: PaletteIcon,
			breadcrumbs: false
		},
		{
			id: 'util-shadow',
			title: 'Shadow',
			type: 'item',
			url: '/utils/util-shadow',
			breadcrumbs: false
		},
		{
			id: 'icons',
			title: 'Icons',
			type: 'collapse',
			icon: AirIcon,
			children: [
				{
					id: 'tabler-icons',
					title: 'Tabler Icons',
					type: 'item',
					url: '/icons/tabler-icons',
					breadcrumbs: false
				},
				{
					id: 'material-icons',
					title: 'Material Icons',
					type: 'item',
					url: '/icons/material-icons',
					breadcrumbs: false
				}
			]
		}
	]
}

export default utilities
