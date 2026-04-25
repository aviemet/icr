import { router } from "@inertiajs/react"
import { Select, type SelectProps } from "@mantine/core"
import clsx from "clsx"

import { useLocation, usePageProps } from "@/lib/hooks"
import { useStore } from "@/lib/store"
import { useUpdateTablePreferences } from "@/queries"

import * as classes from "./Pagination.css"

interface LimitSelectProps extends SelectProps {
	pagination: Schema.Pagination
	model: string
}

export function LimitSelect({ pagination, model, className }: LimitSelectProps) {
	const { auth: { user } } = usePageProps()
	const location = useLocation()
	const defaultLimit = useStore(state => state.defaults.tableRecordsLimit)
	const mutate = useUpdateTablePreferences({ params: { userId: String(user.id) } })

	const handleLimitChange = (limit: string | null) => {
		if(!model || !user) return

		limit ||= String(defaultLimit)

		mutate.mutate({
			[model]: {
				hide: user.table_preferences?.[model]?.hide ?? {},
				limit,
			},
		}, {
			onSuccess: () => {
				if(parseInt(limit) * (pagination.current_page - 1) > pagination.count) {
					location.params.delete("page")
					router.get(
						location.path,
						{ ...location.paramsAsJson },
						{ preserveScroll: true },
					)
				} else {
					router.reload()
				}
			},
		})
	}

	return (
		<Select
			variant="filled"
			mx={ 4 }
			my={ 0 }
			withCheckIcon={ false }
			className={ clsx(classes.limitSelect, className) }
			rightSectionWidth="1rem"
			defaultValue={ String(pagination.limit) || String(defaultLimit) }
			data={ [
				{ value: "10", label: "10" },
				{ value: "25", label: "25" },
				{ value: "50", label: "50" },
				{ value: "100", label: "100" },
			] }
			onChange={ handleLimitChange }
			aria-label="rows per page"
		/>
	)
}
