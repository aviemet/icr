import { useMemo, useRef } from 'react'
import { Badge, Box, Code, Group, Paper } from '@/Components'
import { TextInput } from '@/Components/Form'
import { useForm } from 'use-inertia-form'
import dayjs from 'dayjs'
import { type SettingsFormData } from '.'

import cx from 'clsx'
import * as classes from './Settings.css'

const ALLOWED_TEMPLATE_VARS = ["first_name", "last_name", "full_name"] as const

const SAMPLE_DATA: Record<typeof ALLOWED_TEMPLATE_VARS[number], string> = {
	first_name: "John",
	last_name: "Smith",
	full_name: "John Smith",
} as const

interface SettingIndexProps {
	settings: Schema.Setting
}

const ShiftTitleFormatInput = ({ settings }: SettingIndexProps) => {
	const { getData } = useForm<SettingsFormData>()
	const inputRef = useRef<HTMLInputElement>(null)

	const inputValue = getData('setting.shift_title_format')

	const previewText = useMemo(() => {
		const format = inputRef.current?.value || inputValue

		try {
			// Replace template variables
			let result = format
			ALLOWED_TEMPLATE_VARS.forEach(variable => {
				result = result.replace(
					new RegExp(`{${variable}}`, 'g'),
					SAMPLE_DATA[variable]
				)
			})

			// Replace date formats
			result = result.replace(
				/{([YMDHhmsAa\-/ :]+)}/g,
				(match, format) => dayjs().format(format)
			)

			return result
		} catch(error) {
			return 'Invalid format'
		}
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
				placeholder="{h:mmA} - {full_name}"
				disableAutofill
			/>
			<Group mt="sm">
				<Box>Example Result</Box>
				<Code>{ previewText }</Code>
			</Group>
			<Paper mt="sm">
				Use curly brackets <Code>&#123;&#125;</Code> to add dynamic content. Allowed values are:
			</Paper>
			<Box mt="sm">
				{ ALLOWED_TEMPLATE_VARS.map((variable) => (
					<Badge
						key={ variable }
						m="sm"
						onClick={ () => insertVariable(variable) }
						className={ cx(classes.templateBadge) }
					>
						{ `{${variable}}` }
					</Badge>
				)) }
			</Box>
		</>
	)
}

export default ShiftTitleFormatInput
