interface LoggerProps {
	children: any
}

const Logger = ({ children }: LoggerProps) => {
	/* eslint-disable no-console */
	if(import.meta.env.MODE === "development") {
		console.log(children)
	}

	return <></>
}

export default Logger
