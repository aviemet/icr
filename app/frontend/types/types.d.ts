import { type SelectProps, type InputProps } from "@mantine/core"
import React from "react"

import { type ISelectProps } from "@/components/Inputs/Select"

declare global {
	type HTTPVerb = "post" | "put" | "get" | "patch" | "delete"

	type InputElementType = "button" | "checkbox" | "color" | "currency" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "select" | "submit" | "tel" | "text" | "textarea" | "time" | "url"

	type FlashMessage = Record<"success" | "alert" | "info" | "warning", {
		id: string
		message: string
	}>

	declare namespace Schema {

		interface Pagination {
			count: number
			pages: number
			limit: number
			current_page: number
			next_page: number
			prev_page: number
			is_first_page: boolean
			is_last_page: boolean
		}

		type CurrencyOption = {
			symbol: string
			code: string
		}

		type TimezoneOption = {
			group: string
			items: {
				value: string
				label: string
			}[]
		}

		type PayPeriodOption = {
			value: string
			label: string
		}[]

		type LanguageOption = {
			value: string
			label: string
		}[]
	}
}
