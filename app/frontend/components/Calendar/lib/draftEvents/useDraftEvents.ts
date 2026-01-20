import { useCallback, useMemo, useState } from "react"

type Identifiable = { id: string | number }

function upsertById<TItem extends Identifiable>(items: readonly TItem[], nextItem: TItem): TItem[] {
	let hasChanged = false
	const nextItems: TItem[] = []

	for(const item of items) {
		if(item.id === nextItem.id) {
			if(item !== nextItem) hasChanged = true
			nextItems.push(nextItem)
		} else {
			nextItems.push(item)
		}
	}

	if(!items.some(item => item.id === nextItem.id)) {
		nextItems.push(nextItem)
		hasChanged = true
	}

	return hasChanged ? nextItems : [...items]
}

function patchById<TItem extends Identifiable>(items: readonly TItem[], id: TItem["id"], patch: Partial<TItem>): TItem[] {
	let didFind = false
	let hasChanged = false

	const nextItems = items.map(item => {
		if(item.id !== id) return item
		didFind = true

		for(const [key, value] of Object.entries(patch)) {
			const typedKey = key as keyof TItem
			if(item[typedKey] !== value) {
				hasChanged = true
				break
			}
		}

		return hasChanged ? { ...item, ...patch } : item
	})

	if(!didFind) return [...items]
	return hasChanged ? nextItems : [...items]
}

function removeById<TItem extends Identifiable>(items: readonly TItem[], id: TItem["id"]): TItem[] {
	const nextItems = items.filter(item => item.id !== id)
	return nextItems.length === items.length ? [...items] : nextItems
}

interface DraftEventsApi<TDraft extends Identifiable> {
	draftEvents: TDraft[]
	upsertDraftEvent: (event: TDraft) => void
	patchDraftEvent: (id: TDraft["id"], patch: Partial<TDraft>) => void
	removeDraftEvent: (id: TDraft["id"]) => void
	clearDraftEvents: () => void
}

export function useDraftEvents<TDraft extends Identifiable>(): DraftEventsApi<TDraft> {
	const [draftEvents, setDraftEvents] = useState<TDraft[]>([])

	const upsertDraftEvent = useCallback((event: TDraft) => {
		setDraftEvents(current => upsertById(current, event))
	}, [])

	const patchDraftEvent = useCallback((id: TDraft["id"], patch: Partial<TDraft>) => {
		setDraftEvents(current => patchById(current, id, patch))
	}, [])

	const removeDraftEvent = useCallback((id: TDraft["id"]) => {
		setDraftEvents(current => removeById(current, id))
	}, [])

	const clearDraftEvents = useCallback(() => {
		setDraftEvents([])
	}, [])

	return useMemo(() => ({
		draftEvents,
		upsertDraftEvent,
		patchDraftEvent,
		removeDraftEvent,
		clearDraftEvents,
	}), [draftEvents, upsertDraftEvent, patchDraftEvent, removeDraftEvent, clearDraftEvents])
}

