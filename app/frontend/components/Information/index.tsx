import { FloatingPosition } from "@mantine/core"

import { ThemeIcon, Tooltip } from "@/components"

interface InformationProps {
	children: React.ReactNode
	position?: FloatingPosition
}

export function Information({ children, position = "right" }: InformationProps) {
	return (
		<Tooltip label={ children } withArrow position={ position } openDelay={ 300 }>
			<ThemeIcon
				color="gray"
				size="sm"
				radius="xl"
				style={ { cursor: "help" } }
			>
				i
			</ThemeIcon>
		</Tooltip>
	)
}
