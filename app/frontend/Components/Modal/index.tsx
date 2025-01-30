import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { createContext } from "@/lib/hooks"

export type TriggerComponent =  React.ReactElement<{ onClick: () => void }>

type ModalDisclosureVariables = {
	opened: boolean
	open: () => void
	close: () => void
	toggle: () => void
}

const [useModalContext, ModalContextProvider] = createContext<ModalDisclosureVariables>()
export { useModalContext }

interface ModalProps {
	trigger: TriggerComponent
	title: React.ReactNode
	children: React.ReactNode
}

const ReusableModal = ({ children, trigger, title, ...props }: ModalProps) => {
	const [opened, { open, close, toggle }] = useDisclosure(false)

	return (
		<ModalContextProvider value={ { opened, open, close, toggle } }>
			{ React.cloneElement(trigger, { onClick: open }) }

			<Modal
				opened={ opened }
				onClose={ close }
				title={ title }
				{ ...props }
			>
				{ children }
			</Modal>
		</ModalContextProvider>
	)
}

export default ReusableModal
