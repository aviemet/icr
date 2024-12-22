import { ErrorBag, Errors, PageProps } from '@inertiajs/core'
import { convertDates } from './convertDates'

export const propsMiddleware = (props: PageProps & {
	errors: Errors & ErrorBag
}) => {
	return convertDates(props)
}
