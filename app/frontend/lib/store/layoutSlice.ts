import { StateCreator } from 'zustand'
import { defaultColor } from '../theme'

export interface LayoutSlice {
	sidebarOpen: boolean
	toggleSidebarOpen: (sidebarOpen?: boolean) => void
	siteTitle: string
	primaryColor: string
	setPrimaryColor: (color: string) => void

	defaults: {
		tableRecordsLimit: number
	}
}

export const createLayoutSlice: StateCreator<LayoutSlice> = (set) => ({
	sidebarOpen: true,
	primaryColor: defaultColor,
	siteTitle: 'Super SLS',

	defaults: {
		tableRecordsLimit: 25,
	},

	toggleSidebarOpen: sidebarOpen => set(state => {
		let setValue = sidebarOpen
		if(sidebarOpen === undefined) {
			setValue = !state.sidebarOpen
		}
		return { sidebarOpen: setValue }
	}),

	setPrimaryColor: color => set(state => ({
		primaryColor: color,
	})),
})
