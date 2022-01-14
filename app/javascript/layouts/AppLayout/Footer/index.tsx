import React from 'react'

const Footer = () => {
	return (
		<footer className="lg:flex-row flex flex-col items-center justify-between px-16 py-6 font-light border-t border-gray-200">
			<p className="lg:mb-0 mb-6 text-gray-700">
                Copyright &copy; {new Date().getFullYear()}{' '}
				<a
					href="https://www.creative-tim.com?ref=mtdk"
					target="_blank"
					rel="noreferrer"
					className="text-light-blue-500 hover:text-light-blue-700"
				>
                    Creative Tim
				</a>
			</p>

			<ul className="list-unstyled flex">
				<li className="mr-6">
					<a
						className="hover:text-gray-900 block text-sm font-medium text-gray-700"
						target="_blank"
						rel="noreferrer"
						href="https://www.creative-tim.com/presentation?ref=mtdk"
					>
                        About Us
					</a>
				</li>
				<li className="mr-6">
					<a
						className="hover:text-gray-900 block text-sm font-medium text-gray-700"
						target="_blank"
						rel="noreferrer"
						href="https://www.creative-tim.com/blog/?ref=mtdk"
					>
                        Blog
					</a>
				</li>
				<li className="mr-6">
					<a
						className="hover:text-gray-900 block text-sm font-medium text-gray-700"
						target="_blank"
						rel="noreferrer"
						href="https://github.com/creativetimofficial/material-tailwind-dashboard-react/blob/main/LICENSE?ref=mtdk"
					>
                        MIT License
					</a>
				</li>
				<li>
					<a
						className="hover:text-gray-900 block text-sm font-medium text-gray-700"
						target="_blank"
						rel="noreferrer"
						href="https://creative-tim.com/contact-us?ref=mtdk"
					>
                        Contact Us
					</a>
				</li>
			</ul>
		</footer>
	)
}

export default Footer
