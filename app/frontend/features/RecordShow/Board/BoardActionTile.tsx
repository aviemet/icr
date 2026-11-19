import { Link } from "@/components"

import * as board from "../BoardPrimitives.css"

export interface BoardActionTileProps {
	href: string
	title: string
	hint: string
}

export function BoardActionTile({ href, title, hint }: BoardActionTileProps) {
	return (
		<Link href={ href } className={ board.actionTile }>
			<span className={ board.actionTitle }>{ title }</span>
			<span className={ board.actionHint }>{ hint }</span>
		</Link>
	)
}
