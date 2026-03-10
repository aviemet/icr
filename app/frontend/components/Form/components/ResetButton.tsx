import { type ButtonProps } from "@mantine/core"
import { useForm } from "use-inertia-form"

import { Button } from "@/components"

export interface ResetButtonProps extends ButtonProps {
	fields?: string | string[]
}

export function ResetButton({ fields, children, ...props }: ResetButtonProps) {
	const { reset } = useForm()

	const handleReset = () => {
		if(!fields) return

		reset(fields)
	}

	return (
		<Button onClick={ handleReset } { ...props }>{ children || "Reset" }</Button>
	)
}
