import { beforeEach, describe, expect, it } from "vitest"

import { useStore } from "@/lib/store"
import {
	COLLAPSED_MENUS_STORAGE_KEY,
} from "@/lib/store/layoutSlice"

describe("layoutSlice collapsed menus", () => {
	beforeEach(() => {
		localStorage.clear()
		useStore.setState({
			sidebarOpen: true,
			collapsedMenus: {},
		})
	})

	it("toggles a menu key and writes localStorage", () => {
		useStore.getState().toggleMenuCollapsed("clients")

		expect(useStore.getState().collapsedMenus).toEqual({ clients: true })
		expect(localStorage.getItem(COLLAPSED_MENUS_STORAGE_KEY)).toBe(JSON.stringify({ clients: true }))

		useStore.getState().toggleMenuCollapsed("clients")

		expect(useStore.getState().collapsedMenus).toEqual({ clients: false })
		expect(localStorage.getItem(COLLAPSED_MENUS_STORAGE_KEY)).toBe(JSON.stringify({ clients: false }))
	})
})
