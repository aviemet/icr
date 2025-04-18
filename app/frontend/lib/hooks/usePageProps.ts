import { PageProps, Errors, ErrorBag } from "@inertiajs/core"
import { usePage } from "@inertiajs/react"

export interface SharedInertiaProps extends PageProps {
	auth: {
		form_authenticity_token: string
		user: Schema.UsersInertiaShare
	}
	flash: FlashMessage
	errors: Errors & ErrorBag
	settings: Schema.Setting
	permissions: Record<string, Record<string, boolean>>
}

const usePageProps = () => {
	return usePage<SharedInertiaProps>().props
}

export default usePageProps
