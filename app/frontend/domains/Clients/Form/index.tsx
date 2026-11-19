import clsx from "clsx"

import { Box, Grid, Group } from "@/components"
import { Form, Submit } from "@/components/Form"
import { ClientIcon, CoinsIcon, PersonIcon } from "@/components/Icons"
import { DateInput, NumberInput, Textarea, TextInput } from "@/components/Inputs"
import { pageChrome } from "@/components/PageChrome"
import { FormBand, FormBandStack } from "@/features"
import { type HTTPVerb } from "@/lib"

export interface ClientFormProps {
	to: string
	method?: HTTPVerb
	client: Schema.ClientsFormData
}

export function ClientForm({ method = "post", to, client, ...props }: ClientFormProps) {
	return (
		<Form
			action={ to }
			method={ method }
			initialData={ {
				client: {
					...client,
					uci_number: client.uci_number ?? "",
					regional_center: client.regional_center ?? "",
					medi_cal_number: client.medi_cal_number ?? "",
					ihss_authorized_hours: client.ihss_authorized_hours ?? "",
					ihss_share_of_cost: client.ihss_share_of_cost ?? "",
					ihss_notes: client.ihss_notes ?? "",
					preferred_language: client.preferred_language ?? "",
					preferred_hospital: client.preferred_hospital ?? "",
					communication_notes: client.communication_notes ?? "",
				},
			} }
			{ ...props }
		>
			<FormBandStack>
				<FormBand
					title="Demographics"
					description="Legal name, client number, and date of birth."
					icon={ <PersonIcon size={ 16 } /> }
				>
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
							<TextInput name="client.number" label="Client #" />
						</Grid.Col>
						<Grid.Col span={ { xxs: 12, sm: 4 } }>
							<DateInput name="client.person.dob" label="Date of Birth" />
						</Grid.Col>
					</Grid>
				</FormBand>

				<FormBand
					title="Funding"
					description="Regional center and IHSS funding details."
					icon={ <CoinsIcon size={ 16 } /> }
				>
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
							<NumberInput name="client.ihss_authorized_hours" label="IHSS Authorized Hours" decimalScale={ 2 } />
						</Grid.Col>
						<Grid.Col span={ { xxs: 12, sm: 4 } }>
							<NumberInput name="client.ihss_share_of_cost" label="IHSS Share of Cost" decimalScale={ 2 } />
						</Grid.Col>
						<Grid.Col span={ 12 }>
							<Textarea name="client.ihss_notes" label="IHSS Notes" minRows={ 2 } />
						</Grid.Col>
					</Grid>
				</FormBand>

				<FormBand
					title="Communication"
					description="Language, hospital, and care notes."
					icon={ <ClientIcon size={ 16 } /> }
				>
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

				<Box className={ clsx(pageChrome.tintedSurface) }>
					<Group justify="flex-end">
						<Submit>{ client.id ? "Update" : "Create" } Client</Submit>
					</Group>
				</Box>
			</FormBandStack>
		</Form>
	)
}
