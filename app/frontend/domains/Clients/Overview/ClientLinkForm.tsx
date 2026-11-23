import { useTranslation } from "react-i18next"

import { Button, Group, Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { useModalContext } from "@/components/Modal"

interface ClientLinkFormProps {
	action: string
	method: "post" | "put"
	initialData: {
		link: {
			title: string
			url: string
		}
	}
	submitLabel: string
}

export function ClientLinkForm({
	action,
	method,
	initialData,
	submitLabel,
}: ClientLinkFormProps) {
	const { t } = useTranslation()
	const { close } = useModalContext()

	return (
		<Form
			action={ action }
			method={ method }
			initialData={ initialData }
			onSuccess={ () => close() }
		>
			<Stack gap="sm">
				<TextInput
					name="link.title"
					label={ t("views.clients.show.overview.link_title") }
					required
				/>
				<TextInput
					name="link.url"
					label={ t("views.clients.show.overview.link_url") }
					placeholder="https://example.com"
					required
				/>
				<Group justify="flex-end">
					<Button type="button" variant="subtle" onClick={ () => close() }>
						{ t("views.clients.show.overview.cancel_link") }
					</Button>
					<Submit>{ submitLabel }</Submit>
				</Group>
			</Stack>
		</Form>
	)
}
