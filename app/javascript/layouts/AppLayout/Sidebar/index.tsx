import React from 'react'
import { Link } from 'components'
import classnames from 'classnames'
import { Avatar } from '@vechaiui/react'

export default function Sidebar() {

	return (
		<aside className={ classnames('fixed', 'top-0', 'left-0', 'h-full', 'w-20', 'border-r-2', 'shadow-sm') }>
			<Avatar name="Someone Cool" bordered size='lg' />
		</aside>
	)
}
