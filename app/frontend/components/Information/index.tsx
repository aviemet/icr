import { FloatingPosition } from "@mantine/core"

import { ThemeIcon, Tooltip } from "@/components"

interface InformationProps {
	children: React.ReactNode
	position?: FloatingPosition
}

const Information = ({ children, position = "right" }: InformationProps) => (
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

export default Information
