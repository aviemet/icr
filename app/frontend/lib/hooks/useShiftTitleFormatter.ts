import { useCallback } from "react"

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

	return useCallback((
		event: Pick<Schema.CalendarEventsShow, "starts_at" | "ends_at" | "name">,
		person?: Person,
		displayStart?: Date,
		displayEnd?: Date
	) => {
		try {
			const templateVars = {
				first_name: person?.first_name || "",
				last_name: person?.last_name || "",
				full_name: person?.first_name && person?.last_name
					? `${person.first_name} ${person.last_name}`
					: person?.first_name || person?.last_name || "",
				first_initial: person?.first_name ? initials(person.first_name) : "",
				last_initial: person?.last_name ? initials(person.last_name) : "",
			}

			// Ensure dates are Date objects
			const start = displayStart ? ensureDate(displayStart) : ensureDate(event.starts_at)
			const end = displayEnd ? ensureDate(displayEnd) : ensureDate(event.ends_at)

			return formatEventTitle(
				settings.shift_title_format,
				start,
				end,
				templateVars
			)
		// eslint-disable-next-line no-unused-vars
		} catch(e) {
			// Ensure dates are Date objects even in the error case
			const start = displayStart ? ensureDate(displayStart) : ensureDate(event.starts_at)
			const end = displayEnd ? ensureDate(displayEnd) : ensureDate(event.ends_at)

			return options.fallbackToEventName && event.name
				? event.name
				: buildShiftTitle({
					start,
					end,
					name: person?.first_name && person?.last_name
						? `${person.first_name} ${person.last_name}`
						: person?.first_name || person?.last_name || "",
				})
		}
	}, [settings.shift_title_format, options.fallbackToEventName])
}

export default useShiftTitleFormatter
