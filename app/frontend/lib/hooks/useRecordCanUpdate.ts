import { usePageProps } from "./usePageProps"

export function useRecordCanUpdate(fallback = false) {
	const { can_update } = usePageProps()
	return can_update ?? fallback
}

export function useRecordCanUpdates() {
	const { can_updates } = usePageProps()
	return can_updates ?? {}
}
