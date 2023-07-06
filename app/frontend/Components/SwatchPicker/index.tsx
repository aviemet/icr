import React, { useCallback } from 'react'
import { Group, useMantineTheme, ColorSwatch, CheckIcon, rem } from '@mantine/core'

export interface ISwatchPickerProps {
	value: string
	onChange(value: string): void
}

const SwatchPicker = ({ value, onChange }: ISwatchPickerProps) => {
	const theme = useMantineTheme()

	const colors = useCallback(() => {
		return Object.keys(theme.colors).filter(color => {
			return !['dark','gray'].includes(color)
		}).map((color) => (
			<ColorSwatch
				color={ theme.colorScheme === 'dark' ? theme.colors[color][7] : theme.colors[color][5] }
				component="button"
				type="button"
				key={ color }
				onClick={ () => onChange(color) }
				radius="sm"
				sx={ {
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: theme.colorScheme === 'dark' ? theme.colors[color][2] : theme.white,

				} }
			>
				{ value === color && <CheckIcon width={ rem(12) } height={ rem(12) } /> }
			</ColorSwatch>
		))
	}, [value, theme.colorScheme])

	return (
		<Group spacing={ 2 } mt={ 5 }>{
			colors()
		}</Group>
	)
}

SwatchPicker.initialValue = 'violet'

export default SwatchPicker
