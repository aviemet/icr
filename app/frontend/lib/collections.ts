import { cloneDeep, isPlainObject, unset } from "lodash-es"

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

export const hasUniqueValues = <T extends Record<K, PropertyKey>, K extends keyof T>(
	array: T[],
	key: K
): boolean => {
	const seen = new Set<T[K]>()

	for(const item of array) {
		if(seen.has(item[key])) return false
		seen.add(item[key])
	}

	return true
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return isPlainObject(value) && !Array.isArray(value)
}

export const renameObjectWithAttributes = <T>(data: T, str = "_attributes"): T => {
	if(typeof data !== "object" || data === null) return data

	const clone = structuredClone(data)
	for(const value of Object.values(clone)) {
		if(isRecord(value)) {
			recursiveAppendString(value, str)
		}
	}
	return clone
}

function recursiveAppendString(data: Record<string, unknown>, str: string): void {
	Object.entries(data).forEach(([key, value]) => {
		if(isRecord(value)) {
			renameKey(data, key, `${key}${str}`)
			recursiveAppendString(value, str)
		} else if(Array.isArray(value)) {
			renameKey(data, key, `${key}${str}`)
		}
	})
}

function renameKey(
	obj: Record<string, unknown>,
	oldKey: string,
	newKey: string
): void {
	if(oldKey !== newKey) {
		obj[newKey] = obj[oldKey]
		delete obj[oldKey]
	}
}

export function flattenToPaths(
	obj: Record<string, unknown>,
	prefix = ""
): [string, unknown][] {
	const result: [string, unknown][] = []
	for(const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key
		if(value !== null && typeof value === "object" && !(value instanceof Date)) {
			if(Array.isArray(value)) {
				value.forEach((item, index) => {
					const indexPath = `${path}.${index}`
					if(item !== null && typeof item === "object" && !(item instanceof Date) && !Array.isArray(item)) {
						result.push(...flattenToPaths(item as Record<string, unknown>, indexPath))
					} else {
						result.push([indexPath, item])
					}
				})
			} else {
				result.push(...flattenToPaths(value as Record<string, unknown>, path))
			}
		} else {
			result.push([path, value])
		}
	}
	return result
}
