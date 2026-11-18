import { useCallback } from "react"

import { usePageProps } from "./usePageProps"

export function usePermissions() {
	const { permissions } = usePageProps()

	const can = useCallback((resource: string, action: string) => {
		const resourcePermissions = permissions?.[resource]
		if(!resourcePermissions) return false

		return Boolean(resourcePermissions[action])
	}, [permissions])

	return { can, permissions }
}
