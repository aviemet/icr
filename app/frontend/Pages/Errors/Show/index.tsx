import { usePage } from "@inertiajs/react"

import { Code, Section, Text, Title } from "@/Components"

interface ShowErrorProps {
	status: string | number
	server_error: {
		message: string
		backtrace: string[]
		class: string
	}
}

const ShowError = ({ status, server_error }: ShowErrorProps) => {
	console.log({ status, server_error })
	const title = {
		503: "Service Unavailable",
		500: "Server Error",
		404: "Page Not Found",
		403: "Forbidden",
	}[status] || "Unexpected error"

	const description = {
		503: "Sorry, we are doing some maintenance. Please check back soon.",
		500: "Whoops, something went wrong on our servers.",
		404: "Sorry, the page you are looking for could not be found.",
		403: "Sorry, you are forbidden from accessing this page.",
	}[status]

	return (
		<Section>
			<Title>{ title }</Title>
			<Text>{ description }</Text>
			{ server_error && <>
				<Code my="xs">{ server_error.message }</Code>
				<Code my="xs" block>{ server_error.backtrace.join("\n") }</Code>
			</> }
		</Section>
	)
}

export default ShowError
