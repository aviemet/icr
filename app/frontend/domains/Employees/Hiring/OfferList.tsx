import { useTranslation } from "react-i18next"

import { Badge } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionAddModal, CollectionPanel, RecordRow } from "@/features"
import { useRecordCanUpdate } from "@/lib/hooks"

import { OfferForm } from "./OfferForm"
import { OfferStatusForm } from "./OfferStatusForm"

export interface OfferListProps {
	employee: Schema.EmployeesShow
}

export function OfferList({ employee }: OfferListProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const offers = [...employee.offers].sort((left, right) => (
		new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
	))

	return (
		<CollectionPanel
			title={ t("views.employees.show.hiring.offers") }
			count={ offers.length }
			emptyLabel={ t("views.employees.show.hiring.empty_offers") }
			actions={ (
				<CollectionAddModal
					canUpdate={ canUpdate }
					label={ t("views.employees.show.hiring.add_offer") }
				>
					<OfferForm employee={ employee } />
				</CollectionAddModal>
			) }
		>
			{ offers.map(offer => (
				<RecordRow
					key={ offer.id }
					title={ `${String(offer.job_title.name)} - ${offer.rate} (${offer.period})` }
					meta={ (
						<span>
							<Badge variant="light" size="sm">
								{ t(`views.employees.show.hiring.offer_statuses.${offer.status}`) }
							</Badge>
							{ offer.proposed_start_on && (
								<>
									{ " " }
									{ t("views.employees.show.hiring.proposed_start") }:{ " " }
									<DateTimeFormatter>{ offer.proposed_start_on }</DateTimeFormatter>
								</>
							) }
						</span>
					) }
					actions={ canUpdate ? <OfferStatusForm employee={ employee } offer={ offer } /> : undefined }
				/>
			)) }
		</CollectionPanel>
	)
}
