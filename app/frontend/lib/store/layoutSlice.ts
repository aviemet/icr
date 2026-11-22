import { StateCreator } from "zustand"

import { defaultColor } from "../theme"

export const COLLAPSED_MENUS_STORAGE_KEY = "icr:sidebar:collapsedMenus"

export interface LayoutSlice {
	sidebarOpen: boolean
	toggleSidebarOpen: (sidebarOpen?: boolean) => void
	collapsedMenus: Record<string, boolean>
	toggleMenuCollapsed: (menuKey: string) => void
	siteTitle: string
	primaryColor: string
	setPrimaryColor: (color: string) => void
}

function loadCollapsedMenus(): Record<string, boolean> {
	try {
		const raw = localStorage.getItem(COLLAPSED_MENUS_STORAGE_KEY)
		if(!raw) return {}
		const parsed = JSON.parse(raw)
		if(typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {}
		return Object.fromEntries(
			Object.entries(parsed).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"),
		)
	} catch{
		return {}
	}
}

function persistCollapsedMenus(collapsedMenus: Record<string, boolean>) {
	localStorage.setItem(COLLAPSED_MENUS_STORAGE_KEY, JSON.stringify(collapsedMenus))
}

export const createLayoutSlice: StateCreator<LayoutSlice> = (set) => ({
	sidebarOpen: true,
	collapsedMenus: loadCollapsedMenus(),
	primaryColor: defaultColor,
	siteTitle: "Super SLS",

	toggleSidebarOpen: sidebarOpen => set(state => {
		let setValue = sidebarOpen
		if(sidebarOpen === undefined) {
			setValue = !state.sidebarOpen
		}
		return { sidebarOpen: setValue }
	}),

	toggleMenuCollapsed: menuKey => set(state => {
		const collapsedMenus = {
			...state.collapsedMenus,
			[menuKey]: !state.collapsedMenus[menuKey],
		}
		persistCollapsedMenus(collapsedMenus)
		return { collapsedMenus }
	}),

	setPrimaryColor: color => set(state => ({
		primaryColor: color,
	})),
})
