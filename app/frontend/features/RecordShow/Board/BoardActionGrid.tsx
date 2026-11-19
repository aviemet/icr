import * as board from "../BoardPrimitives.css"

export interface BoardActionGridProps {
	children: React.ReactNode
}

export function BoardActionGrid({ children }: BoardActionGridProps) {
	return (
		<div className={ board.actionGrid }>
			{ children }
		</div>
	)
}
