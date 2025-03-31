import { cloneDeep, unset } from "lodash-es"

export { default as NestedObject } from "./Collections/NestedObject"
export { default as NestedURLSearchParams } from "./Collections/NestedURLSearchParams"

export const coerceArray = <T extends unknown>(arg: T | T[] | null | undefined) => {
	if(arg === null || arg === undefined) return []

	if(Array.isArray(arg)) return arg

	return [arg]
}

export const exclude = <T extends any, K extends string>(obj: T, keys: K | K[]): Omit<T, K> | undefined => {
	const clone = cloneDeep(obj)
	if(clone) {
		coerceArray(keys).forEach(key => {
			unset(clone, key)
		})
	}
	return clone
}

export const withDefaults = (obj: Record<string, any>, defaults: Record<string, any>) => {
	return Object.assign(defaults, obj)
}

export const matchesAtPosition = (arr: string[], ...args: [number, string][]) => {
	if(args.length === 0) return false

	for(const [index, value] of args) {
		if(arr.length < index + 1 || arr[index] !== value) return false
	}

	return true
}
