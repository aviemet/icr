export type ServerTableTextField = {
	param: string
	kind: "text"
}

export type ServerTableMultiField = {
	param: string
	kind: "multi"
	default?: string[]
}

export type ServerTableFilterField = ServerTableTextField | ServerTableMultiField

export type ServerTableFilterValues = Record<string, string | string[]>

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

function arraysEqual(left: string[], right: string[]) {
	return left.length === right.length && left.every((value, index) => value === right[index])
}

function emptyValues(fields: ServerTableFilterField[]) {
	const values: ServerTableFilterValues = {}

	for(const field of fields) {
		if(field.kind === "text") {
			values[field.param] = ""
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
