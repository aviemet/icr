import { useCallback, useMemo, useState } from "react"

type Identifiable = { id: string | number }

function upsertById<TItem extends Identifiable>(items: TItem[], upsertItem: TItem) {
	let didUpdate = false

	const nextItems = items.map((item) => {
		if(item.id !== upsertItem.id) return item

		didUpdate = true

		return { ...item, upsertItem }
	})

	if(!didUpdate) {
		nextItems.push(upsertItem)
	}

	return nextItems
}

function patchById<TItem extends Identifiable>(items: TItem[], id: TItem["id"], patch: Partial<TItem>) {
	return items.map(item => (item.id !== id) ? item : { ...item, ...patch })
}

function removeById<TItem extends Identifiable>(items: TItem[], id: TItem["id"]) {
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

