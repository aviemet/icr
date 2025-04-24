import dayjs from "dayjs"
import { useCallback } from "react"

import { BaseCalendarEvent } from "@/components/Calendar"
import { buildShiftTitle, formatEventTitle } from "@/lib"
import { usePageProps } from "@/lib/hooks"
import { initials } from "@/lib/strings"

import { ensureDate } from "../dates"

interface UseEventTitleFormatterOptions {
	fallbackToEventName?: boolean
}

interface Person {
	first_name?: string
	last_name?: string
}

export const useEventTitleFormatter = (options: UseEventTitleFormatterOptions = {}) => {
	const { settings } = usePageProps()

	/**
	 * Builds object with name segments from Person object
	 */
	const formatPersonName = (person: Person) => ({
		first_name: person.first_name || "",
		last_name: person.last_name || "",
		full_name: person.first_name && person.last_name
			? `${person.first_name} ${person.last_name}`
			: person.first_name || person.last_name || "",
		first_initial: person.first_name ? (initials(person.first_name) || "") : "",
		last_initial: person.last_name ? (initials(person.last_name) || "") : "",
	})

	/**
	 * Uses formatting rules to build a single string of multiple people's names
	 */
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

	/**
	 * Return callback used to format event based on event type
	 */
	return useCallback((
		event: Partial<Pick<BaseCalendarEvent, "start" | "end" | "allDay" | "title">>,
		person?: Person | Person[],
		displayStart?: Date,
		displayEnd?: Date
	) => {
		const start = ensureDate(displayStart ?? event.start)
		const end = ensureDate(displayEnd ?? event.end)
		const allDay = event?.allDay === true ? true : false

		if(allDay) {
			return `${event.title}`
		}

		const templateVars = {
			first_name: "",
			last_name: "",
			full_name: "",
			first_initial: "",
			last_initial: "",
		}
		if(Array.isArray(person)) {
			Object.assign(templateVars, {
				first_name: person.map(p => p.first_name || "").join(", "),
				last_name: person.map(p => p.last_name || "").join(", "),
				full_name: formatMultipleNames(person),
				first_initial: person.map(p => p.first_name ? (initials(p.first_name) || "") : "").join(", "),
				last_initial: person.map(p => p.last_name ? (initials(p.last_name) || "") : "").join(", "),
			})
		} else if(person) {
			Object.assign(templateVars, formatPersonName(person))
		}

		const template = settings.shift_title_format

		const hasMissingVars = Object.entries(templateVars).some(([key, value]) => {
			return template.includes(`{${key}}`) && (value === undefined)
		})

		const dateFormatRegex = /{(start|end):([YMDHhmsAa\-/ :]+)}/g
		let hasInvalidDateFormat = false
		if(template.match(dateFormatRegex)) {
			template.replace(dateFormatRegex, (match, timeType, format) => {
				const time = timeType === "start" ? start : end
				const formatted = dayjs(time).format(format)
				if(!formatted || formatted === format) {
					hasInvalidDateFormat = true
				}
				return match
			})
		}

		if(!hasMissingVars && !hasInvalidDateFormat) {
			return formatEventTitle(template, start, end, templateVars)
		}

		return buildShiftTitle({
			start,
			end,
			name: Array.isArray(person)
				? formatMultipleNames(person)
				: person
					? formatPersonName(person).full_name
					: "",
		})
	}, [formatMultipleNames, settings.shift_title_format])
}

export default useEventTitleFormatter
