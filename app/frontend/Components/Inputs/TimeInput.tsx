import { forwardRef, useRef } from "react"
import { ActionIcon } from "@mantine/core"
import { TimeInput as MantineTimeInput, type TimeInputProps as MantineTimeInputProps } from "@mantine/dates"
import { ClockIcon } from "@/Components/Icons"
import InputWrapper from "./InputWrapper"
import Label from "./Label"
import { type BaseInputProps } from "."
import { mergeRefs } from "@/lib/mergeRefs"

export interface TimeInputProps
	extends
	BaseInputProps,
	MantineTimeInputProps {
	name?: string
	id?: string
	picker?: boolean
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((
	{
		label,
		id,
		name,
		wrapper,
		wrapperProps,
		required = false,
		value,
		picker = false,
		...props
	},
	ref
) => {
	const localInputRef = useRef<HTMLInputElement>(null)
	const combinedRef = mergeRefs([ref, localInputRef])

	const inputId = id || name

	const pickerControl = (
		<ActionIcon variant="subtle" color="gray" onClick={ () => localInputRef.current?.showPicker() }>
			<ClockIcon />
		</ActionIcon>
	)

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<MantineTimeInput
				ref={ combinedRef }
				id={ inputId }
				name={ name }
				value={ value }
				leftSection={ picker ? pickerControl : undefined }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default TimeInput
