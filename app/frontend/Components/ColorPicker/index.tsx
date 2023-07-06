import React, { useEffect, useState } from 'react'
import { Popover, ColorPicker, Button, useMantineTheme, ColorSwatch } from '@mantine/core'
import { useBooleanToggle } from '@/lib/hooks'

interface ColorPickerProps {
	defaultColor?: string
	onChange?: (color: string) => void
	onSave?: (color: string) => void
}

const ColorPickerComponent = ({ defaultColor, onChange, onSave }: ColorPickerProps) => {
	const theme = useMantineTheme()
	const [opened, toggleOpen] = useBooleanToggle(false)
	const [color, setColor] = useState(defaultColor || theme.fn.primaryColor())

	useEffect(() => {
		if(onChange) onChange(color)
	}, [])

	const handleClickAway = () => {
		setColor(defaultColor || theme.fn.primaryColor())
		toggleOpen(false)
	}

	const handleSetColor = () => {
		if(onSave) onSave(color)
		toggleOpen(false)
	}

	return (
		<Popover opened={ opened }>
			<Popover.Target>
				<div onBlurCapture={ handleClickAway }>
					<ColorSwatch
						component={ Button }
						color={ color }
						onClick={ () => toggleOpen() }
					/>
				</div>
			</Popover.Target>
			<Popover.Dropdown>
				<ColorPicker value={ color } onChange={ setColor } />
				<Button onClick={ handleSetColor }>Set Color</Button>
			</Popover.Dropdown>
		</Popover>
	)
}

export default ColorPickerComponent
