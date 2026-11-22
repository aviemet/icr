import { useTranslation } from "react-i18next"

import { Link } from "@/components"
import { CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"

interface DoctorClientsProps {
	doctor: Schema.DoctorsShow
}

export function DoctorClients({ doctor }: DoctorClientsProps) {
	const { t } = useTranslation()

	return (
		<CollectionPanel
			title={ t("views.doctors.show.clients.title") }
			count={ doctor.doctors_clients.length }
			emptyLabel={ t("views.doctors.show.clients.empty") }
		>
			{ doctor.doctors_clients.map(doctorsClient => (
				<RecordRow
					key={ doctorsClient.id }
					title={ (
						<Link href={ `${Routes.client(doctorsClient.client.slug)}?tab=medical` }>
							{ doctorsClient.client.person?.name || doctorsClient.client.name }
						</Link>
					) }
					meta={ doctorsClient.notes
						? <span>{ doctorsClient.notes }</span>
						: undefined }
				/>
			)) }
		</CollectionPanel>
	)
}
