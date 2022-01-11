import React from 'react'
import { Link } from 'components'
import classnames from 'classnames'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

export default function Sidebar() {

	return (
		<aside>
			<div>
				<div className={ classnames('text-right', 'link-hover') }>
					<div className={ classnames('cursor-pointer') }><HamburgerMenuIcon /></div>
				</div>

				<nav className={ classnames('links') }>
					<ul>
						<Link href="/dashboard">Dashboard</Link>
					</ul>
				</nav>
			</div>
		</aside>
	)
}
