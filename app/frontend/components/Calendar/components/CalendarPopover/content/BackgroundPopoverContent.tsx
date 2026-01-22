import { Text } from "@mantine/core"

interface BackgroundPopoverContentProps {
	date: Date
	time?: Date
	resourceId?: string | number
}

const BackgroundPopoverContent = ({ date }: BackgroundPopoverContentProps) => {
	return (
		<Text size="sm">
			Selected: { date.toLocaleDateString() }
		</Text>
	)
}

export { BackgroundPopoverContent }
