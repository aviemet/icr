import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Avatar, Group, Stack, Text } from "@/components"
import { DeleteButton } from "@/components/Button"
import { DropzoneField, FormBand } from "@/features"
import { initials, Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface ClientPortraitProps {
	client: Schema.ClientsShow
}

export function ClientPortrait({ client }: ClientPortraitProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const title = client.person?.name || t("views.clients.show.title")
	const hasPortrait = Boolean(client.portrait_url)

	const uploadPortrait = (fileList: FileList | null) => {
		const file = fileList?.[0]
		if(!file) return

		router.post(Routes.clientPortrait(client.slug), {
			portrait: file,
		}, {
			forceFormData: true,
		})
	}

	return (
		<FormBand title={ t("views.clients.show.profile.portrait") }>
			<Stack gap="sm">
				<Group gap="md" align="center">
					<Avatar
						src={ client.portrait_medium_url || client.portrait_url || undefined }
						radius="md"
						size={ 96 }
						color="brand"
					>
						{ initials(title) ?? "?" }
					</Avatar>
					<Stack gap={ 4 }>
						<Text size="sm" c="dimmed">
							{ hasPortrait
								? t("views.clients.show.profile.portrait_current")
								: t("views.clients.show.profile.portrait_empty") }
						</Text>
						{ canUpdate && hasPortrait && (
							<DeleteButton
								href={ Routes.clientPortrait(client.slug) }
								label={ t("views.clients.show.profile.portrait_remove") }
							/>
						) }
					</Stack>
				</Group>
				{ canUpdate && (
					<DropzoneField
						label={ t("views.clients.show.profile.portrait_upload") }
						hint="PNG or JPEG"
						accept="image/png,image/jpeg"
						onSelect={ uploadPortrait }
					/>
				) }
			</Stack>
		</FormBand>
	)
}
