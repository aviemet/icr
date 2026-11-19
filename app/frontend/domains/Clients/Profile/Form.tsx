import { useTranslation } from "react-i18next"

import { Grid, Group } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, NumberInput, Textarea, TextInput } from "@/components/Inputs"
import {
	DefinitionItem,
	DefinitionList,
	FormBand,
	FormBandStack,
	ShowEditToggle,
} from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface ClientProfileFormProps {
	client: Schema.ClientsShow
}

export function ClientProfileForm({ client }: ClientProfileFormProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canUpdate = can("clients", "update")
	const lifeDetail = client.life_detail

	return (
		<ShowEditToggle
			canUpdate={ canUpdate }
			show={ (
				<FormBandStack>
					<FormBand title={ t("views.clients.show.profile.demographics") }>
						<DefinitionList>
							<DefinitionItem label="First Name" value={ client.person.first_name } />
							<DefinitionItem label="Middle Name" value={ client.person.middle_name || "-" } />
							<DefinitionItem label="Last Name" value={ client.person.last_name } />
							<DefinitionItem label="Nickname" value={ client.person.nick_name || "-" } />
							<DefinitionItem
								label="Date of Birth"
								value={ client.person.dob
									? <DateTimeFormatter>{ client.person.dob }</DateTimeFormatter>
									: "-" }
							/>
							<DefinitionItem label="Client #" value={ client.number || "-" } />
						</DefinitionList>
					</FormBand>

					<FormBand title={ t("views.clients.show.profile.california") }>
						<DefinitionList>
							<DefinitionItem label="UCI Number" value={ client.uci_number || "-" } />
							<DefinitionItem label="Regional Center" value={ client.regional_center || "-" } />
							<DefinitionItem label="Medi-Cal Number" value={ client.medi_cal_number || "-" } />
							<DefinitionItem
								label="IPP Start"
								value={ client.ipp_starts_on
									? <DateTimeFormatter>{ client.ipp_starts_on }</DateTimeFormatter>
									: "-" }
							/>
							<DefinitionItem
								label="IPP End"
								value={ client.ipp_ends_on
									? <DateTimeFormatter>{ client.ipp_ends_on }</DateTimeFormatter>
									: "-" }
							/>
							<DefinitionItem
								label="IPP Review"
								value={ client.ipp_review_on
									? <DateTimeFormatter>{ client.ipp_review_on }</DateTimeFormatter>
									: "-" }
							/>
						</DefinitionList>
					</FormBand>

					<FormBand title={ t("views.clients.show.profile.ihss") }>
						<DefinitionList>
							<DefinitionItem label="Authorized Hours" value={ client.ihss_authorized_hours ?? "-" } />
							<DefinitionItem label="Share of Cost" value={ client.ihss_share_of_cost ?? "-" } />
							<DefinitionItem label="IHSS Notes" value={ client.ihss_notes || "-" } fullWidth />
						</DefinitionList>
					</FormBand>

					<FormBand title={ t("views.clients.show.profile.communication") }>
						<DefinitionList>
							<DefinitionItem label="Preferred Language" value={ client.preferred_language || "-" } />
							<DefinitionItem label="Preferred Hospital" value={ client.preferred_hospital || "-" } />
							<DefinitionItem label="Communication Notes" value={ client.communication_notes || "-" } fullWidth />
						</DefinitionList>
					</FormBand>

					<FormBand title={ t("views.clients.show.profile.life_details") }>
						<DefinitionList>
							<DefinitionItem label="ADLs" value={ lifeDetail?.adls || "-" } fullWidth />
							<DefinitionItem label="Adaptive Supports" value={ lifeDetail?.adaptive_supports || "-" } fullWidth />
							<DefinitionItem label="Behavior Supports" value={ lifeDetail?.behavior_supports || "-" } fullWidth />
							<DefinitionItem label="Routines" value={ lifeDetail?.routines || "-" } fullWidth />
							<DefinitionItem label="Risk Flags" value={ lifeDetail?.risk_flags || "-" } fullWidth />
						</DefinitionList>
					</FormBand>
				</FormBandStack>
			) }
			edit={ (
				<Form
					action={ Routes.client(client.slug) }
					method="put"
					initialData={ {
						tab: "profile",
						client: {
							number: client.number ?? "",
							uci_number: client.uci_number ?? "",
							regional_center: client.regional_center ?? "",
							medi_cal_number: client.medi_cal_number ?? "",
							ipp_starts_on: client.ipp_starts_on ?? "",
							ipp_ends_on: client.ipp_ends_on ?? "",
							ipp_review_on: client.ipp_review_on ?? "",
							preferred_hospital: client.preferred_hospital ?? "",
							preferred_language: client.preferred_language ?? "",
							communication_notes: client.communication_notes ?? "",
							ihss_authorized_hours: client.ihss_authorized_hours ?? "",
							ihss_share_of_cost: client.ihss_share_of_cost ?? "",
							ihss_notes: client.ihss_notes ?? "",
							person: {
								id: client.person.id,
								first_name: client.person.first_name,
								middle_name: client.person.middle_name ?? "",
								last_name: client.person.last_name,
								nick_name: client.person.nick_name ?? "",
								dob: client.person.dob ?? "",
							},
							life_detail: {
								id: lifeDetail?.id,
								adls: lifeDetail?.adls ?? "",
								adaptive_supports: lifeDetail?.adaptive_supports ?? "",
								behavior_supports: lifeDetail?.behavior_supports ?? "",
								routines: lifeDetail?.routines ?? "",
								risk_flags: lifeDetail?.risk_flags ?? "",
							},
						},
					} }
				>
					<FormBandStack>
						<FormBand title={ t("views.clients.show.profile.demographics") }>
							<Grid>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.person.first_name" label="First Name" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.person.middle_name" label="Middle Name" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.person.last_name" label="Last Name" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.person.nick_name" label="Nickname" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<DateInput name="client.person.dob" label="Date of Birth" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.number" label="Client #" />
								</Grid.Col>
							</Grid>
						</FormBand>

						<FormBand title={ t("views.clients.show.profile.california") }>
							<Grid>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.uci_number" label="UCI Number" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.regional_center" label="Regional Center" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<TextInput name="client.medi_cal_number" label="Medi-Cal Number" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<DateInput name="client.ipp_starts_on" label="IPP Start" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<DateInput name="client.ipp_ends_on" label="IPP End" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<DateInput name="client.ipp_review_on" label="IPP Review" />
								</Grid.Col>
							</Grid>
						</FormBand>

						<FormBand title={ t("views.clients.show.profile.ihss") }>
							<Grid>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<NumberInput name="client.ihss_authorized_hours" label="Authorized Hours" decimalScale={ 2 } />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 4 } }>
									<NumberInput name="client.ihss_share_of_cost" label="Share of Cost" decimalScale={ 2 } />
								</Grid.Col>
								<Grid.Col span={ 12 }>
									<Textarea name="client.ihss_notes" label="IHSS Notes" minRows={ 2 } />
								</Grid.Col>
							</Grid>
						</FormBand>

						<FormBand title={ t("views.clients.show.profile.communication") }>
							<Grid>
								<Grid.Col span={ { xxs: 12, sm: 6 } }>
									<TextInput name="client.preferred_language" label="Preferred Language" />
								</Grid.Col>
								<Grid.Col span={ { xxs: 12, sm: 6 } }>
									<TextInput name="client.preferred_hospital" label="Preferred Hospital" />
								</Grid.Col>
								<Grid.Col span={ 12 }>
									<Textarea name="client.communication_notes" label="Communication Notes" minRows={ 2 } />
								</Grid.Col>
							</Grid>
						</FormBand>

						<FormBand title={ t("views.clients.show.profile.life_details") }>
							<Grid>
								<Grid.Col span={ 12 }>
									<Textarea name="client.life_detail.adls" label="ADLs" minRows={ 2 } />
								</Grid.Col>
								<Grid.Col span={ 12 }>
									<Textarea name="client.life_detail.adaptive_supports" label="Adaptive Supports" minRows={ 2 } />
								</Grid.Col>
								<Grid.Col span={ 12 }>
									<Textarea name="client.life_detail.behavior_supports" label="Behavior Supports" minRows={ 2 } />
								</Grid.Col>
								<Grid.Col span={ 12 }>
									<Textarea name="client.life_detail.routines" label="Routines" minRows={ 2 } />
								</Grid.Col>
								<Grid.Col span={ 12 }>
									<Textarea name="client.life_detail.risk_flags" label="Risk Flags" minRows={ 2 } />
								</Grid.Col>
							</Grid>
						</FormBand>

						<Group justify="flex-end">
							<Submit>{ t("views.clients.show.profile.save") }</Submit>
						</Group>
					</FormBandStack>
				</Form>
			) }
		/>
	)
}
