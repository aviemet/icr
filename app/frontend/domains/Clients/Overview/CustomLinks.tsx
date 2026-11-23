import { UnstyledButton } from "@mantine/core"
import { useState } from "react"
import { useTranslation } from "react-i18next"


import { Box, Button, Group, Text } from "@/components"
import { DeleteButton } from "@/components/Button"
import { CollectionAddModal, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

import { ClientLinkForm } from "./ClientLinkForm"
import * as classes from "./Overview.css"

interface CustomLinksProps {
	client: Schema.ClientsShow
}

export function CustomLinks({ client }: CustomLinksProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const [modifying, setModifying] = useState(false)
	const links = client.links ?? []
	const showModifyControl = canUpdate && links.length > 0

	return (
		<Box className={ classes.customLinks }>
			<Box className={ classes.customLinksHeader }>
				<Text size="sm" fw={ 600 }>
					{ t("views.clients.show.overview.custom_links") }
				</Text>
				<Group gap="xs">
					{ showModifyControl && (
						modifying
							? (
								<Button
									size="xs"
									variant="light"
									onClick={ () => setModifying(false) }
								>
									{ t("views.clients.show.overview.done_links") }
								</Button>
							)
							: (
								<UnstyledButton
									type="button"
									className={ classes.modifyLink }
									onClick={ () => setModifying(true) }
								>
									{ t("views.clients.show.overview.modify_links") }
								</UnstyledButton>
							)
					) }
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.overview.add_link") }
					>
						<ClientLinkForm
							action={ Routes.clientLinks(client.slug) }
							method="post"
							initialData={ {
								link: {
									title: "",
									url: "",
								},
							} }
							submitLabel={ t("views.clients.show.overview.add_link") }
						/>
					</CollectionAddModal>
				</Group>
			</Box>

			{ links.length === 0
				? (
					<Text size="sm" c="dimmed">
						{ t("views.clients.show.overview.custom_links_empty") }
					</Text>
				)
				: (
					<Box className={ classes.customLinksList }>
						{ links.map(link => (
							<RecordRow
								key={ link.id }
								title={ (
									<a
										href={ link.url }
										target="_blank"
										rel="noopener noreferrer"
									>
										{ link.title }
									</a>
								) }
								meta={ <span>{ link.url }</span> }
								actions={ canUpdate && modifying
									? (
										<Group gap="xs">
											<CollectionAddModal
												canUpdate={ canUpdate }
												label={ t("views.clients.show.overview.edit_link") }
											>
												<ClientLinkForm
													action={ Routes.clientLink(client.slug, link.id) }
													method="put"
													initialData={ {
														link: {
															title: link.title,
															url: link.url,
														},
													} }
													submitLabel={ t("views.clients.show.overview.save_link") }
												/>
											</CollectionAddModal>
											<DeleteButton
												href={ Routes.clientLink(client.slug, link.id) }
												label={ link.title }
											/>
										</Group>
									)
									: undefined }
							/>
						)) }
					</Box>
				) }
		</Box>
	)
}
