import { router } from "@inertiajs/react"
import { type FormEvent, useState } from "react"

import { Button, Stack, Text } from "@/components"
import { NumberInput, Switch } from "@/components/Inputs"
import { Routes } from "@/lib"

export interface ReportFilterSchema {
	[key: string]: {
		label: string
		type?: string
		default?: unknown
	}
}

export interface ReportDefinitionShow {
	id: string
	name: string
	format: string
	mode: string
	columns: string[]
	default_filters: Record<string, unknown>
	filter_schema: ReportFilterSchema
}

interface RunReportFormProps {
	reportDefinition: ReportDefinitionShow
}

export function RunReportForm({ reportDefinition }: RunReportFormProps) {
	const defaults = reportDefinition.default_filters
	const [withinDays, setWithinDays] = useState(Number(defaults.within_days ?? 30))
	const [includeExpired, setIncludeExpired] = useState(Boolean(defaults.include_expired ?? true))

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		router.post(Routes.reportRequests(), {
			report_definition_id: reportDefinition.id,
			report_request: {
				within_days: withinDays,
				include_expired: includeExpired,
			},
		})
	}

	return (
		<form onSubmit={ handleSubmit }>
			<Stack gap="md">
				<Text size="sm" c="dimmed">
					{ reportDefinition.format.toUpperCase() }
					{ " · " }
					{ reportDefinition.mode }
					{ " · " }
					{ reportDefinition.columns.length }
					{ " columns" }
				</Text>

				{ reportDefinition.filter_schema.within_days && (
					<NumberInput
						label={ reportDefinition.filter_schema.within_days.label }
						value={ withinDays }
						onChange={ value => setWithinDays(Number(value) || 30) }
						min={ 1 }
					/>
				) }

				{ reportDefinition.filter_schema.include_expired && (
					<Switch
						label={ reportDefinition.filter_schema.include_expired.label }
						checked={ includeExpired }
						onChange={ event => setIncludeExpired(event.currentTarget.checked) }
					/>
				) }

				<Button type="submit">{ "Run report" }</Button>
			</Stack>
		</form>
	)
}
