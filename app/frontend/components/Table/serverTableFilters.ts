import {
	emptyDateRangeFilterValue,
	type DateRangeFilterValue,
} from "./Filters"

export type ServerTableTextField = {
	param: string
	kind: "text"
}

export type ServerTableMultiField = {
	param: string
	kind: "multi"
	default?: string[]
}

export type ServerTableDateRangeField = {
	param: string
	kind: "date_range"
}

export type ServerTableFilterField =
	| ServerTableTextField
	| ServerTableMultiField
	| ServerTableDateRangeField

export type ServerTableFilterValues = Record<string, string | string[] | DateRangeFilterValue>

function readArrayParam(params: URLSearchParams, key: string) {
	const bracketValues = params.getAll(`${key}[]`)
	if(bracketValues.length > 0) {
		return bracketValues
	}

	return params.getAll(key)
}

function deleteArrayParam(params: URLSearchParams, key: string) {
	params.delete(key)
	params.delete(`${key}[]`)
}

function writeArrayParam(params: URLSearchParams, key: string, values: string[]) {
	deleteArrayParam(params, key)

	if(values.length === 0) {
		params.append(`${key}[]`, "")
		return
	}

	for(const value of values) {
		params.append(`${key}[]`, value)
	}
}

function hasParam(params: URLSearchParams, key: string) {
	return params.has(key) || params.has(`${key}[]`)
}

function dateRangeStartKey(param: string) {
	return `${param}[start]`
}

function dateRangeEndKey(param: string) {
	return `${param}[end]`
}

function dateRangeTypeKey(param: string) {
	return `${param}[type]`
}

function deleteDateRangeParam(params: URLSearchParams, key: string) {
	params.delete(dateRangeStartKey(key))
	params.delete(dateRangeEndKey(key))
	params.delete(dateRangeTypeKey(key))
}

function readDateRangeParam(params: URLSearchParams, key: string): DateRangeFilterValue {
	return {
		start: params.get(dateRangeStartKey(key)) ?? "",
		end: params.get(dateRangeEndKey(key)) ?? "",
	}
}

function writeDateRangeParam(params: URLSearchParams, key: string, value: DateRangeFilterValue) {
	deleteDateRangeParam(params, key)

	if(value.start === "" || value.end === "") {
		return
	}

	params.set(dateRangeStartKey(key), value.start)
	params.set(dateRangeEndKey(key), value.end)
	params.set(dateRangeTypeKey(key), "range")
}

function isDateRangeValue(value: string | string[] | DateRangeFilterValue | undefined): value is DateRangeFilterValue {
	return typeof value === "object" && value !== null && !Array.isArray(value) && "start" in value && "end" in value
}

function arraysEqual(left: string[], right: string[]) {
	return left.length === right.length && left.every((value, index) => value === right[index])
}

function emptyValues(fields: ServerTableFilterField[]) {
	const values: ServerTableFilterValues = {}

	for(const field of fields) {
		if(field.kind === "text") {
			values[field.param] = ""
		} else if(field.kind === "date_range") {
			values[field.param] = { ...emptyDateRangeFilterValue }
		} else if(field.default) {
			values[field.param] = [...field.default]
		} else {
			values[field.param] = []
		}
	}

	return values
}

function isDefaultValues(fields: ServerTableFilterField[], values: ServerTableFilterValues) {
	return fields.every(field => {
		const value = values[field.param]
		if(field.kind === "text") {
			return value === "" || value === undefined
		}

		if(field.kind === "date_range") {
			if(!isDateRangeValue(value)) {
				return true
			}

			return value.start === "" || value.end === ""
		}

		const multiValue = Array.isArray(value) ? value : []
		if(field.default) {
			return arraysEqual(multiValue, field.default)
		}

		return multiValue.length === 0
	})
}

export function readServerTableFilters(
	params: URLSearchParams,
	fields: ServerTableFilterField[],
) {
	const values: ServerTableFilterValues = {}

	for(const field of fields) {
		if(field.kind === "text") {
			values[field.param] = params.get(field.param) ?? ""
			continue
		}

		if(field.kind === "date_range") {
			values[field.param] = readDateRangeParam(params, field.param)
			continue
		}

		if(!hasParam(params, field.param)) {
			values[field.param] = field.default ? [...field.default] : []
			continue
		}

		values[field.param] = readArrayParam(params, field.param).filter(value => value !== "")
	}

	return values
}

export function writeServerTableFilters(
	url: URL,
	fields: ServerTableFilterField[],
	values: ServerTableFilterValues,
) {
	const params = url.searchParams

	for(const field of fields) {
		if(field.kind === "text") {
			params.delete(field.param)
		} else if(field.kind === "date_range") {
			deleteDateRangeParam(params, field.param)
		} else {
			deleteArrayParam(params, field.param)
		}
	}
	params.delete("adv")
	params.delete("page")

	if(isDefaultValues(fields, values)) {
		return url
	}

	for(const field of fields) {
		const value = values[field.param]

		if(field.kind === "text") {
			const textValue = typeof value === "string" ? value : ""
			if(textValue !== "") {
				params.set(field.param, textValue)
			}
			continue
		}

		if(field.kind === "date_range") {
			if(isDateRangeValue(value)) {
				writeDateRangeParam(params, field.param, value)
			}
			continue
		}

		const multiValue = Array.isArray(value) ? value : []
		if(field.default) {
			if(multiValue.length === 0) {
				writeArrayParam(params, field.param, [])
			} else if(!arraysEqual(multiValue, field.default)) {
				writeArrayParam(params, field.param, multiValue)
			}
			continue
		}

		if(multiValue.length > 0) {
			writeArrayParam(params, field.param, multiValue)
		}
	}

	params.set("adv", "true")

	return url
}

export function defaultServerTableFilterValues(fields: ServerTableFilterField[]) {
	return emptyValues(fields)
}
