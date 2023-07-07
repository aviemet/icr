import React, { useEffect, useState } from 'react'
import { Popover, ColorPicker, Button, useMantineTheme, ColorSwatch, Text, Box } from '@mantine/core'
import { useBooleanToggle } from '@/lib/hooks'
import { useClickOutside, useDisclosure } from '@mantine/hooks'

interface ColorPickerProps {
	defaultColor?: string
	onChange?: (color: string) => void
	onSave?: (color: string) => void
}

const ColorPickerComponent = ({ defaultColor, onChange, onSave }: ColorPickerProps) => {
	const theme = useMantineTheme()

	const [color, setColor] = useState(defaultColor || theme.fn.primaryColor())

	const [opened, toggleOpened] = useBooleanToggle(false)

	const handleClickAway = () => {
		setColor(defaultColor || theme.fn.primaryColor())
		toggleOpened(false)
	}

	const ref = useClickOutside(handleClickAway)

	useEffect(() => {
		if(onChange) onChange(color)
	}, [])

	const handleSetColor = () => {
		if(onSave) onSave(color)
		toggleOpened(false)
	}

	return (
		<Popover
			withinPortal
			opened={ opened }
			trapFocus
			position="right"
			withArrow
			shadow="md"
		>
			<Popover.Target>
				<ColorSwatch
					component={ Button }
					color={ color }
					onClick={ toggleOpened }
				/>
			</Popover.Target>
			<Popover.Dropdown p={ 0 }>
				<Box ref={ ref } p="sm">
					<ColorPicker value={ color } onChange={ setColor } />
					<Button onClick={ handleSetColor } mt="md" sx={ { width: '100%' } }>Set Color</Button>
				</Box>
			</Popover.Dropdown>
		</Popover>
	)
}

export default ColorPickerComponent
