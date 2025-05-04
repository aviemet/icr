import { type ButtonProps } from "@mantine/core"
import { useForm } from "use-inertia-form"

import { Button } from "@/components"

interface ResetButton extends ButtonProps {
	fields?: string | string[]
}

const ResetButton = ({ fields, children, ...props }: ResetButton) => {
	const { reset } = useForm()

	const handleReset = () => {
		if(!fields) return

		reset(fields)
	}

	return (
		<Button onClick={ handleReset } { ...props }>{ children || "Reset" }</Button>
	)
}

export default ResetButton
