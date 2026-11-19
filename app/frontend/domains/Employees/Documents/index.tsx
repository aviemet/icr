import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Group, Image, Link, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Routes } from "@/lib"

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
		<Stack gap="xl">
			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.documents.files") }</Title>
				<Stack gap="sm" mb="lg">
					{ documents.map(document => (
						<Group key={ document.id } justify="space-between">
							<Link href={ document.url } target="_blank">{ document.filename }</Link>
							<DeleteButton
								href={ Routes.employeeDocument(employee.slug, document.id) }
								label={ document.filename }
							/>
						</Group>
					)) }
					{ documents.length === 0 && <Text c="dimmed">{ t("views.employees.show.documents.empty_files") }</Text> }
				</Stack>
				<label>
					<Text size="sm" mb={ 4 }>{ t("views.employees.show.documents.upload_document") }</Text>
					<input
						type="file"
						accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						onChange={ event => uploadDocument(event.target.files) }
					/>
				</label>
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.documents.images") }</Title>
				<Group gap="md" mb="lg">
					{ images.map(image => (
						<Stack key={ image.id } gap="xs">
							<Image src={ image.url } alt={ image.filename } w={ 120 } h={ 120 } fit="cover" />
							<Group justify="space-between">
								<Text size="xs">{ image.filename }</Text>
								<DeleteButton
									href={ Routes.employeeImage(employee.slug, image.id) }
									label={ image.filename }
								/>
							</Group>
						</Stack>
					)) }
					{ images.length === 0 && <Text c="dimmed">{ t("views.employees.show.documents.empty_images") }</Text> }
				</Group>
				<label>
					<Text size="sm" mb={ 4 }>{ t("views.employees.show.documents.upload_image") }</Text>
					<input
						type="file"
						accept="image/png,image/jpeg"
						onChange={ event => uploadImage(event.target.files) }
					/>
				</label>
			</Section>
		</Stack>
	)
}
