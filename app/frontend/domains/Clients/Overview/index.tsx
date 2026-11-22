import { useTranslation } from "react-i18next"

import { Avatar, Badge, Box, Group, Link, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CalendarIcon, CoinsIcon, HomeIcon, UserGroupIcon, WarningTriangleIcon } from "@/components/Icons"
import { isPendingTermination } from "@/domains/Employees/PendingTermination/isPendingTermination"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
} from "@/features"
import { formatter, initials, Routes } from "@/lib"

import * as classes from "./Overview.css"

function lastDayBadge(employee: { status?: string, inactive_at?: Date | string | null }) {
	if(!isPendingTermination(employee) || employee.inactive_at === undefined || employee.inactive_at === null) {
		return undefined
	}

	return `Last day ${formatter.datetime.dateEnglish(employee.inactive_at)}`
}

interface ClientOverviewProps {
	client: Schema.ClientsShow
	canViewOpenShifts?: boolean
	openShiftsCount?: number
}

export function ClientOverview({
	client,
	canViewOpenShifts = false,
	openShiftsCount = 0,
}: ClientOverviewProps) {
	const { t } = useTranslation()
	const healthTone = client.active_allergies_count > 0 || client.incident_reports_count > 0
		? "alert"
		: "default"
	const scheduleTone = canViewOpenShifts && openShiftsCount > 0 ? "alert" : "default"

	return (
		<Box className={ classes.board }>
			<Box className={ classes.tileRow }>
				<MetricTile
					title={ t("views.clients.show.overview.funding") }
					icon={ <CoinsIcon size={ 16 } /> }
				>
					<MetricLine label={ t("views.clients.show.overview.uci") } value={ client.uci_number || "-" } />
					<MetricLine label={ t("views.clients.show.overview.regional_center") } value={ client.regional_center || "-" } />
					<MetricLine
						label={ t("views.clients.show.overview.ipp_review") }
						value={ client.ipp_review_on
							? <DateTimeFormatter>{ client.ipp_review_on }</DateTimeFormatter>
							: "-" }
					/>
				</MetricTile>

				<MetricTile
					title={ t("views.clients.show.overview.ihss") }
					icon={ <HomeIcon size={ 16 } /> }
				>
					<MetricLine label="Authorized hours" value={ client.ihss_authorized_hours ?? "-" } />
					<MetricLine label="Share of cost" value={ client.ihss_share_of_cost ?? "-" } />
				</MetricTile>

				<MetricTile
					title={ t("views.clients.show.overview.health_alerts") }
					tone={ healthTone }
					icon={ <WarningTriangleIcon size={ 16 } /> }
				>
					<MetricLine
						label={ t("views.clients.show.overview.active_meds") }
						value={ <CountChip value={ client.active_prescriptions_count } /> }
					/>
					<MetricLine
						label={ t("views.clients.show.overview.allergies") }
						value={ <CountChip value={ client.active_allergies_count } alert={ client.active_allergies_count > 0 } /> }
					/>
					<MetricLine
						label={ t("views.clients.show.overview.incidents") }
						value={ <CountChip value={ client.incident_reports_count } alert={ client.incident_reports_count > 0 } /> }
					/>
					<MetricLine
						label={ t("views.clients.show.overview.emergency_contacts") }
						value={ <CountChip value={ client.emergency_contacts_count } /> }
					/>
				</MetricTile>
			</Box>

			<Box className={ classes.secondaryRow }>
				<MetricTile
					title={ t("views.clients.show.overview.care_team") }
					icon={ <UserGroupIcon size={ 16 } /> }
				>
					<Box className={ classes.teamList }>
						{ client.current_manager
							? (
								<Box className={ classes.teamRow }>
									<Avatar radius="xl" size={ 32 } color="brand">
										{ initials(client.current_manager.person.name) ?? "?" }
									</Avatar>
									<Box className={ classes.teamMeta }>
										<GroupLabel
											name={ client.current_manager.person.name }
											badges={ ["Lead", lastDayBadge(client.current_manager)].filter(
												(badge): badge is string => badge !== undefined,
											) }
										/>
										<span className={ classes.teamRole }>
											{ t("views.clients.show.overview.manager") }
										</span>
									</Box>
								</Box>
							)
							: (
								<Text size="sm" c="dimmed">{ t("views.clients.show.overview.none") }</Text>
							) }

						{ client.current_attendants.map(attendant => (
							<Box key={ attendant.id } className={ classes.teamRow }>
								<Avatar radius="xl" size={ 32 } color="gray">
									{ initials(attendant.person.name) ?? "?" }
								</Avatar>
								<Box className={ classes.teamMeta }>
									<GroupLabel
										name={ attendant.person.name }
										badges={ [lastDayBadge(attendant)].filter(
											(badge): badge is string => badge !== undefined,
										) }
									/>
									<span className={ classes.teamRole }>
										{ t("views.clients.show.overview.attendants") }
									</span>
								</Box>
							</Box>
						)) }

						<MetricLine
							label={ t("views.clients.show.overview.household") }
							value={ client.household
								? <Link href={ Routes.household(client.household.slug) }>{ client.household.name }</Link>
								: "-" }
						/>
					</Box>
				</MetricTile>

				<MetricTile
					title={ t("views.clients.show.overview.quick_links") }
					tone={ scheduleTone }
					icon={ <CalendarIcon size={ 16 } /> }
				>
					{ canViewOpenShifts && (
						<MetricLine
							label={ t("views.clients.show.overview.open_shifts") }
							value={ (
								<CountChip
									value={ openShiftsCount }
									alert={ openShiftsCount > 0 }
								/>
							) }
						/>
					) }
					<BoardActionGrid>
						<BoardActionTile
							href={ `${Routes.client(client.slug)}?tab=profile` }
							title={ t("views.clients.show.tabs.profile") }
							hint="View demographics"
						/>
						<BoardActionTile
							href={ `${Routes.client(client.slug)}?tab=medical` }
							title={ t("views.clients.show.tabs.medical") }
							hint="Doctors, meds, and visits"
						/>

						<BoardActionTile
							href={ `${Routes.client(client.slug)}?tab=documents` }
							title={ t("views.clients.show.tabs.documents") }
							hint="Files and images"
						/>
						<BoardActionTile
							href={ `${Routes.client(client.slug)}?tab=incidents` }
							title={ t("views.clients.show.tabs.incidents") }
							hint="Incident log"
						/>
						<BoardActionTile
							href={ Routes.scheduleClient(client.slug) }
							title={ t("views.clients.show.overview.schedule") }
							hint="Open calendar"
						/>
						<BoardActionTile
							href={ `${Routes.client(client.slug)}?tab=care` }
							title={ t("views.clients.show.tabs.care") }
							hint="Team and services"
						/>
					</BoardActionGrid>
				</MetricTile>
			</Box>
		</Box>
	)
}

function GroupLabel({ name, badges }: { name: string, badges: string[] }) {
	return (
		<Group gap="xs">
			<Text size="sm" fw={ 600 }>{ name }</Text>
			{ badges.map(badge => (
				<Badge key={ badge } size="xs" variant="light">{ badge }</Badge>
			)) }
		</Group>
	)
}
