import { Stack, Text, Title } from "@/components"

interface SettingsPageHeaderProps {
	title: string
	description: string
}

export function SettingsPageHeader({ title, description }: SettingsPageHeaderProps) {
	return (
		<Stack gap="xs" mb="xl">
			<Title order={ 2 }>{ title }</Title>
			<Text size="sm" c="dimmed">{ description }</Text>
		</Stack>
	)
}
