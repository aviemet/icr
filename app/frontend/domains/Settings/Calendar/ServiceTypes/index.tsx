import { useTranslation } from "react-i18next"

import { Button, Modal } from "@/components"
import { PlusIcon } from "@/components/Icons"
import { FormBand } from "@/features"

import { ServiceTypeFormModalBody } from "./ServiceTypeFormModalBody"
import { ServiceTypesTable } from "./ServiceTypesTable"

interface ServiceTypesProps {
	service_types: Schema.ServiceType[]
}

export function ServiceTypes({ service_types }: ServiceTypesProps) {
	const { t } = useTranslation()

	return (
		<FormBand
			title={ t("views.settings.calendar.service_types_existing_title") }
			description={ t("views.settings.calendar.service_types_existing_description") }
			actions={ (
				<Modal
					title={ t("views.settings.calendar.service_types_form_title_create") }
					trigger={ (
						<Button size="xs" variant="light" leftSection={ <PlusIcon size={ 14 } /> }>
							{ t("views.settings.calendar.service_types_add") }
						</Button>
					) }
				>
					<ServiceTypeFormModalBody />
				</Modal>
			) }
		>
			<ServiceTypesTable serviceTypes={ service_types } />
		</FormBand>
	)
}
