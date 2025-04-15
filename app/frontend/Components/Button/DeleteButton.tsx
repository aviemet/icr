import { Link } from "@/Components"
import { TrashIcon } from "@/Components/Icons"

import { type LinkProps } from "../Link"

interface DeleteButtonProps extends Omit<LinkProps, "children"> {
	label?: string
}

const DeleteButton = ({ href, label }: DeleteButtonProps) => {
	return (
		<Link as="button" method="delete" href={ href } aria-label={ `Delete ${label}` }>
			<TrashIcon />
		</Link>
	)
}

export default DeleteButton
