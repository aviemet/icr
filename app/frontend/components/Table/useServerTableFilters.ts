import { router } from "@inertiajs/react"
import { debounce } from "es-toolkit"
import { useEffect, useMemo, useState } from "react"

import { useLocation } from "@/lib/hooks/useLocation"

import { useTableContext } from "./Provider"
import {
	defaultServerTableFilterValues,
	readServerTableFilters,
	writeServerTableFilters,
	type ServerTableFilterField,
	type ServerTableFilterValues,
} from "./serverTableFilters"

function valuesEqual(left: ServerTableFilterValues, right: ServerTableFilterValues) {
	const leftKeys = Object.keys(left)
	const rightKeys = Object.keys(right)
	if(leftKeys.length !== rightKeys.length) return false

	return leftKeys.every(key => {
		const leftValue = left[key]
		const rightValue = right[key]
		if(Array.isArray(leftValue) && Array.isArray(rightValue)) {
			return leftValue.length === rightValue.length &&
				leftValue.every((value, index) => value === rightValue[index])
		}

		return leftValue === rightValue
	})
}

export function useServerTableFilters({
	fields,
	only,
	debounceMs = 400,
	enabled = true,
}: {
	fields: ServerTableFilterField[]
	only: string[]
	debounceMs?: number
	enabled?: boolean
}) {
	const location = useLocation()
	const tableContext = useTableContext(false)
	const setSearching = tableContext?.setSearching
	const [values, setValues] = useState<ServerTableFilterValues>(() => (
		enabled
			? readServerTableFilters(location.params, fields)
			: defaultServerTableFilterValues(fields)
	))
	const [syncedSearch, setSyncedSearch] = useState<string | null>(() => (
		enabled ? location.search : null
	))

	if(enabled && location.search !== syncedSearch) {
		setSyncedSearch(location.search)
		const nextValues = readServerTableFilters(location.params, fields)
		setValues(current => (valuesEqual(current, nextValues) ? current : nextValues))
	}

	const visitFilters = useMemo(() => {
		if(!enabled) return null

		return debounce((nextValues: ServerTableFilterValues) => {
			const url = writeServerTableFilters(new URL(window.location.href), fields, nextValues)
			setSearching?.(true)
			router.get(url.toString(), {}, {
				preserveState: true,
				preserveScroll: true,
				replace: true,
				only,
				onFinish: () => {
					setSearching?.(false)
				},
			})
		}, debounceMs)
	}, [debounceMs, enabled, fields, only, setSearching])

	useEffect(() => {
		return () => {
			visitFilters?.cancel()
		}
	}, [visitFilters])

	const visitImmediate = (nextValues: ServerTableFilterValues) => {
		if(!enabled || !visitFilters) return
		visitFilters.cancel()
		const url = writeServerTableFilters(new URL(window.location.href), fields, nextValues)
		setSearching?.(true)
		router.get(url.toString(), {}, {
			preserveState: true,
			preserveScroll: true,
			replace: true,
			only,
			onFinish: () => {
				setSearching?.(false)
			},
		})
	}

	const setText = (param: string, value: string) => {
		const nextValues = { ...values, [param]: value }
		setValues(nextValues)
		visitFilters?.(nextValues)
	}

	const setMulti = (param: string, value: string[]) => {
		const nextValues = { ...values, [param]: value }
		setValues(nextValues)
		visitImmediate(nextValues)
	}

	return {
		values,
		setText,
		setMulti,
	}
}
