import { Text } from "@mantine/core"

interface BackgroundPopoverContentProps {
	date: Date
	time?: Date
	resourceId?: string | number
}

export function BackgroundPopoverContent({ date }: BackgroundPopoverContentProps) {
	return (
		<Text size="sm">
			Selected: { date.toLocaleDateString() }
		</Text>
	)
}
