import toPath from "lodash-es/toPath"
import { useCallback, useEffect, useState } from "react"

import { useFormFieldContext } from "./FormFieldContext"

export function nameToPath(name: string) {
	return toPath(name).join(".")
}

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function useSlotProps() {
	return useFormFieldContext().slotProps
}

export function useFormField(path: string) {
	const { subscribe, getValue, setValue } = useFormFieldContext()
	const [value, setState] = useState(() => getValue(path))

	useEffect(() => subscribe(path, setState), [path, subscribe])

	const setValueForPath = useCallback(
		(newValue: unknown) => setValue(path, newValue),
		[path, setValue]
	)

	return [value, setValueForPath]
}

export function getInputValue(element: FormControl) {
	if(element instanceof HTMLInputElement) {
		if(element.type === "checkbox") return element.checked

		if(element.type === "radio" && !element.checked) return undefined
	}

	if(element instanceof HTMLSelectElement && element.multiple) {
		return Array.from(element.selectedOptions).map(option => option.value)
	}

	return element.value
}

export function getFormValueByName(form: HTMLFormElement, name: string) {
	const field = form.elements.namedItem(name)

	if(field === null) return undefined

	if(field instanceof RadioNodeList) return field.value

	if(
		field instanceof HTMLInputElement ||
		field instanceof HTMLSelectElement ||
		field instanceof HTMLTextAreaElement
	) {
		return getInputValue(field)
	}

	return undefined
}

export function setFormValue(form: HTMLFormElement, path: string, value: unknown) {
	const field = form.elements.namedItem(path)
	if(field === null) return
	if(field instanceof RadioNodeList) return setRadioNodeListValue(field, value)
	if(field instanceof HTMLInputElement) return setInputElementValue(field, value)
	if(field instanceof HTMLSelectElement) return setSelectElementValue(field, value)
	if(field instanceof HTMLTextAreaElement) return setTextAreaElementValue(field, value)
}

function dispatchInputAndChange(element: HTMLElement) {
	element.dispatchEvent(new Event("input", { bubbles: true }))
	element.dispatchEvent(new Event("change", { bubbles: true }))
}

function setRadioNodeListValue(field: RadioNodeList, value: unknown) {
	const valueStr = String(value)
	for(let i = 0; i < field.length; i++) {
		const input = field[i]
		if(input instanceof HTMLInputElement) {
			input.checked = input.value === valueStr
		}
	}
	const first = field[0]
	if(first instanceof HTMLInputElement) {
		first.dispatchEvent(new Event("input", { bubbles: true }))
	}
}

function setInputElementValue(field: HTMLInputElement, value: unknown) {
	if(field.type === "checkbox") {
		field.checked = Boolean(value)
	} else if(field.type === "radio") {
		field.checked = field.value === String(value)
	} else {
		field.value = value === null ? "" : String(value)
	}
	dispatchInputAndChange(field)
}

function setSelectElementValue(field: HTMLSelectElement, value: unknown) {
	if(field.multiple && Array.isArray(value)) {
		Array.from(field.options).forEach(option => {
			option.selected = value.includes(option.value)
		})
	} else {
		field.value = value === null ? "" : String(value)
	}
	dispatchInputAndChange(field)
}

function setTextAreaElementValue(field: HTMLTextAreaElement, value: unknown) {
	field.value = value === null ? "" : String(value)
	dispatchInputAndChange(field)
}

