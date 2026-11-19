import { Button, Modal } from "@/components"

export interface CollectionAddModalProps {
	canUpdate: boolean
	label: string
	title?: string
	children: React.ReactNode
}

export function CollectionAddModal({
	canUpdate,
	label,
	title,
	children,
}: CollectionAddModalProps) {
	if(!canUpdate) return null

	return (
		<Modal
			title={ title ?? label }
			trigger={ (
				<Button size="xs" variant="light">
					{ label }
				</Button>
			) }
		>
			{ children }
		</Modal>
	)
}
