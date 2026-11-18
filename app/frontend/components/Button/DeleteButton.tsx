import { router } from "@inertiajs/react"
import { useModals } from "@mantine/modals"
import clsx from "clsx"

import { ActionIcon, Text, Tooltip } from "@/components"
import { TrashIcon } from "@/components/Icons"

import * as classes from "./IconActionButton.css"

interface DeleteButtonProps {
	href?: string
	label?: string
	onDelete?: () => void
	disabled?: boolean
	loading?: boolean
}

export function DeleteButton({
	href,
	label,
	onDelete,
	disabled = false,
	loading = false,
}: DeleteButtonProps) {
	const modals = useModals()
	const usedLabel = `Delete${label ? ` ${label}` : ""}`
	const confirmName = label ?? "this record"

	const handleClick = () => {
		modals.openConfirmModal({
			title: usedLabel,
			children: (
				<Text size="sm">
					{ `Delete ${confirmName}? This cannot be undone.` }
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				if(onDelete) {
					onDelete()
					return
				}

				if(href) {
					router.delete(href)
				}
			},
		})
	}

	return (
		<Tooltip
			withArrow
			label={ usedLabel }
			position="left"
			transitionProps={ { transition: "fade" } }
		>
			<ActionIcon
				variant="transparent"
				aria-label={ usedLabel }
				className={ clsx(classes.iconAction, classes.deleteAction) }
				disabled={ disabled }
				loading={ loading }
				onClick={ handleClick }
			>
				<TrashIcon size={ 14 } />
			</ActionIcon>
		</Tooltip>
	)
}
