import { PageProps, Errors, ErrorBag } from "@inertiajs/core"
import { usePage } from "@inertiajs/react"

import { type FlashMessage } from "@/types"

export type ActsAsUserSummary = {
	id: string
	email: string
	name: string | null
}

export type ActsAsCandidate = ActsAsUserSummary & {
	agency_role: string | null
	job_title: string | null
}

export type ActsAsShare = {
	active: boolean
	true_user: ActsAsUserSummary
	acting_user: ActsAsCandidate | null
	candidates: ActsAsCandidate[]
}

export interface SharedInertiaProps extends PageProps {
	auth: {
		form_authenticity_token: string
		user: Schema.UsersInertiaShare
		own_employee_slug?: string | null
		own_client_slug?: string | null
		acts_as?: ActsAsShare
	}
	flash: FlashMessage
	errors: Errors & ErrorBag
	settings: Schema.Setting
	permissions: Record<string, Record<string, boolean>>
	can_update?: boolean
	can_updates?: Record<string, boolean>
}

export function usePageProps() {
	return usePage<SharedInertiaProps>().props
}
