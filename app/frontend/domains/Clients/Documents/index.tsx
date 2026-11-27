import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Group, Image, Link, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { CollectionAddModal, CollectionPanel, DropzoneField, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

import * as classes from "./Documents.css"

interface ClientDocumentsProps {
	client: Schema.ClientsShow
}

export function ClientDocuments({ client }: ClientDocumentsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const documents = client.documents
	const images = client.images

	const uploadDocument = (fileList: FileList | null) => {
		const file = fileList?.[0]
		if(!file) return

		router.post(Routes.clientDocuments(client.slug), {
			document: file,
		}, {
			forceFormData: true,
		})
	}

	const uploadImage = (fileList: FileList | null) => {
		const file = fileList?.[0]
		if(!file) return

		router.post(Routes.clientImages(client.slug), {
			image: file,
		}, {
			forceFormData: true,
		})
	}

	return (
		<Stack gap="lg">
			<CollectionPanel
				title={ t("views.clients.show.documents.files") }
				count={ documents.length }
				emptyLabel="No documents uploaded."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.documents.upload_document") }
					>
						<DropzoneField
							label={ t("views.clients.show.documents.upload_document") }
							hint="PDF or Word document"
							accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
							onSelect={ uploadDocument }
						/>
					</CollectionAddModal>
				) }
			>
				{ documents.map(document => (
					<RecordRow
						key={ document.id }
						title={ <Link href={ document.url } target="_blank">{ document.filename }</Link> }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientDocument(client.slug, document.id) }
									label={ document.filename }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<Stack gap="sm">
				<GroupHeader
					title={ t("views.clients.show.documents.images") }
					count={ images.length }
					action={ (
						<CollectionAddModal
							canUpdate={ canUpdate }
							label={ t("views.clients.show.documents.upload_image") }
						>
							<DropzoneField
								label={ t("views.clients.show.documents.upload_image") }
								hint="PNG or JPEG"
								accept="image/png,image/jpeg"
								onSelect={ uploadImage }
							/>
						</CollectionAddModal>
					) }
				/>
				{ images.length === 0
					? <Text size="sm" c="dimmed">No images uploaded.</Text>
					: (
						<div className={ classes.imageGrid }>
							{ images.map(image => (
								<div key={ image.id } className={ classes.imageCard }>
									<Image src={ image.url } alt={ image.filename } w="100%" h={ 100 } fit="cover" />
									<Text size="xs" lineClamp={ 1 }>{ image.filename }</Text>
									{ canUpdate && (
										<DeleteButton
											href={ Routes.clientImage(client.slug, image.id) }
											label={ image.filename }
										/>
									) }
								</div>
							)) }
						</div>
					) }
			</Stack>
		</Stack>
	)
}

function GroupHeader({
	title,
	count,
	action,
}: {
	title: string
	count: number
	action: React.ReactNode
}) {
	return (
		<Group justify="space-between" align="center" gap="sm" wrap="wrap">
			<Title order={ 4 }>
				{ title }
				{ " " }
				<Text span size="sm" c="dimmed">{ count }</Text>
			</Title>
			{ action }
		</Group>
	)
}
