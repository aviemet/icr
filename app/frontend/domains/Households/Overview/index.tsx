import { useTranslation } from "react-i18next"

import { Box, Group, Link, Text } from "@/components"
import { AddressFormatter } from "@/components/Formatters"
import { CalendarIcon, HomeIcon, UserGroupIcon } from "@/components/Icons"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
} from "@/features"
import { Routes } from "@/lib"

import * as classes from "./Overview.css"

interface HouseholdOverviewProps {
	household: Schema.HouseholdsShow
}

export function HouseholdOverview({ household }: HouseholdOverviewProps) {
	const { t } = useTranslation()
	const contact = household.contact
	const primaryAddress = contact?.addresses?.find(address => address.id === contact.primary_address_id)
		?? contact?.addresses?.[0]
	const members = household.current_memberships

	return (
		<Box className={ classes.board }>
			<Box className={ classes.tileRow }>
				<MetricTile
					title={ t("views.households.show.overview.members") }
					icon={ <UserGroupIcon size={ 16 } /> }
				>
					<MetricLine
						label={ t("views.households.show.overview.member_count") }
						value={ <CountChip value={ members.length } /> }
					/>
					{ members.length > 0 && (
						<Group gap="xs" mt="xs">
							{ members.map(membership => (
								<Link
									key={ membership.id }
									href={ Routes.client(membership.client.slug) }
								>
									{ membership.client.full_name }
								</Link>
							)) }
						</Group>
					) }
				</MetricTile>

				<MetricTile
					title={ t("views.households.show.overview.address") }
					icon={ <HomeIcon size={ 16 } /> }
				>
					{ primaryAddress
						? <AddressFormatter address={ primaryAddress } />
						: (
							<Text size="sm" c="dimmed">
								{ t("views.households.show.overview.no_address") }
							</Text>
						) }
				</MetricTile>
			</Box>

			<BoardActionGrid>
				<BoardActionTile
					href={ Routes.scheduleHousehold(household.slug) }
					title={ t("views.households.show.overview.schedule") }
					hint={ t("views.households.show.overview.schedule_hint") }
					icon={ <CalendarIcon size={ 16 } /> }
				/>
			</BoardActionGrid>
		</Box>
	)
}
