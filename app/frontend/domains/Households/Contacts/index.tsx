import { useTranslation } from "react-i18next"

import { Stack } from "@/components"
import { AddressFormatter, EmailFormatter, PhoneFormatter } from "@/components/Formatters"
import {
	CollectionPanel,
	RecordRow,
	ShowEditToggle,
} from "@/features"
import { useRecordCanUpdate } from "@/lib/hooks"

import { HouseholdContactForm } from "./ContactForm"

interface HouseholdContactsProps {
	household: Schema.HouseholdsShow
}

export function HouseholdContacts({ household }: HouseholdContactsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const contact = household.contact
	const phones = contact?.phones ?? []
	const emails = contact?.emails ?? []
	const addresses = contact?.addresses ?? []

	return (
		<ShowEditToggle
			title={ t("views.households.show.contacts.title") }
			canUpdate={ canUpdate }
		>
			{ ({ editing }) => editing
				? <HouseholdContactForm household={ household } />
				: (
					<Stack gap="md">
						<CollectionPanel
							title={ t("views.households.show.contacts.phones") }
							count={ phones.length }
							emptyLabel="-"
						>
							{ phones.map(phone => (
								<RecordRow
									key={ phone.id }
									title={ <PhoneFormatter>{ phone.number }</PhoneFormatter> }
									meta={ (
										<>
											{ phone.name && <span>{ phone.name }</span> }
											{ phone.category && <span>{ phone.category.name }</span> }
										</>
									) }
								/>
							)) }
						</CollectionPanel>

						<CollectionPanel
							title={ t("views.households.show.contacts.emails") }
							count={ emails.length }
							emptyLabel="-"
						>
							{ emails.map(email => (
								<RecordRow
									key={ email.id }
									title={ <EmailFormatter>{ email.email }</EmailFormatter> }
									meta={ (
										<>
											{ email.name && <span>{ email.name }</span> }
											{ email.category && <span>{ email.category.name }</span> }
										</>
									) }
								/>
							)) }
						</CollectionPanel>

						<CollectionPanel
							title={ t("views.households.show.contacts.addresses") }
							count={ addresses.length }
							emptyLabel="-"
						>
							{ addresses.map(address => (
								<RecordRow
									key={ address.id }
									title={ <AddressFormatter address={ address } /> }
									meta={ address.category ? <span>{ address.category.name }</span> : undefined }
								/>
							)) }
						</CollectionPanel>
					</Stack>
				) }
		</ShowEditToggle>
	)
}
