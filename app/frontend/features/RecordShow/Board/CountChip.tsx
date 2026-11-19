import clsx from "clsx"

import * as board from "../BoardPrimitives.css"

export interface CountChipProps {
	value: number
	alert?: boolean
}

export function CountChip({ value, alert = false }: CountChipProps) {
	return (
		<span className={ clsx(board.chip, { [board.chipAlert]: alert }) }>
			{ value }
		</span>
	)
}
