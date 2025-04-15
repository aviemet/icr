import { useCallback } from "react"

import { CalendarEvent } from "@/Components/Calendar"
import { buildShiftTitle, formatEventTitle } from "@/lib"
import { usePageProps } from "@/lib/hooks"
import { initials } from "@/lib/strings"

// Ensure a value is a Date object
const ensureDate = (value: unknown): Date => {
	if(value instanceof Date) return value
	if(typeof value === "string" || typeof value === "number") return new Date(value)
	return new Date() // Fallback
}

interface UseShiftTitleFormatterOptions {
	fallbackToEventName?: boolean
}

interface Person {
	first_name?: string
	last_name?: string
}

export const useShiftTitleFormatter = (options: UseShiftTitleFormatterOptions = {}) => {
	const { settings } = usePageProps()

	const formatPersonName = (person: Person) => ({
		first_name: person.first_name || "",
		last_name: person.last_name || "",
		full_name: person.first_name && person.last_name
			? `${person.first_name} ${person.last_name}`
			: person.first_name || person.last_name || "",
		first_initial: person.first_name ? initials(person.first_name) : "",
		last_initial: person.last_name ? initials(person.last_name) : "",
	})

	const formatMultipleNames = useCallback((persons: Person[]) => {
		const names = persons.map(p => {
			const formatted = formatPersonName(p)
			return formatted.full_name
		}).filter(Boolean)

		if(names.length === 0) return ""
		if(names.length === 1) return names[0]
		if(names.length === 2) return `${names[0]} & ${names[1]}`
		return `${names.slice(0, - 1).join(", ")}, & ${names[names.length - 1]}`
	}, [])

	return useCallback((
		event: Partial<Pick<CalendarEvent, "start" | "end" | "allDay">>,
		person?: Person | Person[],
		displayStart?: Date,
		displayEnd?: Date
	) => {
		try {
			const templateVars = Array.isArray(person)
				? {
					first_name: person.map(p => p.first_name || "").join(", "),
					last_name: person.map(p => p.last_name || "").join(", "),
					full_name: formatMultipleNames(person),
					first_initial: person.map(p => p.first_name ? initials(p.first_name) : "").join(", "),
					last_initial: person.map(p => p.last_name ? initials(p.last_name) : "").join(", "),
				}
				: person
					? formatPersonName(person)
					: {
						first_name: "",
						last_name: "",
						full_name: "",
						first_initial: "",
						last_initial: "",
					}

			// Ensure dates are Date objects
			const start = displayStart ? ensureDate(displayStart) : ensureDate(event.start)
			const end = displayEnd ? ensureDate(displayEnd) : ensureDate(event.end)

			try {
				return formatEventTitle(
					settings.shift_title_format,
					start,
					end,
					templateVars
				)
			// eslint-disable-next-line no-unused-vars
			} catch(e) {
				return buildShiftTitle({
					start,
					end,
					name: Array.isArray(person)
						? formatMultipleNames(person)
						: person
							? formatPersonName(person).full_name
							: "",
				})
			}
		// eslint-disable-next-line no-unused-vars
		} catch(e) {
			// Ensure dates are Date objects even in the error case
			const start = displayStart ? ensureDate(displayStart) : ensureDate(event.start)
			const end = displayEnd ? ensureDate(displayEnd) : ensureDate(event.end)

			return buildShiftTitle({
				start,
				end,
				name: Array.isArray(person)
					? formatMultipleNames(person)
					: person
						? formatPersonName(person).full_name
						: "",
			})
		}
	}, [formatMultipleNames, settings.shift_title_format])
}

export default useShiftTitleFormatter
