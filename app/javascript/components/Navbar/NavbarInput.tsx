import React from 'react'

export default function NavbarInput({ fontAwesome, ...rest }) {
	return (
		<div className="lg:w-60 sm:w-full bg-opacity-20 relative flex items-center px-3 py-1 bg-white rounded-lg">
			{fontAwesome ? (
				<i className="fas fa-search text-xl text-white"></i>
			) : (
				<span className="material-icons mr-2 text-xl text-white">
                    search
				</span>
			)}
			<input
				{ ...rest }
				className="focus:outline-none focus:ring-0 w-full text-sm font-normal leading-snug text-white placeholder-white placeholder-opacity-50 bg-transparent border-none"
			/>
		</div>
	)
}

NavbarInput.defaultProps = {
	fontAwesome: false,
}

NavbarInput.propTypes = {
	fontAwesome: PropTypes.bool.isRequired,
}
