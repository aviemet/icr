import { type VisitOptions } from "@inertiajs/core"
import { router } from "@inertiajs/react"
import { Tabs } from "@mantine/core"
import React, { useEffect, useCallback } from "react"


import { coerceArray } from "@/lib"

import { ITabsComponentProps } from "."

export function UrlTabs({ children, onChange, defaultValue, dependencies, ...props }: ITabsComponentProps) {
	const navigateTab = useCallback((value: string | null, options?: VisitOptions) => {
		let only: string[] = []
		if(value && dependencies?.[value]) {
			only = coerceArray(dependencies[value])
		}

		router.reload(Object.assign({
			preserveState: true,
			preserveScroll: true,
			data: { tab: value },
			only,
		}, options || {}))
	}, [dependencies])

	const activeTab = useCallback(() => {
		const url = new URL(window.location.href)

		return url.searchParams.get("tab")
	}, [])

	useEffect(() => {
		if(!activeTab() && defaultValue) {
			navigateTab(defaultValue, { replace: true })
		} else {
			document.addEventListener("inertia:navigate", function reloadActiveTab() {
				navigateTab(activeTab())
				document.removeEventListener("inertia:navigate", reloadActiveTab)
			})
		}
	}, [activeTab, defaultValue, navigateTab])

	const handleTabChange = (value: string | null) => {
		navigateTab(value || activeTab())

		if(onChange) onChange(value || activeTab())
	}

	return (
		<Tabs
			defaultValue={ activeTab() || defaultValue }
			keepMounted={ false }
			onChange={ handleTabChange }
			{ ...props }
		>
			{ children }
		</Tabs>
	)
}
