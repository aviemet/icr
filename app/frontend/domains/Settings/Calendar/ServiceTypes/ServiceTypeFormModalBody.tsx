import { useModalContext } from "@/components/Modal"

import { ServiceTypeForm } from "./ServiceTypeForm"

interface ServiceTypeFormModalBodyProps {
	serviceType?: Schema.ServiceType
}

export function ServiceTypeFormModalBody({ serviceType }: ServiceTypeFormModalBodyProps) {
	const { close, opened } = useModalContext()

	if(!opened) return null

	return (
		<ServiceTypeForm
			key={ serviceType?.id ?? "create" }
			serviceType={ serviceType }
			onCancel={ close }
		/>
	)
}
