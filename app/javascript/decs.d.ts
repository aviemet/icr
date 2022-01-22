export type TMenuGroup = {
	id: string
	title: string
	type: 'group'
	catption?: string
	children?: [MenuItemObject]
}

export type TMenuItem = {
	id: string
	title: string
	type: 'group'|'item'|'collapse'
	catption?: string
	icon?: React.ReactNode
	url?: string
	breadcrumbs?: boolean
	children?: [MenuItemObject]
}
