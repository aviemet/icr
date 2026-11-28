import { isPlainObject } from "es-toolkit"

import { isMoney } from "@/types"

export { NestedObject } from "./Collections/NestedObject"
export { NestedURLSearchParams } from "./Collections/NestedURLSearchParams"

export const coerceArray = <T extends unknown>(arg: T | T[] | null | undefined) => {
	if(arg === null || arg === undefined) return []

	if(Array.isArray(arg)) return arg

	return [arg]
}

const omitPath = (source: Record<string, unknown>, path: string[]): Record<string, unknown> => {
	const [head, ...rest] = path
	if(head === undefined || !Object.hasOwn(source, head)) return source

	const copy = { ...source }
	if(rest.length === 0) {
		delete copy[head]
		return copy
	}

	const child = copy[head]
	if(isRecord(child)) copy[head] = omitPath(child, rest)
	return copy
}

export const exclude = <T extends any, K extends string>(obj: T, keys: K | K[]): Omit<T, K> | undefined => {
	if(!isRecord(obj)) return obj ?? undefined

	return coerceArray(keys).reduce<Record<string, unknown>>(
		(result, key) => omitPath(result, key.split(".")),
		obj,
	) as Omit<T, K>
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
		if(isMoney(value)) return

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

export function flattenToPaths(value: Record<string, unknown>) {
	const entries: Array<[string, unknown]> = []

	const walk = (current: unknown, prefix: string) => {
		if(isMoney(current)) {
			if(prefix) entries.push([prefix, current])
			return
		}

		if(isRecord(current)) {
			for(const [key, child] of Object.entries(current)) {
				const path = prefix ? `${prefix}.${key}` : key
				walk(child, path)
			}
			return
		}

		if(Array.isArray(current)) {
			const hasNestedStructure = current.some(child => isRecord(child) || Array.isArray(child))
			if(!hasNestedStructure) {
				if(prefix) entries.push([prefix, current])
				return
			}

			current.forEach((child, index) => {
				const path = prefix ? `${prefix}.${index}` : String(index)
				walk(child, path)
			})
			return
		}

		if(prefix) entries.push([prefix, current])
	}

	walk(value, "")

	return entries
}
