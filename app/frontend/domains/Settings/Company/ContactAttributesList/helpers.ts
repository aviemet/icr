import { get } from "es-toolkit/compat"

export function getArrayAtPath(data: Record<string, unknown>, basePath: string) {
	const value = get(data, basePath)
	return Array.isArray(value) ? value : []
}

export function draftToRecord(draft: Record<string, string>, emptyData: Record<string, unknown>) {
	const next: Record<string, unknown> = { ...emptyData }
	Object.entries(draft).forEach(([key, value]) => {
		next[key] = value
	})
	return next
}

export function blankDraftFrom(emptyData: Record<string, unknown>) {
	const initial: Record<string, string> = {}
	Object.keys(emptyData).forEach(key => {
		initial[key] = ""
	})
	return initial
}
