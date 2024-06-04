import { create } from 'zustand'
import { defaultColor } from '../theme'


interface LayoutState {
	sidebarOpen: boolean
	toggleSidebarOpen: (sidebarOpen?: boolean) => void
	siteTitle: string
	primaryColor: string
	setPrimaryColor: (color: string) => void

	defaults: {
		tableRecordsLimit: number
	}
}

const useLayoutStore = create<LayoutState>()((set) => ({
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
}))

export default useLayoutStore
