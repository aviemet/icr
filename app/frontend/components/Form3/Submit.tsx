import { Button } from "@mantine/core"

import { useSlotProps } from "./formFieldUtils"

export function Submit({ children }: { children: React.ReactNode }) {
	const slotProps = useSlotProps()

	return (
		<Button type="submit" disabled={ slotProps?.processing }>
			{ slotProps?.processing ? "Saving..." : children }
		</Button>
	)
}
