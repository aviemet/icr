import { Code, Group, Link, Paper, Section, Stack, Text, Title } from "@/components"
import { Routes } from "@/lib"

interface ShowErrorProps {
	status: string | number
	url?: string
	server_error?: {
		message: string
		backtrace: string[]
		class: string
	}
}

type ErrorPageMessage = {
	title: string
	description: string
}

const errorMessages: Record<string, ErrorPageMessage> = {
	403: {
		title: "Forbidden",
		description: "You do not have permission to access this page.",
	},
	404: {
		title: "Page Not Found",
		description: "The page you are looking for could not be found.",
	},
	500: {
		title: "Something Went Wrong",
		description: "An unexpected error occurred. Please try again in a moment.",
	},
	503: {
		title: "Service Unavailable",
		description: "The application is temporarily unavailable. Please check back soon.",
	},
}

const ShowError = ({ status, url, server_error }: ShowErrorProps) => {
	const isDevelopmentEnvironment = import.meta.env.MODE === "development"
	const statusKey = String(status)
	const errorMessage = errorMessages[statusKey] || {
		title: "Unexpected Error",
		description: "Something went wrong while loading this page.",
	}

	return (
		<Section variant="panel">
			<Stack gap="lg" maw={ 640 } mx="auto" py="xl">
				<Stack gap="xs">
					<Text size="sm" c="dimmed" tt="uppercase" fw={ 600 }>
						Error { statusKey }
					</Text>
					<Title order={ 1 }>{ errorMessage.title }</Title>
					<Text c="dimmed">{ errorMessage.description }</Text>
				</Stack>

				<Group>
					<Link href={ Routes.root() } as="button" buttonProps={ { variant: "filled" } }>
						Back to dashboard
					</Link>
				</Group>

				{ server_error && isDevelopmentEnvironment && (
					<Paper withBorder p="md" radius="md">
						<Stack gap="sm">
							<Text size="sm" fw={ 700 }>Development details</Text>
							{ url && (
								<div>
									<Text size="sm" fw={ 600 }>Request</Text>
									<Code block>{ url }</Code>
								</div>
							) }
							<div>
								<Text size="sm" fw={ 600 }>{ server_error.class }</Text>
								<Code block>{ server_error.message }</Code>
							</div>
							{ server_error.backtrace.length > 0 && (
								<div>
									<Text size="sm" fw={ 600 }>Backtrace</Text>
									<Code block>{ server_error.backtrace.join("\n") }</Code>
								</div>
							) }
						</Stack>
					</Paper>
				) }
			</Stack>
		</Section>
	)
}

export default ShowError
