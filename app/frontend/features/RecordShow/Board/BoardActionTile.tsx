import { Link } from "@/components"

import * as board from "../BoardPrimitives.css"

export interface BoardActionTileProps {
	href: string
	title: string
	hint: string
	external?: boolean
	icon?: React.ReactNode
}

export function BoardActionTile({ href, title, hint, external, icon }: BoardActionTileProps) {
	const content = (
		<>
			<span className={ board.actionTitle }>
				{ icon && <span className={ board.actionIcon }>{ icon }</span> }
				{ title }
			</span>
			<span className={ board.actionHint }>{ hint }</span>
		</>
	)

	if(external) {
		return (
			<a href={ href } className={ board.actionTile }>
				{ content }
			</a>
		)
	}

	return (
		<Link href={ href } className={ board.actionTile }>
			{ content }
		</Link>
	)
}
