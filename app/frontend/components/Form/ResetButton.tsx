import { type ButtonProps } from "@mantine/core"

import { Button } from "@/components"

import { useSlotProps } from "./formFieldUtils"

export interface ResetButtonProps extends ButtonProps {
	children?: React.ReactNode
	fields?: string | string[]
}

export function ResetButton({ fields, children, ...props }: ResetButtonProps) {
	const slotProps = useSlotProps()

	const handleReset = () => {
		if(fields === undefined) {
			slotProps?.reset()
		} else if(Array.isArray(fields)) {
			fields.forEach((field) => slotProps?.reset(field))
		} else {
			slotProps?.reset(fields)
		}
	}

	return (
		<Button type="button" onClick={ handleReset } { ...props }>
			{ children ?? "Reset" }
		</Button>
	)
}
