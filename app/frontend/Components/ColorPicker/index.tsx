import { ColorPicker, ColorSwatch, type ColorPickerProps } from "@mantine/core"
import clsx from "clsx"
import { useState } from "react"

import { Box } from "@/Components"
import { theme, vars } from "@/lib"

import * as classes from "./ColorPicker.css"

export interface ColorPickerComponentProps extends ColorPickerProps {
	initialValue?: string
	value?: string
	onChange?: (value: string) => void
	withPreview?: boolean | undefined
}

export const ColorPickerComponent = ({
	format = "rgb",
	initialValue = theme.primaryColor,
	value: controlledValue,
	onChange: controlledOnChange,
	withPreview,
	...props
}: ColorPickerComponentProps) => {
	const [internalValue, setInternalValue] = useState(initialValue)

	const value = controlledValue ?? internalValue
	const onChange = controlledOnChange ?? setInternalValue

	return (
		<Box className={ clsx(classes.colorPickerContainer) }>
			<ColorPicker
				className={ clsx(classes.colorPicker, {
					withPreview,
				}) }
				format={ format }
				value={ value }
				onChange={ onChange }
				{ ...props }
			/>
			{ withPreview === true && <ColorSwatch className={ classes.colorSwatch } color={ value } size={ vars.spacing.lg } radius="sm" /> }
		</Box>
	)
}
