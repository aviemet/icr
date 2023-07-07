import { useState, useEffect, useCallback } from 'react'
import { omit } from 'lodash'

type OmittedLocationKeys = 'replace'|'reload'|'assign'|'ancestorOrigins'
interface UseLocationReturn extends Omit<Location, OmittedLocationKeys> {
	path: string
	paths: string[]
	paramsToJson: Record<string, string>
	params: URLSearchParams
}

const useLocation = (): UseLocationReturn => {
	const [location, setLocation] = useState(window.location)

	const listenToPopstate = () => {
		setLocation(window.location)
	}

	useEffect(() => {
		window.addEventListener('popstate', listenToPopstate)

		return () => {
			window.removeEventListener('popstate', listenToPopstate)
		}
	}, [])

	const params = new URLSearchParams(location.search)

	return {
		...omit(location, [
			'toString',
			'replace',
			'reload',
			'assign',
			'ancestorOrigins',
		]),
		path: `${location.origin}${location.pathname}`,
		paths: location.pathname.replace(/^\//, '').split('/'),
		params,
		paramsToJson: useCallback(() => {
			const hash: Record<string, string> = {}
			for(const [key, value] of params.entries()) {
				hash[key] = value
			}
			return hash
		}, [params]),
		toString: () => location.toString(),
	}
}

export default useLocation
