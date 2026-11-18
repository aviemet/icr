import { Group, Stack, Text, Title } from "@/components"

interface SettingsPageHeaderProps {
	title: string
	description: string
	actions?: React.ReactNode
}

export function SettingsPageHeader({ title, description, actions }: SettingsPageHeaderProps) {
	return (
		<Group justify="space-between" align="flex-start" mb="xl" wrap="nowrap" gap="md">
			<Stack gap="xs">
				<Title order={ 2 }>{ title }</Title>
				<Text size="sm" c="dimmed">{ description }</Text>
			</Stack>
			{ actions }
		</Group>
	)
}
