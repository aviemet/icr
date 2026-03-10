interface LoggerProps {
	children: any
}

export function Logger({ children }: LoggerProps) {
	if(import.meta.env.MODE === "development") {
		// eslint-disable-next-line no-console
		console.log(children)
	}

	return <></>
}
