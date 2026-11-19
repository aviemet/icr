import { usePage } from "@inertiajs/react"

type PageWithCanUpdate = {
	can_update?: boolean
	can_updates?: Record<string, boolean>
}

export function useRecordCanUpdate(fallback = false) {
	const { can_update } = usePage().props as PageWithCanUpdate
	return can_update ?? fallback
}

export function useRecordCanUpdates() {
	const { can_updates } = usePage().props as PageWithCanUpdate
	return can_updates ?? {}
}
