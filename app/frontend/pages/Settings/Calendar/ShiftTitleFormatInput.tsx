import clsx from "clsx"
import dayjs from "dayjs"
import { useMemo, useRef } from "react"

import { Badge, Box, Code, Group, Paper } from "@/components"
import { useFormField } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { formatEventTitle } from "@/lib"

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
	const [inputValue, setInputValue] = useFormField("settings.shift_title_format")
	const inputRef = useRef<HTMLInputElement>(null)

	const previewText = useMemo(
		() => formatEventTitle(String(inputValue ?? ""), new Date(), dayjs().add(4, "hours").toDate(), SAMPLE_DATA),
		[inputValue],
	)

	const insertVariable = (variable: string) => {
		const input = inputRef.current
		const value = `{${variable}}`
		const current = String(inputValue ?? "")
		const cursorPos = input ? (input.selectionStart ?? current.length) : current.length
		const next = current.slice(0, cursorPos) + value + current.slice(cursorPos)
		setInputValue(next)
		setTimeout(() => {
			input?.focus()
			input?.setSelectionRange(cursorPos + value.length, cursorPos + value.length)
		}, 0)
	}

	return (
		<>
			<TextInput
				ref={ inputRef }
				id="shift_title_format-search"
				label="Shift Title Format"
				name="settings.shift_title_format"
				value={ String(inputValue ?? "") }
				onChange={ (e) => setInputValue(e.target.value) }
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
