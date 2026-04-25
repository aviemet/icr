import { Code, Section, Text, Title } from "@/components"

interface ShowErrorProps {
	status: string | number
	url: string
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
	403:{
		title: "Forbidden",
		description: "Sorry, you don't have permission to access this page.",
	},
	404:{
		title: "Page Not Found",
		description: "Sorry, the page you are looking for could not be found.",
	},
	500:{
		title: "Server Error",
		description: "Whoops, something went wrong on our servers.",
	},
	503: {
		title: "Service Unavailable",
		description: "Sorry, we are doing some maintenance. Please check back soon.",
	},
}

const ShowError = ({ status, url, server_error }: ShowErrorProps) => {
	const isDevelopmentEnvironment = import.meta.env.MODE === "development"

	const errorMessage = errorMessages[status] || {
		title: "Unexpected error",
		description: "",
	}

	return (
		<Section>
			<Title>{ errorMessage.title }</Title>
			<Text>{ errorMessage.description }</Text>
			{ server_error && isDevelopmentEnvironment && (
				<>
					<Code my="xs">{ url }</Code>
					<Code my="xs">{ server_error.message }</Code>
					<Code my="xs" block>{ server_error.backtrace.join("\n") }</Code>
				</>
			) }
		</Section>
	)
}

export default ShowError
