import clsx from "clsx"
import dayjs from "dayjs"
import { useMemo, useRef } from "react"
import { useForm } from "use-inertia-form"

import { Badge, Box, Code, Group, Paper } from "@/components"
import { TextInput } from "@/components/Form"
import { formatEventTitle } from "@/lib"
import { GeneralSettingsFormData } from "@/Pages/Settings/General"

import * as classes from "../Settings.css"

const ALLOWED_TEMPLATE_VARS = [
	"first_name",
	"last_name",
	"full_name",
	"first_initial",
	"last_initial",
] as const

const SAMPLE_DATA: Record<typeof ALLOWED_TEMPLATE_VARS[number], string> = {
	first_name: "John",
	last_name: "Smith",
	full_name: "John Smith",
	first_initial: "J",
	last_initial: "S",
} as const

const TIME_FORMAT_EXAMPLES = [
	{ label: "Start Time", format: "{start:h:mma}" },
	{ label: "End Time", format: "{end:h:mma}" },
] as const

interface SettingIndexProps {
	settings: Schema.Setting
}

const ShiftTitleFormatInput = ({ settings }: SettingIndexProps) => {
	const { getData } = useForm<GeneralSettingsFormData>()
	const inputRef = useRef<HTMLInputElement>(null)

	const inputValue = getData("settings.shift_title_format")

	const previewText = useMemo(() => {
		const format = inputRef.current?.value || inputValue
		return formatEventTitle(format, new Date(), dayjs().add(4, "hours").toDate(), SAMPLE_DATA)
	}, [inputValue])

	const insertVariable = (variable: string) => {
		const input = inputRef.current
		if(!input) return

		const value = `{${variable}}`
		const cursorPos = input.selectionStart || input.value.length
		const currentValue = input.value

		input.value = currentValue.slice(0, cursorPos) +
      value +
      currentValue.slice(cursorPos)

		input.focus()
		input.setSelectionRange(cursorPos + value.length, cursorPos + value.length)
	}

	return (
		<>
			<TextInput
				ref={ inputRef }
				id="shift_title_format-search"
				label="Shift Title Format"
				name="shift_title_format"
				placeholder="{start:h:mma - {end:h:mma}: {full_name}"
				disableAutofill
			/>

			<Group mt="sm">
				<Box>Example Result</Box>
				<Code>{ previewText }</Code>
			</Group>

			<Paper mt="sm">
				Use curly brackets <Code>&#123;&#125;</Code> to add dynamic content.
			</Paper>

			<Box mt="sm">
				<Box mb="sm">Employee Information:</Box>
				{ ALLOWED_TEMPLATE_VARS.map((variable) => (
					<Badge
						key={ variable }
						m="sm"
						onClick={ () => insertVariable(variable) }
						className={ clsx(classes.templateBadge) }
					>
						{ `{${variable}}` }
					</Badge>
				)) }

				<Box mt="lg" mb="sm">Time Formats:</Box>
				{ TIME_FORMAT_EXAMPLES.map(({ label, format }) => (
					<Badge
						key={ format }
						m="sm"
						onClick={ () => insertVariable(format.slice(1, - 1)) }
						className={ clsx(classes.templateBadge) }
					>
						{ format }
						<Box component="span" ml="xs" style={ { opacity: 0.7 } }>({ label })</Box>
					</Badge>
				)) }
			</Box>
		</>
	)
}

export default ShiftTitleFormatInput
