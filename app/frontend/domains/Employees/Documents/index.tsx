import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Group, Image, Link, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { CollectionAddModal, CollectionPanel, DropzoneField, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

import * as classes from "./Documents.css"

type EmployeeAttachment = {
	id: string
	filename: string
	content_type: string
	byte_size: number
	url: string
	created_at: Date
}

interface EmployeeDocumentsProps {
	employee: Schema.EmployeesShow
}

export function EmployeeDocuments({ employee }: EmployeeDocumentsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const documents: EmployeeAttachment[] = employee.documents
	const images: EmployeeAttachment[] = employee.images

	const uploadDocument = (fileList: FileList | null) => {
		const file = fileList?.[0]
		if(!file) return

		router.post(Routes.employeeDocuments(employee.slug), {
			document: file,
		}, {
			forceFormData: true,
		})
	}

	const uploadImage = (fileList: FileList | null) => {
		const file = fileList?.[0]
		if(!file) return

		router.post(Routes.employeeImages(employee.slug), {
			image: file,
		}, {
			forceFormData: true,
		})
	}

	return (
		<Stack gap="lg">
			<CollectionPanel
				title={ t("views.employees.show.documents.files") }
				count={ documents.length }
				emptyLabel={ t("views.employees.show.documents.empty_files") }
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.documents.upload_document") }
					>
						<DropzoneField
							label={ t("views.employees.show.documents.upload_document") }
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
									href={ Routes.employeeDocument(employee.slug, document.id) }
									label={ document.filename }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<Stack gap="sm">
				<Group justify="space-between" align="center" gap="sm" wrap="wrap">
					<Title order={ 4 }>
						{ t("views.employees.show.documents.images") }
						{ " " }
						<Text span size="sm" c="dimmed">{ images.length }</Text>
					</Title>
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.documents.upload_image") }
					>
						<DropzoneField
							label={ t("views.employees.show.documents.upload_image") }
							hint="PNG or JPEG"
							accept="image/png,image/jpeg"
							onSelect={ uploadImage }
						/>
					</CollectionAddModal>
				</Group>
				{ images.length === 0
					? <Text size="sm" c="dimmed">{ t("views.employees.show.documents.empty_images") }</Text>
					: (
						<div className={ classes.imageGrid }>
							{ images.map(image => (
								<div key={ image.id } className={ classes.imageCard }>
									<Image src={ image.url } alt={ image.filename } w="100%" h={ 100 } fit="cover" />
									<Text size="xs" lineClamp={ 1 }>{ image.filename }</Text>
									{ canUpdate && (
										<DeleteButton
											href={ Routes.employeeImage(employee.slug, image.id) }
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
