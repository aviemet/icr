import React from 'react'
import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { SunIcon, MoonIcon } from '@/Components/Icons'

const ToggleColorSchemeButton = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()

	return (
		<ActionIcon
			color={ colorScheme === 'dark' ? 'yellow' : 'blue' }
			onClick={ () => toggleColorScheme() }
			title="Toggle color scheme"
			sx={ { display: 'inline-flex' } }
			aria-label={ `Enable ${colorScheme === 'dark' ? 'light' : 'dark'} mode` }
		>
			{ colorScheme === 'dark' ? <SunIcon size={ 18 } /> : <MoonIcon size={ 18 } /> }
		</ActionIcon>
	)
}

export default ToggleColorSchemeButton
