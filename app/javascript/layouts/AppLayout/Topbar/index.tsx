import React from 'react'
import { Button, Icon, NavbarInput, Image, Dropdown, DropdownItem } from 'components'
// import ProfilePicture from 'assets/img/team-1-800x800.jpg'

interface TopbarProps {
	showSidebar: boolean
	setShowSidebar: () => void
}

const Topbar = ({ showSidebar, setShowSidebar }: TopbarProps) => {
	console.log('HI')
	return (
		<nav className="bg-light-blue-500 md:ml-64 px-3 py-6">
			<div className="md:pr-8 md:pl-10 container flex items-center justify-between max-w-full mx-auto">
				<div className="md:hidden">
					<Button
						buttonType="link"
						size="lg"
						iconOnly
						rounded
						ripple="light"
						onClick={ () => setShowSidebar('left-0') }
					>
						<Icon name="menu" size="2xl" color="white" />
					</Button>
					<div
						className={ `absolute top-2 md:hidden ${
							showSidebar === 'left-0' ? 'left-64' : '-left-64'
						} z-50 transition-all duration-300` }
					>
						<Button
							buttonType="link"
							size="lg"
							iconOnly
							rounded
							ripple="light"
							onClick={ () => setShowSidebar('-left-64') }
						>
							<Icon name="close" size="2xl" color="white" />
						</Button>
					</div>
				</div>

				<div className="flex items-center justify-between w-full">
					<h4 className="mt-1 text-sm tracking-wider text-white uppercase">
						DASHBOARD
					</h4>

					<div className="flex">
						<NavbarInput placeholder="Search" />

						<div className="ml-6 -mr-4">
							<Dropdown
								buttonText={
									<div className="w-12">
										{ /* <Image src={ ProfilePicture } rounded /> */ }
									</div>
								}
								rounded
								style={ {
									padding: 0,
									color: 'transparent',
								} }
							>
								<DropdownItem color="lightBlue">
                  Action
								</DropdownItem>
								<DropdownItem color="lightBlue">
                  Another Action
								</DropdownItem>
								<DropdownItem color="lightBlue">
                  Something Else
								</DropdownItem>
							</Dropdown>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Topbar
