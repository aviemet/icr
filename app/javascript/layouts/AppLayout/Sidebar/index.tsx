import React, { useState } from 'react'
import AdminNavbar from './AdminNavbar'
import NavLink from './NavLink'
import Icon from '@material-tailwind/react/Icon'
import H6 from '@material-tailwind/react/Heading6'
import { css } from 'astroturf'
import classnames from 'classnames'
import * as Routes from 'routes'

const navLiStyles = css`
	@apply mb-4;
	@apply rounded-lg;
`

export default function Sidebar() {
	const [showSidebar, setShowSidebar] = useState('-left-64')
	return (
		<>
			<AdminNavbar
				showSidebar={ showSidebar }
				setShowSidebar={ setShowSidebar }
			/>
			<div
				className={ `h-screen fixed top-0 md:left-0 ${showSidebar} overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-64 z-10 py-4 px-6 transition-all duration-300` }
			>
				<div className="flex-nowrap relative flex-col items-stretch min-h-full px-0">
					<a
						href="https://material-tailwind.com?ref=mtd"
						target="_blank"
						rel="noreferrer"
						className="inline-block w-full mt-2 text-center"
					>
						<H6 color="gray">Material Tailwind</H6>
					</a>
					<div className="flex flex-col">
						<hr className="min-w-full my-4" />

						<ul className="flex flex-col min-w-full list-none">
							<li className={ classnames(navLiStyles) }>
								<NavLink href={ Routes.root_path() }>
									<Icon name="dashboard" size="2xl" />
									Dashboard
								</NavLink>
							</li>
							<li className={ classnames(navLiStyles) }>
								<NavLink href="/settings">
									<Icon name="settings" size="2xl" />
									Schedules
								</NavLink>
							</li>
							<li className={ classnames(navLiStyles) }>
								<NavLink href="/tables">
									<Icon name="toc" size="2xl" />
									Clients
								</NavLink>
							</li>
							<li className={ classnames(navLiStyles) }>
								<NavLink href="/maps">
									<Icon name="map" size="2xl" />
									Staff
								</NavLink>
							</li>
						</ul>

						<ul className="absolute bottom-0 flex flex-col min-w-full list-none">
							<li className="bg-gradient-to-tr from-light-blue-500 to-light-blue-700 px-4 mb-2 text-white rounded-lg">
								<NavLink href="/maps">
									<Icon name="map" size="2xl" />
									Settings
								</NavLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	)
}
