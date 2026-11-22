import { useTranslation } from "react-i18next"

import { Avatar, Tooltip } from "@/components"
import { formatter } from "@/lib"

export interface LastEditorAvatarProps {
	editor: {
		name: string
		initials: string
		edited_at?: string
	}
}

export function LastEditorAvatar({ editor }: LastEditorAvatarProps) {
	const { t } = useTranslation()
	const editedAtLabel = editor.edited_at
		? formatter.datetime.dateTimeShort(editor.edited_at)
		: null
	const label = editedAtLabel
		? t("views.timesheets.employee_review.edited_by_at", {
			name: editor.name,
			at: editedAtLabel,
		})
		: t("views.timesheets.employee_review.edited_by", { name: editor.name })

	return (
		<Tooltip label={ label } withArrow>
			<Avatar size="sm" radius="xl" color="gray" aria-label={ label }>
				{ editor.initials }
			</Avatar>
		</Tooltip>
	)
}
