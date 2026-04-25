import { NestedURLSearchParams, coerceArray, isUnset } from "@/lib"

import { type InputParam } from "./useAdvancedSearch"

/**
 * Generate a URL for advanced searching
 *
 * @param inputParams List of all input params passed to hook
 * @param values Map of all current search values
 * @returns Link to same page with URL params to use for advanced search
 */
function buildSearchLink(
	inputParams: readonly InputParam[],
	values: NestedURLSearchParams,
) {
	const localValues = values.clone()

	inputParams.forEach(param => {
		const value = localValues.get(param.name)

		// Exclude key if dependents are empty
		if(param?.dependent) {
			let shouldBeIncluded = true

			coerceArray(param.dependent).forEach(dependentParam => {
				if(isUnset(values.get(dependentParam))) {
					shouldBeIncluded = false
				}
			})

			if(!shouldBeIncluded) {
				localValues.unset(param.name)
				return
			}
		}

		// Handle Date values
		if(value instanceof Date || (Array.isArray(value) && value[0] instanceof Date)) {
			const dateStr = coerceArray(value).reduce((str, date, i) => {
				return `${str}${i === 0 ? "" : ","}${date.toISOString()}`
			}, "")
			const normalizedKey = param.name.replace(/\[(\w+)\]/g, ".$1")
			if(normalizedKey !== param.name) {
				localValues.unset(param.name)
			}
			localValues.set(normalizedKey, dateStr)
			return
		}

		// Convert bracket notation to dot notation for nested params
		const normalizedKey = param.name.replace(/\[(\w+)\]/g, ".$1")
		if(normalizedKey !== param.name) {
			localValues.unset(param.name)
		}
		localValues.set(normalizedKey, value)

	})

	if(localValues.isEmpty()) {
		return `${location.pathname}`
	} else {
		localValues.set("adv", "true")
		return localValues.toString()
	}
}

export { buildSearchLink }
