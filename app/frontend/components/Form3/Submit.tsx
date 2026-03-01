import { Button } from "@mantine/core"

import { useFormFieldContext } from "./FormFieldContext"

export function Submit({ children }: { children: React.ReactNode }) {
	const { slotProps } = useFormFieldContext()

	return (
		<Button type="submit" disabled={ slotProps?.processing }>
			{ slotProps?.processing ? "Saving..." : children }
		</Button>
	)
}
