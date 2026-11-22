import { Checkbox, Text } from "@mantine/core"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { Grid, Group, Stack } from "@/components"
import { DateInput, NumberInput, Select, Switch } from "@/components/Inputs"

import {
	type RecurrenceConfig,
	type RecurrenceEnds,
	type RecurrenceFrequency,
	WEEKDAY_VALUES,
} from "./recurrenceConfig"

function isRecurrenceFrequency(value: string | null): value is RecurrenceFrequency {
	return value === "daily" || value === "weekly" || value === "monthly" || value === "yearly"
}

function isRecurrenceEnds(value: string | null): value is RecurrenceEnds {
	return value === "never" || value === "on_date" || value === "after"
}

type RepeatFieldsProps = {
	value: RecurrenceConfig
	onChange: (next: RecurrenceConfig) => void
	minDate?: Date
}

export function RepeatFields({
	value,
	onChange,
	minDate,
}: RepeatFieldsProps) {
	const { t } = useTranslation()

	const frequencyOptions = [
		{ value: "daily", label: t("views.clients.schedule.event_form.frequency_daily") },
		{ value: "weekly", label: t("views.clients.schedule.event_form.frequency_weekly") },
		{ value: "monthly", label: t("views.clients.schedule.event_form.frequency_monthly") },
		{ value: "yearly", label: t("views.clients.schedule.event_form.frequency_yearly") },
	]

	const endsOptions = [
		{ value: "never", label: t("views.clients.schedule.event_form.ends_never") },
		{ value: "on_date", label: t("views.clients.schedule.event_form.ends_on_date") },
		{ value: "after", label: t("views.clients.schedule.event_form.ends_after") },
	]

	const monthlyModeOptions = [
		{ value: "day_of_month", label: t("views.clients.schedule.event_form.monthly_on_day") },
		{ value: "nth_weekday", label: t("views.clients.schedule.event_form.monthly_on_weekday") },
	]

	const weekdayLabels = [
		t("views.clients.schedule.event_form.weekday_sun"),
		t("views.clients.schedule.event_form.weekday_mon"),
		t("views.clients.schedule.event_form.weekday_tue"),
		t("views.clients.schedule.event_form.weekday_wed"),
		t("views.clients.schedule.event_form.weekday_thu"),
		t("views.clients.schedule.event_form.weekday_fri"),
		t("views.clients.schedule.event_form.weekday_sat"),
	]

	const intervalUnit = t(`views.clients.schedule.event_form.interval_${value.frequency}`)

	return (
		<>
			<Grid.Col>
				<Switch
					label={ t("views.clients.schedule.event_form.repeats") }
					checked={ value.enabled }
					onChange={ (event) => {
						onChange({ ...value, enabled: event.currentTarget.checked })
					} }
				/>
			</Grid.Col>

			{ value.enabled && (
				<>
					<Grid.Col span={ { base: 12, sm: 6 } }>
						<Select
							id="repeat_frequency"
							label={ t("views.clients.schedule.event_form.frequency") }
							options={ frequencyOptions }
							value={ value.frequency }
							comboboxProps={ { withinPortal: false } }
							onChange={ (next) => {
								if(!isRecurrenceFrequency(next)) return
								onChange({ ...value, frequency: next })
							} }
						/>
					</Grid.Col>

					<Grid.Col span={ { base: 12, sm: 6 } }>
						<NumberInput
							id="repeat_interval"
							label={ t("views.clients.schedule.event_form.interval", { unit: intervalUnit }) }
							value={ value.interval }
							min={ 1 }
							max={ 99 }
							onChange={ (next) => {
								const interval = typeof next === "number" ? next : Number(next)
								onChange({
									...value,
									interval: Number.isFinite(interval) && interval >= 1 ? interval : 1,
								})
							} }
						/>
					</Grid.Col>

					{ value.frequency === "weekly" && (
						<Grid.Col>
							<Checkbox.Group
								label={ t("views.clients.schedule.event_form.weekdays") }
								value={ value.weekdays.map(String) }
								onChange={ (selected) => {
									const weekdays: number[] = []
									for(const entry of selected) {
										const day = Number(entry)
										if(Number.isInteger(day) && day >= 0 && day <= 6) {
											weekdays.push(day)
										}
									}
									onChange({ ...value, weekdays })
								} }
							>
								<Group gap="sm" mt="xs">
									{ WEEKDAY_VALUES.map((day) => (
										<Checkbox
											key={ day }
											value={ String(day) }
											label={ weekdayLabels[day] }
										/>
									)) }
								</Group>
							</Checkbox.Group>
						</Grid.Col>
					) }

					{ value.frequency === "monthly" && (
						<Grid.Col>
							<Select
								id="repeat_monthly_mode"
								label={ t("views.clients.schedule.event_form.monthly_mode") }
								options={ monthlyModeOptions }
								value={ value.monthlyMode }
								comboboxProps={ { withinPortal: false } }
								onChange={ (next) => {
									if(next === "day_of_month" || next === "nth_weekday") {
										onChange({ ...value, monthlyMode: next })
									}
								} }
							/>
						</Grid.Col>
					) }

					<Grid.Col>
						<Select
							id="repeat_ends"
							label={ t("views.clients.schedule.event_form.ends") }
							options={ endsOptions }
							value={ value.ends }
							comboboxProps={ { withinPortal: false } }
							onChange={ (next) => {
								if(!isRecurrenceEnds(next)) return
								onChange({ ...value, ends: next })
							} }
						/>
					</Grid.Col>

					{ value.ends === "on_date" && (
						<Grid.Col>
							<DateInput
								id="repeat_until"
								label={ t("views.clients.schedule.event_form.until") }
								value={ value.until ?? undefined }
								minDate={ minDate }
								popoverProps={ { withinPortal: false } }
								onChange={ (dateValue) => {
									if(dateValue === null || dateValue === undefined || Array.isArray(dateValue)) {
										onChange({ ...value, until: null })
										return
									}
									const parsed = dayjs(dateValue)
									onChange({
										...value,
										until: parsed.isValid() ? parsed.format("YYYY-MM-DD") : null,
									})
								} }
							/>
						</Grid.Col>
					) }

					{ value.ends === "after" && (
						<Grid.Col>
							<Stack gap={ 4 }>
								<NumberInput
									id="repeat_occurrences"
									label={ t("views.clients.schedule.event_form.occurrences") }
									value={ value.count }
									min={ 1 }
									max={ 999 }
									onChange={ (next) => {
										const count = typeof next === "number" ? next : Number(next)
										onChange({
											...value,
											count: Number.isFinite(count) && count >= 1 ? count : 1,
										})
									} }
								/>
								<Text size="xs" c="dimmed">
									{ t("views.clients.schedule.event_form.occurrences_hint") }
								</Text>
							</Stack>
						</Grid.Col>
					) }
				</>
			) }
		</>
	)
}
