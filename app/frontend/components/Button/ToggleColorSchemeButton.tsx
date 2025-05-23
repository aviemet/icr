import { ActionIcon, ActionIconProps, useMantineColorScheme } from "@mantine/core"

import { SunIcon, MoonStarsIcon } from "@/components/Icons"

interface ToggleColorSchemeButtonProps
	extends
	ActionIconProps {
	leftSection?: React.ReactNode
	rightSection?: React.ReactNode
}

const ToggleColorSchemeButton = ({ leftSection, rightSection, ...props }: ToggleColorSchemeButtonProps) => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()

	const iconProps = { size: 18 }

	return (
		<ActionIcon
			color={ colorScheme === "dark" ? "light" : "dark" }
			onClick={ () => toggleColorScheme() }
			title="Toggle color scheme"
			style={ { display: "inline-flex" } }
			aria-label={ `Toggle ${colorScheme === "dark" ? "light" : "dark"} mode` }
			size="sm"
			{ ...props }
		>
			{ leftSection && leftSection }
			{ colorScheme === "dark" ? <SunIcon { ...iconProps } /> : <MoonStarsIcon { ...iconProps } /> }
			{ rightSection && rightSection }
		</ActionIcon>
	)
}

export default ToggleColorSchemeButton
