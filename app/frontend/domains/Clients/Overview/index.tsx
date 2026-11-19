import { useTranslation } from "react-i18next"
import clsx from "clsx"

import { Avatar, Badge, Group, Link, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CalendarIcon, CoinsIcon, HomeIcon, UserGroupIcon, WarningTriangleIcon } from "@/components/Icons"
import { MetricTile } from "@/features"
import { Routes } from "@/lib"

import * as classes from "./Overview.css"

interface ClientOverviewProps {
	client: Schema.ClientsShow
}

function MetricLine({ label, value }: { label: string, value: React.ReactNode }) {
	return (
		<div className={ classes.metricLine }>
			<span className={ classes.metricLabel }>{ label }</span>
			<span>{ value }</span>
		</div>
	)
}

function CountChip({ value, alert = false }: { value: number, alert?: boolean }) {
	return (
		<span className={ clsx(classes.chip, alert && classes.chipAlert) }>
			{ value }
		</span>
	)
}

function personInitials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if(parts.length === 0) return "?"
	if(parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ClientOverview({ client }: ClientOverviewProps) {
	const { t } = useTranslation()
	const healthTone = client.active_allergies_count > 0 || client.incident_reports_count > 0
		? "alert"
		: "default"

	return (
		<div className={ classes.board }>
			<div className={ classes.tileRow }>
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
			</div>

			<div className={ classes.secondaryRow }>
				<MetricTile
					title={ t("views.clients.show.overview.care_team") }
					icon={ <UserGroupIcon size={ 16 } /> }
				>
					<div className={ classes.teamList }>
						{ client.current_manager
							? (
								<div className={ classes.teamRow }>
									<Avatar radius="xl" size={ 32 } color="brand">
										{ personInitials(client.current_manager.person.name) }
									</Avatar>
									<div className={ classes.teamMeta }>
										<GroupLabel
											name={ client.current_manager.person.name }
											badge="Lead"
										/>
										<span className={ classes.teamRole }>
											{ t("views.clients.show.overview.manager") }
										</span>
									</div>
								</div>
							)
							: (
								<Text size="sm" c="dimmed">{ t("views.clients.show.overview.none") }</Text>
							) }

						{ client.current_attendants.map(attendant => (
							<div key={ attendant.id } className={ classes.teamRow }>
								<Avatar radius="xl" size={ 32 } color="gray">
									{ personInitials(attendant.person.name) }
								</Avatar>
								<div className={ classes.teamMeta }>
									<Text size="sm" fw={ 600 }>{ attendant.person.name }</Text>
									<span className={ classes.teamRole }>
										{ t("views.clients.show.overview.attendants") }
									</span>
								</div>
							</div>
						)) }

						<MetricLine
							label={ t("views.clients.show.overview.household") }
							value={ client.household
								? <Link href={ Routes.household(client.household.slug) }>{ client.household.name }</Link>
								: "-" }
						/>
					</div>
				</MetricTile>

				<MetricTile
					title={ t("views.clients.show.overview.quick_links") }
					icon={ <CalendarIcon size={ 16 } /> }
				>
					<div className={ classes.actionGrid }>
						<Link href={ `${Routes.client(client.slug)}?tab=profile` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.clients.show.tabs.profile") }</span>
							<span className={ classes.actionHint }>View demographics</span>
						</Link>
						<Link href={ `${Routes.client(client.slug)}?tab=medications` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.clients.show.tabs.medications") }</span>
							<span className={ classes.actionHint }>Active prescriptions</span>
						</Link>
						<Link href={ `${Routes.client(client.slug)}?tab=documents` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.clients.show.tabs.documents") }</span>
							<span className={ classes.actionHint }>Files and images</span>
						</Link>
						<Link href={ `${Routes.client(client.slug)}?tab=incidents` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.clients.show.tabs.incidents") }</span>
							<span className={ classes.actionHint }>Incident log</span>
						</Link>
						<Link href={ Routes.scheduleClient(client.slug) } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.clients.show.overview.schedule") }</span>
							<span className={ classes.actionHint }>Open calendar</span>
						</Link>
						<Link href={ `${Routes.client(client.slug)}?tab=care` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.clients.show.tabs.care") }</span>
							<span className={ classes.actionHint }>Team and services</span>
						</Link>
					</div>
				</MetricTile>
			</div>
		</div>
	)
}

function GroupLabel({ name, badge }: { name: string, badge: string }) {
	return (
		<Group gap="xs">
			<Text size="sm" fw={ 600 }>{ name }</Text>
			<Badge size="xs" variant="light">{ badge }</Badge>
		</Group>
	)
}
