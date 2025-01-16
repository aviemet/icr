import { usePage } from '@inertiajs/react'
import { PageProps, Errors, ErrorBag } from '@inertiajs/core'

export interface SharedInertiaProps extends PageProps {
	auth: {
		form_authenticity_token: string
		user: Schema.UsersInertiaShare
	}
	flash: FlashMessage
	errors: Errors & ErrorBag
	settings: Schema.Setting
}

const usePageProps = () => {
	return usePage<SharedInertiaProps>().props
}

export default usePageProps
