export type MenuItemObject = {
	id: string
	title: string
	type: 'group'|'item'|'collapse'
	icon?: React.ReactNode
	url?: string
	breadcrumbs?: boolean
	children?: [MenuItemObject]
}
